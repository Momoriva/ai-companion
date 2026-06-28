@echo off
setlocal

cd /d "%~dp0"

set "PORT=%~1"
if "%PORT%"=="" set "PORT=3000"

echo Building AI Companion for stable local preview...
call npm.cmd run build
if errorlevel 1 (
  echo.
  echo Build failed. The preview server was not started.
  pause
  exit /b 1
)

echo.
echo Starting stable preview at http://127.0.0.1:%PORT%/
echo Press Ctrl+C to stop.
echo.

call npm.cmd run start -- -H 127.0.0.1 -p %PORT%

echo.
echo Local preview server stopped.
pause
