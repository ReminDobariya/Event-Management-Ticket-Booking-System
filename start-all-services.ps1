# PowerShell script to start all services
Write-Host "Starting all SOA services..." -ForegroundColor Green

# Start Event Service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd event-service; npm start" -WindowStyle Normal

Start-Sleep -Seconds 2

# Start Booking Service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd booking-service; npm start" -WindowStyle Normal

Start-Sleep -Seconds 2

# Start Payment Service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd payment-service; npm start" -WindowStyle Normal

Start-Sleep -Seconds 2

# Start Notification Service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd notification-service; npm start" -WindowStyle Normal

Write-Host "All services started in separate windows!" -ForegroundColor Green
Write-Host "Check each window for service status" -ForegroundColor Yellow


