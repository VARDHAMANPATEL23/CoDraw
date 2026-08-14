<# : 2>NUL
@echo off
TITLE CoDraw TUI Dashboard

REM Start Express API server in new cmd window
start "CoDraw Server (Port 5000)" cmd /k "cd /d %~dp0\server && bun run index.js"

REM Start React Client in new cmd window
start "CoDraw Client (Port 3000)" cmd /k "cd /d %~dp0\client && bun run start"

REM Execute the PowerShell portion of this file
powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-Command -ScriptBlock ([scriptblock]::Create((Get-Content '%~f0' -Raw)))"
exit /b
#>

$esc = [char]27
[console]::CursorVisible = $false
Clear-Host

try {
  while ($true) {
    [console]::SetCursorPosition(0,0)
    
    $serverStatus = 'DOWN'
    try { $r = Invoke-WebRequest -Uri 'http://localhost:5000/api/health' -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop; if ($r.StatusCode -eq 200) { $serverStatus = 'OK' } } catch {}
    
    $clientStatus = 'DOWN'
    try { $r = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop; if ($r.StatusCode -eq 200) { $clientStatus = 'OK' } } catch {}
    
    $time = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    
    $cpu = "N/A"
    try { $cpu = [math]::Round((Get-WmiObject win32_processor | Measure-Object -Property LoadPercentage -Average | Select-Object -ExpandProperty Average)) } catch {}
    
    $memUsage = "N/A"
    $up = "N/A"
    try {
        $mem = Get-CimInstance Win32_OperatingSystem
        $memUsage = "$([math]::Round(($mem.TotalVisibleMemorySize - $mem.FreePhysicalMemory) / 1024))MB / $([math]::Round($mem.TotalVisibleMemorySize / 1024))MB"
        $up = (New-TimeSpan -Start $mem.LastBootUpTime -End (Get-Date)).ToString('d\d\ h\h\ m\m')
    } catch {}
    
    $user = $env:USERNAME
    $hostn = $env:COMPUTERNAME
    $os = (Get-CimInstance Win32_OperatingSystem).Caption

    $out = "$esc[36m$esc[1m   ______      ____                        $esc[K`n"
    $out += "  / ____/___  / __ \_________ __      __   $esc[K`n"
    $out += " / /   / __ \/ / / / ___/ __ ``/ | /| / /   $esc[K`n"
    $out += "/ /___/ /_/ / /_/ / /  / /_/ /| |/ |/ /    $esc[K`n"
    $out += "\____/\____/_____/_/   \__,_/ |__/|__/     $esc[0m$esc[K`n"
    $out += "$esc[K`n"
    
    $out += " $esc[1m$esc[34msys$esc[0m       $user@$hostn$esc[K`n"
    $out += " $esc[1m$esc[34mos$esc[0m        $os$esc[K`n"
    $out += " $esc[1m$esc[34mup$esc[0m        $up$esc[K`n"
    $out += " $esc[1m$esc[34mram$esc[0m       $memUsage$esc[K`n"
    $out += " $esc[1m$esc[34mcpu$esc[0m       $cpu%$esc[K`n"
    $out += " $esc[1m$esc[34mtime$esc[0m      $time$esc[K`n"
    $out += "$esc[K`n"
    
    $out += " $esc[1m$esc[35mservices$esc[0m  $esc[36mCoDraw Engine$esc[0m$esc[K`n"
    
    $s_text = if ($serverStatus -eq 'OK') { "$esc[32m● ONLINE $esc[0m" } else { "$esc[33m○ STARTING...$esc[0m" }
    $c_text = if ($clientStatus -eq 'OK') { "$esc[32m● ONLINE $esc[0m" } else { "$esc[33m○ STARTING...$esc[0m" }
    
    $out += " $esc[1m$esc[34m├─ api$esc[0m    Port: 5000 | Status: $s_text$esc[K`n"
    $out += " $esc[1m$esc[34m└─ ui$esc[0m     Port: 3000 | Status: $c_text$esc[K`n"
    $out += "$esc[K`n"
    
    $out += " $esc[2mPress Ctrl+C to exit dashboard...$esc[0m$esc[K`n"
    $out += "$esc[J"
    
    Write-Host -NoNewline $out
    
    Start-Sleep -Seconds 2
  }
} finally {
  [console]::CursorVisible = $true
}
