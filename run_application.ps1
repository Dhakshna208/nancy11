# Requires PowerShell
# Run this file to start both the Node.js server and the React client

$projectRoot = $PSScriptRoot

Write-Host "=== Starting TruthLens Application ===" -ForegroundColor Green
Write-Host "Project Root: $projectRoot"

# Start the Node.js Express server in a new window
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\server'; npm start"

# Wait a moment to let the server start
Start-Sleep -Seconds 2

# Start the Client in a new window
Write-Host "Starting Frontend Client..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\client'; npm run dev"

Write-Host "Application is starting up!" -ForegroundColor Green
Write-Host "Two new windows should have opened for the server and client." -ForegroundColor Yellow
Write-Host "Press any key to close this window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
