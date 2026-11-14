<#
.SYNOPSIS
  Zero-Install Headless .blend -> .glb Draco Lifecycle Pipeline (.venv isolated).
  1. Spins up local .venv
  2. Tries installing PyPI `bpy` wheel; falls back to Portable Blender ZIP inside .venv
  3. Converts tshirt.blend -> tshirt.glb (no hanger, fixed back normals, 16-bit Draco)
  4. Optionally pushes to GitHub & purges jsDelivr cache (-Push)
  5. Cleanly deactivates and removes .venv when finished (pass -KeepVenv to retain cache)
#>
param(
    [string]$InputBlend = "tshirt.blend",
    [string]$OutputGlb  = "tshirt.glb",
    [switch]$Push,
    [switch]$KeepVenv
)

$ErrorActionPreference = "Stop"
$RepoRoot   = $PSScriptRoot
if (-not $RepoRoot) { $RepoRoot = (Get-Location).Path }
Set-Location $RepoRoot

$BlendPath  = Join-Path $RepoRoot $InputBlend
$GlbPath    = Join-Path $RepoRoot $OutputGlb
$PyScript   = Join-Path $RepoRoot "convert_blend_to_glb.py"
$VenvDir    = Join-Path $RepoRoot ".venv"

if (-not (Test-Path $BlendPath)) {
    Write-Error "Could not find '$BlendPath'. Place tshirt.blend in $RepoRoot."
    exit 1
}
if (-not (Test-Path $PyScript)) {
    Write-Error "Could not find '$PyScript'. Save convert_blend_to_glb.py in $RepoRoot."
    exit 1
}

