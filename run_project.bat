@echo off
title PLACERA Runner
echo ===================================================
echo             STARTING PLACERA PROJECT               
echo ===================================================
echo.
echo [1/2] Starting Node.js Backend Server...
start "PLACERA Backend" cmd /k "cd backend && npm run dev"

echo [2/2] Starting Vite Frontend Client...
start "PLACERA Frontend" cmd /k "cd frontend && npm run dev"
echo.
echo ===================================================
echo PLACERA has been launched successfully!
echo.
echo - Backend API: http://localhost:5000
echo - Frontend App: http://localhost:5173
echo.
echo Close this window to keep them running.
echo ===================================================
pause
