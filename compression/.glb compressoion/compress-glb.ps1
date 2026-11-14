<#
.SYNOPSIS
  Save this in your kr10o/carrd-threejs repository root as compress-glb.ps1 and run it with .\compress-glb.ps1 -InputGlb "raw-tshirt.glb" -Push:
  Gentle, seam-safe Draco compression for Blender/CLO3D garment .glb files.
  Avoids vertex welding and uses 16-bit position / 12-bit normal quantization
  to prevent polygon fractures on the T-shirt back panel.
#>
param(
    [string]$InputGlb = "raw-tshirt.glb",
    [string]$OutputGlb = "tshirt.glb",
    [switch]$Push
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $InputGlb)) {
    Write-Error "Input file '$InputGlb' not found."
    exit 1
}

$TempPruned = "_temp_pruned.glb"

Write-Host "[1/3] Pruning unused properties (Skipping destructive vertex weld)..." -ForegroundColor Cyan
gltf-transform prune $InputGlb $TempPruned

Write-Host "[2/3] Applying gentle high-precision Draco compression (16-bit Pos / 12-bit Norm / Sequential)..." -ForegroundColor Cyan
gltf-transform draco $TempPruned $OutputGlb `
    --method sequential `
    --quantize-position 16 `
    --quantize-normal 12 `
    --quantize-texcoord 14 `
    --encode-speed 3 `
    --decode-speed 5

if (Test-Path $TempPruned) {
    Remove-Item $TempPruned -Force
}

$OrigSize = [math]::Round((Get-Item $InputGlb).Length / 1MB, 2)
$NewSize  = [math]::Round((Get-Item $OutputGlb).Length / 1MB, 2)
Write-Host "[3/3] Compression complete: $OrigSize MB -> $NewSize MB ($OutputGlb)" -ForegroundColor Green

if ($Push) {
    Write-Host "Pushing to GitHub (kr10o/carrd-threejs@main) and purging jsDelivr cache..." -ForegroundColor Yellow
    git add $OutputGlb style.css script.js
    git commit -m "chore(3d): gentle 16-bit Draco tshirt.glb and onClick rotation"
    git push origin main

    Invoke-RestMethod -Uri "https://purge.jsdelivr.net/gh/kr10o/carrd-threejs@main/tshirt.glb" | Out-Null
    Invoke-RestMethod -Uri "https://purge.jsdelivr.net/gh/kr10o/carrd-threejs@main/style.css" | Out-Null
    Invoke-RestMethod -Uri "https://purge.jsdelivr.net/gh/kr10o/carrd-threejs@main/script.js" | Out-Null
    Write-Host "jsDelivr Edge Cache Purged!" -ForegroundColor Green
}
