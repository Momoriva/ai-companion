@echo off
setlocal

cd /d "%~dp0"

set "PORT=%~1"
if "%PORT%"=="" set "PORT=3000"

echo Starting AI Companion at http://127.0.0.1:%PORT%/
echo Press Ctrl+C to stop.
echo.

where npm.cmd >nul 2>nul
if errorlevel 1 (
  node node_modules\next\dist\bin\next dev -H 127.0.0.1 -p %PORT%
) else (
  call npm.cmd run dev -- -H 127.0.0.1 -p %PORT%
)

echo.
echo Local dev server stopped.
pause
