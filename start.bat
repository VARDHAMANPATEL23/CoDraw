@echo off
TITLE CoDraw Application Suite Launcher & Monitor (Bun)

echo =========================================
echo  Starting CoDraw Application Suite (Bun)
echo =========================================

REM Start Express API server in new cmd window
echo [1/2] Launching Express API Server on port 5000...
start "CoDraw Server (Port 5000)" cmd /k "cd /d %~dp0\server && bun run index.js"

REM Start React Client in new cmd window
echo [2/2] Launching React Client Builder on port 3000...
start "CoDraw Client (Port 3000)" cmd /k "cd /d %~dp0\client && bun run start"

echo.
echo Both services have been launched in separate windows.
echo Monitoring services... Press Ctrl+C or close this window to stop monitoring.
echo -----------------------------------------

:MONITOR
timeout /t 5 >nul

echo Checking service status...

REM Check API Server
powershell -Command "$r = Try { Invoke-WebRequest -Uri 'http://localhost:5000/api/health' -UseBasicParsing -TimeoutSec 2 } Catch { $null }; if ($r.StatusCode -eq 200) { Write-Host '  - Express API  : ONLINE' -ForegroundColor Green } Else { Write-Host '  - Express API  : OFFLINE/STARTING' -ForegroundColor Yellow }"

REM Check React Client
powershell -Command "$r = Try { Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 2 } Catch { $null }; if ($r.StatusCode -eq 200) { Write-Host '  - React Client : ONLINE' -ForegroundColor Green } Else { Write-Host '  - React Client : OFFLINE/STARTING' -ForegroundColor Yellow }"

echo -----------------------------------------
goto MONITOR
