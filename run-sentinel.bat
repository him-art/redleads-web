@echo off
echo =============================================
echo   RedLeads Hybrid RSS Monitor (Production)
echo =============================================
echo.
echo [INFO] This worker monitors subreddits via RSS and processes high-intent leads.
echo [INFO] Press Ctrl+C to stop the monitor gracefully.
echo.
echo ----------------------------------------
npm run worker
pause