try {
    # -------------------------------------------------------------------------
    # STEP 1: Spin up isolated Python virtual environment (.venv)
    # -------------------------------------------------------------------------
    if (-not (Test-Path (Join-Path $VenvDir "Scripts\python.exe"))) {
        Write-Host "[1/5] Creating isolated Python virtual environment (.venv)..." -ForegroundColor Cyan
        if (Get-Command "py" -ErrorAction SilentlyContinue) {
            # Prefer Python 3.11 or 3.13 if installed via py launcher for native PyPI bpy wheel support
            try { py -3.11 -m venv $VenvDir 2>$null } catch {}
            if (-not (Test-Path (Join-Path $VenvDir "Scripts\python.exe"))) {
                py -m venv $VenvDir
            }
        } else {
            python -m venv $VenvDir
        }
    } else {
        Write-Host "[1/5] Using existing .venv environment..." -ForegroundColor Cyan
    }

    $VenvPython = Join-Path $VenvDir "Scripts\python.exe"
    $VenvPip    = Join-Path $VenvDir "Scripts\pip.exe"

    # -------------------------------------------------------------------------
    # STEP 2: Provision Headless Blender (PyPI `bpy` or Portable ZIP inside .venv)
    # -------------------------------------------------------------------------
    Write-Host "[2/5] Provisioning headless Blender engine inside .venv..." -ForegroundColor Cyan
    $UsePyPiBpy = $false

    $HasBpy = & $VenvPython -c "import importlib.util; print('1' if importlib.util.find_spec('bpy') else '0')" 2>$null
    if ($HasBpy -eq "1") {
        $UsePyPiBpy = $true
        Write-Host "  -> PyPI 'bpy' module is ready in .venv." -ForegroundColor Green
    } else {
        Write-Host "  -> Attempting 'pip install bpy' inside .venv..." -ForegroundColor DarkCyan
        try {
            & $VenvPython -m pip install --upgrade pip --quiet
            & $VenvPip install bpy --extra-index-url https://download.blender.org/pypi/ --quiet 2>$null
            $CheckAfter = & $VenvPython -c "import importlib.util; print('1' if importlib.util.find_spec('bpy') else '0')" 2>$null
            if ($CheckAfter -eq "1") {
                $UsePyPiBpy = $true
                Write-Host "  -> Successfully installed PyPI 'bpy' wheel into .venv." -ForegroundColor Green
            }
        } catch {
            $UsePyPiBpy = $false
        }
    }

    $PortableBlenderExe = $null
    if (-not $UsePyPiBpy) {
        Write-Host "  -> Host Python ABI differs from PyPI bpy wheels; fetching Portable Blender 4.2 LTS ZIP into .venv..." -ForegroundColor Yellow
        $PortableDir = Join-Path $VenvDir "blender-portable"
        $ZipPath     = Join-Path $VenvDir "blender-portable.zip"
        $BlenderUrl  = "https://download.blender.org/release/Blender4.2/blender-4.2.3-windows-x64.zip"

        $ExistingExe = Get-ChildItem -Path $PortableDir -Filter "blender.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
        if (-not $ExistingExe) {
            New-Item -ItemType Directory -Force -Path $PortableDir | Out-Null
            Write-Host "  -> Downloading $BlenderUrl ..." -ForegroundColor Cyan
            curl.exe -L $BlenderUrl -o $ZipPath
            Write-Host "  -> Extracting Portable Blender into .venv\blender-portable ..." -ForegroundColor Cyan
            Expand-Archive -Path $ZipPath -DestinationPath $PortableDir -Force
            Remove-Item $ZipPath -Force -ErrorAction SilentlyContinue
            $ExistingExe = Get-ChildItem -Path $PortableDir -Filter "blender.exe" -Recurse | Select-Object -First 1
        }

        $PortableBlenderExe = $ExistingExe.FullName
        # Create 'portable' config folder beside blender.exe so it never touches %APPDATA%
        $PortableConfigDir = Join-Path (Split-Path $PortableBlenderExe -Parent) "portable"
        New-Item -ItemType Directory -Force -Path $PortableConfigDir | Out-Null
        Write-Host "  -> Portable Blender ready at: $PortableBlenderExe" -ForegroundColor Green
    }

    # -------------------------------------------------------------------------
    # STEP 3: Run Headless Conversion (tshirt.blend -> tshirt.glb)
    # -------------------------------------------------------------------------
    Write-Host "[3/5] Converting '$InputBlend' -> '$OutputGlb' (Fixing back normals & applying 16-bit Draco)..." -ForegroundColor Cyan
    if ($UsePyPiBpy) {
        & $VenvPython $PyScript $BlendPath $GlbPath
    } else {
        & $PortableBlenderExe -b -noaudio --python $PyScript -- $BlendPath $GlbPath
    }

    if (-not (Test-Path $GlbPath)) {
        throw "Conversion failed: '$GlbPath' was not created."
    }

    $GlbSizeMB = [math]::Round((Get-Item $GlbPath).Length / 1MB, 2)
    Write-Host "[4/5] Verified output: $OutputGlb ($GlbSizeMB MB)" -ForegroundColor Green

    # -------------------------------------------------------------------------
    # STEP 4: Optional Git Push & jsDelivr Edge Cache Purge
    # -------------------------------------------------------------------------
    if ($Push) {
        Write-Host "  -> Committing and pushing to kr10o/carrd-threejs (main)..." -ForegroundColor Yellow
        git add $OutputGlb style.css script.js
        git commit -m "chore(3d): convert tshirt.blend to clean 16-bit Draco tshirt.glb"
        git push origin main

        Invoke-RestMethod -Uri "https://purge.jsdelivr.net/gh/kr10o/carrd-threejs@main/tshirt.glb" | Out-Null
        Invoke-RestMethod -Uri "https://purge.jsdelivr.net/gh/kr10o/carrd-threejs@main/style.css" | Out-Null
        Invoke-RestMethod -Uri "https://purge.jsdelivr.net/gh/kr10o/carrd-threejs@main/script.js" | Out-Null
        Write-Host "  -> jsDelivr CDN cache purged!" -ForegroundColor Green
    }
}
finally {
    # -------------------------------------------------------------------------
    # STEP 5: Cleanly deactivate and remove .venv unless -KeepVenv is set
    # -------------------------------------------------------------------------
    if (Test-Path Function:\deactivate) {
        deactivate
    }
    if (-not $KeepVenv -and (Test-Path $VenvDir)) {
        Write-Host "[5/5] Cleaning up temporary .venv environment..." -ForegroundColor Cyan
        Remove-Item -Path $VenvDir -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "Done! .venv removed and '$OutputGlb' is ready." -ForegroundColor Green
    } else {
        Write-Host "[5/5] Retained .venv cache (-KeepVenv enabled). '$OutputGlb' is ready." -ForegroundColor Green
    }
}
