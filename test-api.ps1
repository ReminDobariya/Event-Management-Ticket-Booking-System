# PowerShell script to test all API endpoints
# Make sure all services are running before executing this script

Write-Host "=== Testing Event Management & Ticket Booking System ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Checks
Write-Host "1. Testing Health Checks..." -ForegroundColor Yellow
Write-Host "Event Service:" -ForegroundColor White
Invoke-RestMethod -Uri "http://localhost:4001/health" -Method Get | ConvertTo-Json
Write-Host ""

Write-Host "Booking Service:" -ForegroundColor White
Invoke-RestMethod -Uri "http://localhost:4002/health" -Method Get | ConvertTo-Json
Write-Host ""

Write-Host "Payment Service:" -ForegroundColor White
Invoke-RestMethod -Uri "http://localhost:4003/health" -Method Get | ConvertTo-Json
Write-Host ""

Write-Host "Notification Service:" -ForegroundColor White
Invoke-RestMethod -Uri "http://localhost:4004/health" -Method Get | ConvertTo-Json
Write-Host ""

# Test 2: Create Event
Write-Host "2. Creating Event..." -ForegroundColor Yellow
$eventBody = @{
    eventId = "TEST002"
    name = "Test Event"
    category = "Test"
    date = "2024-12-31T20:00:00Z"
    venue = "Test Venue"
    totalSeats = 100
    availableSeats = 100
    ticketPrice = 25
} | ConvertTo-Json

$eventResponse = Invoke-RestMethod -Uri "http://localhost:4001/events/add" -Method Post -Body $eventBody -ContentType "application/json"
Write-Host "Event Created:" -ForegroundColor Green
$eventResponse | ConvertTo-Json -Depth 5
Write-Host ""

# Test 3: Get All Events
Write-Host "3. Getting All Events..." -ForegroundColor Yellow
$allEvents = Invoke-RestMethod -Uri "http://localhost:4001/events/" -Method Get
Write-Host "Total Events: $($allEvents.count)" -ForegroundColor Green
$allEvents | ConvertTo-Json -Depth 5
Write-Host ""

# Test 4: Create Booking
Write-Host "4. Creating Booking..." -ForegroundColor Yellow
$bookingBody = @{
    userId = "TESTUSER"
    eventId = "TEST001"
    numberOfTickets = 3
} | ConvertTo-Json

$bookingResponse = Invoke-RestMethod -Uri "http://localhost:4002/bookings/create" -Method Post -Body $bookingBody -ContentType "application/json"
Write-Host "Booking Created:" -ForegroundColor Green
$bookingResponse | ConvertTo-Json -Depth 5
Write-Host ""

$bookingId = $bookingResponse.data.bookingId
$paymentId = $bookingResponse.data.paymentId

# Test 5: Get Bookings by User
Write-Host "5. Getting Bookings for User..." -ForegroundColor Yellow
$userBookings = Invoke-RestMethod -Uri "http://localhost:4002/bookings/TESTUSER" -Method Get
Write-Host "User Bookings:" -ForegroundColor Green
$userBookings | ConvertTo-Json -Depth 5
Write-Host ""

# Test 6: Check Payment Status (if paymentId exists)
if ($paymentId) {
    Write-Host "6. Checking Payment Status..." -ForegroundColor Yellow
    try {
        $paymentStatus = Invoke-RestMethod -Uri "http://localhost:4003/payments/$paymentId/status" -Method Get
        Write-Host "Payment Status:" -ForegroundColor Green
        $paymentStatus | ConvertTo-Json -Depth 5
    } catch {
        Write-Host "Payment ID not found or service error" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 7: Get Notifications
Write-Host "7. Getting Notifications for User..." -ForegroundColor Yellow
$notifications = Invoke-RestMethod -Uri "http://localhost:4004/notifications/user/TESTUSER" -Method Get
Write-Host "Notifications:" -ForegroundColor Green
$notifications | ConvertTo-Json -Depth 5
Write-Host ""

# Test 8: Verify Event Updated
Write-Host "8. Verifying Event Seats Updated..." -ForegroundColor Yellow
$updatedEvent = Invoke-RestMethod -Uri "http://localhost:4001/events/TEST001" -Method Get
Write-Host "Updated Event:" -ForegroundColor Green
Write-Host "Available Seats: $($updatedEvent.data.availableSeats)" -ForegroundColor Cyan
$updatedEvent | ConvertTo-Json -Depth 5
Write-Host ""

Write-Host "=== Testing Complete ===" -ForegroundColor Cyan

