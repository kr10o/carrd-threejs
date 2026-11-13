param(
    [string]$InputFile = "tshirt-raw.glb",
    [string]$OutputFile = "tshirt.glb",
    [switch]$PurgeCdn = $false
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $InputFile)) {
    Write-Error "Input GLB file '$InputFile' not found in $(Get-Location)."
    exit 1
}

# Create isolated temporary workspace
$TempDir = Join-Path $PSScriptRoot ".glb_build_tmp"
if (Test-Path $TempDir) { Remove-Item -Recurse -Force $TempDir }
New-Item -ItemType Directory -Path $TempDir | Out-Null

try {
    Write-Host "[1/5] Pruning & Welding Geometry..." -ForegroundColor Cyan
    npx --yes @gltf-transform/cli prune $InputFile "$TempDir\01-pruned.glb"
    npx --yes @gltf-transform/cli weld "$TempDir\01-pruned.glb" "$TempDir\02-welded.glb"

    Write-Host "[2/5] Generating MikkTSpace Tangents for Baked Normal Maps..." -ForegroundColor Cyan
    npx --yes @gltf-transform/cli tangents "$TempDir\02-welded.glb" "$TempDir\03-tangents.glb"

    Write-Host "[3/5] Resizing Embedded Textures to 2048x2048..." -ForegroundColor Cyan
    npx --yes @gltf-transform/cli resize "$TempDir\03-tangents.glb" "$TempDir\04-resized.glb" --width 2048 --height 2048

    Write-Host "[4/5] Encoding Baked Normal & AO Maps to WebP (Quality 92)..." -ForegroundColor Cyan
    npx --yes @gltf-transform/cli webp "$TempDir\04-resized.glb" "$TempDir\05-webp.glb" --quality 92

    Write-Host "[5/5] Applying 14-Bit Draco Edgebreaker Compression..." -ForegroundColor Cyan
    npx --yes @gltf-transform/cli draco "$TempDir\05-webp.glb" $OutputFile --method edgebreaker --quantize-position 14 --quantize-normal 12 --quantize-texcoord 14 --quantize-color 8 --quantize-generic 12

    $InKB  = [math]::Round((Get-Item $InputFile).Length / 1KB, 1)
    $OutKB = [math]::Round((Get-Item $OutputFile).Length / 1KB, 1)
    $Ratio = [math]::Round((1 - ($OutKB / $InKB)) * 100, 1)

    Write-Host "[SUCCESS] $InputFile ($InKB KB) -> $OutputFile ($OutKB KB) [$Ratio% reduction]" -ForegroundColor Green

    if ($PurgeCdn) {
        Write-Host "[CDN] Purging jsDelivr cache for kr10o/carrd-threejs@main..." -ForegroundColor Yellow
        Invoke-RestMethod -Uri "https://purge.jsdelivr.net/gh/kr10o/carrd-threejs@main/$OutputFile" -Method Get | Out-Null
        Invoke-RestMethod -Uri "https://purge.jsdelivr.net/gh/kr10o/carrd-threejs@main/script.js" -Method Get | Out-Null
        Invoke-RestMethod -Uri "https://purge.jsdelivr.net/gh/kr10o/carrd-threejs@main/style.css" -Method Get | Out-Null
        Write-Host "[CDN] Purge complete." -ForegroundColor Green
    }
}
finally {
    if (Test-Path $TempDir) {
        Remove-Item -Recurse -Force $TempDir
    }
}