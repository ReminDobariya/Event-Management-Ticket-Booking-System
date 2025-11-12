# 🎫 Event Management & Ticket Booking System

A complete **Service-Oriented Architecture (SOA)** project built with **Node.js + Express + MongoDB**, consisting of 4 independent microservices that communicate via REST APIs.

## 🏗️ Architecture Overview

This system consists of 4 independent services:

1. **Event Listing Service** (Port 4001) - Manages events and seat availability
2. **Ticket Booking Service** (Port 4002) - Handles ticket bookings
3. **Payment Service** (Port 4003) - Processes payments
4. **Notification Service** (Port 4004) - Sends notifications/emails

## 📁 Project Structure

```
project/
├── event-service/
│   ├── server.js
│   ├── models/Event.js
│   ├── routes/eventRoutes.js
│   ├── controllers/eventController.js
│   ├── .env.example
│   └── package.json
├── booking-service/
│   ├── server.js
│   ├── models/Booking.js
│   ├── routes/bookingRoutes.js
│   ├── controllers/bookingController.js
│   ├── .env.example
│   └── package.json
├── payment-service/
│   ├── server.js
│   ├── models/Payment.js
│   ├── routes/paymentRoutes.js
│   ├── controllers/paymentController.js
│   ├── .env.example
│   └── package.json
├── notification-service/
│   ├── server.js
│   ├── models/Notification.js
│   ├── routes/notificationRoutes.js
│   ├── controllers/notificationController.js
│   ├── .env.example
│   └── package.json
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)
- npm or yarn

### Installation Steps

1. **Clone/Navigate to the project directory**

2. **Install dependencies for each service:**

```bash
# Event Service
cd event-service
npm install
cp .env.example .env
cd ..

# Booking Service
cd booking-service
npm install
cp .env.example .env
cd ..

# Payment Service
cd payment-service
npm install
cp .env.example .env
cd ..

# Notification Service
cd notification-service
npm install
cp .env.example .env
cd ..
```

3. **Start all services**

Open 4 separate terminal windows/tabs and run:

```bash
# Terminal 1 - Event Service
cd event-service
npm start

# Terminal 2 - Booking Service
cd booking-service
npm start

# Terminal 3 - Payment Service
cd payment-service
npm start

# Terminal 4 - Notification Service
cd notification-service
npm start
```

Or use the provided start script (if available):

```bash
# Windows PowerShell
.\start-all-services.ps1

# Linux/macOS
chmod +x start-all-services.sh
./start-all-services.sh
```

## 📡 API Endpoints

### 1. Event Listing Service (Port 4001)

#### Create Event
```http
POST http://localhost:4001/events/add
Content-Type: application/json

{
  "eventId": "EVT001",
  "name": "Summer Music Festival",
  "category": "Music",
  "date": "2024-07-15T18:00:00Z",
  "venue": "Central Park",
  "totalSeats": 1000,
  "availableSeats": 1000,
  "ticketPrice": 50
}
```

#### Get All Events
```http
GET http://localhost:4001/events/
```

#### Get Event by ID
```http
GET http://localhost:4001/events/EVT001
```

#### Update Event
```http
PUT http://localhost:4001/events/EVT001
Content-Type: application/json

{
  "availableSeats": 950,
  "ticketPrice": 55
}
```

#### Delete Event
```http
DELETE http://localhost:4001/events/EVT001
```

### 2. Ticket Booking Service (Port 4002)

#### Create Booking
```http
POST http://localhost:4002/bookings/create
Content-Type: application/json

{
  "userId": "USER123",
  "eventId": "EVT001",
  "numberOfTickets": 2
}
```

#### Get Bookings by User
```http
GET http://localhost:4002/bookings/USER123
```

#### Update Booking Status
```http
PUT http://localhost:4002/bookings/BK1234567890/status
Content-Type: application/json

{
  "status": "cancelled"
}
```

### 3. Payment Service (Port 4003)

#### Initiate Payment
```http
POST http://localhost:4003/payments/initiate
Content-Type: application/json

{
  "bookingId": "BK1234567890",
  "amount": 100
}
```

#### Get Payment Status
```http
GET http://localhost:4003/payments/PAY1234567890/status
```

### 4. Notification Service (Port 4004)

#### Send Notification
```http
POST http://localhost:4004/notifications/send
Content-Type: application/json

{
  "userId": "USER123",
  "bookingId": "BK1234567890",
  "paymentId": "PAY1234567890",
  "message": "Your booking has been confirmed!"
}
```

#### Get Notifications by User
```http
GET http://localhost:4004/notifications/user/USER123
```

## 🔄 Service Communication Flow

1. **Booking Flow:**
   - User creates booking via Booking Service
   - Booking Service calls Event Service to verify seat availability
   - Booking Service updates available seats in Event Service
   - Booking Service calls Payment Service to initiate payment
   - Payment Service processes payment (simulated)
   - On success, Payment Service calls Notification Service
   - Notification Service sends confirmation notification

2. **Cancellation Flow:**
   - User cancels booking via Booking Service
   - Booking Service releases seats back to Event Service
   - Booking status updated to "cancelled"

## 🧪 Testing the System

### Example Workflow:

1. **Create an Event:**
```bash
curl -X POST http://localhost:4001/events/add \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "EVT001",
    "name": "Summer Music Festival",
    "category": "Music",
    "date": "2024-07-15T18:00:00Z",
    "venue": "Central Park",
    "totalSeats": 1000,
    "availableSeats": 1000,
    "ticketPrice": 50
  }'
```

2. **Create a Booking:**
```bash
curl -X POST http://localhost:4002/bookings/create \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER123",
    "eventId": "EVT001",
    "numberOfTickets": 2
  }'
```

3. **Check Payment Status:**
```bash
# Use the paymentId from the booking response
curl http://localhost:4003/payments/PAY1234567890/status
```

4. **Check Notifications:**
```bash
curl http://localhost:4004/notifications/user/USER123
```

## 🛠️ Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **HTTP Client:** Axios (for inter-service communication)
- **Environment:** dotenv

## 📝 Environment Variables

Each service has its own `.env` file.

- `PORT` - Service port number
- `MONGODB_URI` - MongoDB connection string
- Service URLs for inter-service communication

## 🔍 Health Checks

All services expose a health check endpoint:

```http
GET http://localhost:4001/health
GET http://localhost:4002/health
GET http://localhost:4003/health
GET http://localhost:4004/health
```

## 📊 Database Collections

- **Event Service:** `events`
- **Booking Service:** `bookings`
- **Payment Service:** `payments`
- **Notification Service:** `notifications`



