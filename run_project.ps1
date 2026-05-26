Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "             STARTING PLACERA PROJECT               " -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/2] Starting Node.js Backend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

Write-Host "[2/2] Starting Vite Frontend Client..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host ""
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "PLACERA has been launched successfully!" -ForegroundColor Cyan
Write-Host ""
Write-Host " - Backend API:  http://localhost:5000" -ForegroundColor Yellow
Write-Host " - Frontend App:  http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "Both processes are running in separate window instances."
Write-Host "===================================================" -ForegroundColor Cyan
