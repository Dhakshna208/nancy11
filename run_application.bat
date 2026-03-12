@echo off
echo =========================================
echo    Starting TruthLens Application
echo =========================================

echo Starting Backend Server...
start cmd /k "cd /d %~dp0server && npm start"

timeout /t 2 /nobreak >nul

echo Starting Frontend Client...
start cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo Application is starting up!
echo Two new command prompt windows should have opened.
echo You can close this window now.
pause
