@echo off
setlocal
cd /d "%~dp0"

echo Starting isolated .venv Headless Blender -> Draco GLB Pipeline...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-blend-to-glb.ps1" %*

endlocal
