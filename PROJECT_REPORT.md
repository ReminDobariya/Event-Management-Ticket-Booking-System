# Event Management & Ticket Booking System
## Service-Oriented Architecture (SOA) Project Report

---

## 1. Introduction

This project implements a **Service-Oriented Architecture (SOA)** for an Event Management & Ticket Booking System using **Node.js, Express, and MongoDB**. The system is divided into 4 independent microservices that communicate via REST APIs, demonstrating the principles of service-oriented architecture where each service handles a specific business function.

The system allows users to:
- Browse and manage events
- Book tickets for events
- Process payments
- Receive booking confirmations via notifications

---

## 2. Architecture Overview

The system follows a **microservices architecture** pattern where each service:
- Runs independently on separate ports
- Has its own MongoDB database
- Communicates with other services via HTTP/REST APIs
- Can be developed, deployed, and scaled independently

### Service Ports:
- **Event Service**: Port 4001
- **Booking Service**: Port 4002
- **Payment Service**: Port 4003
- **Notification Service**: Port 4004

---

## 3. Services Description

### 3.1 Event Listing Service (Port 4001)
**Purpose**: Manages event information and seat availability

**Key Features**:
- Create, read, update, and delete events
- Track total seats and available seats
- Manage event details (name, category, date, venue, ticket price)

**Database**: `event_service_db`

**APIs**:
- `POST /events/add` - Create new event
- `GET /events/` - Get all events
- `GET /events/:id` - Get event by ID
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event

---

### 3.2 Ticket Booking Service (Port 4002)
**Purpose**: Handles ticket booking operations

**Key Features**:
- Create bookings for events
- Verify seat availability (calls Event Service)
- Update seat availability after booking
- Manage booking status (pending_payment, confirmed, cancelled)
- Integrate with Payment Service

**Database**: `booking_service_db`

**APIs**:
- `POST /bookings/create` - Create new booking
- `GET /bookings/:userId` - Get bookings by user
- `PUT /bookings/:id/status` - Update booking status

**Inter-Service Calls**:
- Calls Event Service to check availability
- Calls Event Service to update seats
- Calls Payment Service to process payment

---

### 3.3 Payment Service (Port 4003)
**Purpose**: Processes payment transactions

**Key Features**:
- Simulate payment processing (90% success rate)
- Track payment status (success/failed)
- Generate payment records
- Trigger notifications on successful payment

**Database**: `payment_service_db`

**APIs**:
- `POST /payments/initiate` - Initiate payment
- `GET /payments/:id/status` - Get payment status

**Inter-Service Calls**:
- Calls Notification Service when payment succeeds

---

### 3.4 Notification Service (Port 4004)
**Purpose**: Sends notifications and emails

**Key Features**:
- Send booking and payment confirmations
- Store notification history
- Retrieve notifications by user

**Database**: `notification_service_db`

**APIs**:
- `POST /notifications/send` - Send notification
- `GET /notifications/user/:id` - Get notifications by user

---

## 4. Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **HTTP Client**: Axios (for inter-service communication)
- **Configuration**: dotenv

---

## 5. Service Communication Flow

### Booking Flow:
```
1. User → Booking Service (create booking)
2. Booking Service → Event Service (check availability)
3. Booking Service → Event Service (update available seats)
4. Booking Service → Payment Service (initiate payment)
5. Payment Service → Notification Service (send confirmation)
6. Response → User
```

### Cancellation Flow:
```
1. User → Booking Service (cancel booking)
2. Booking Service → Event Service (release seats)
3. Booking Service (update status to cancelled)
```

---

## 6. Data Models

### Event Model:
- eventId, name, category, date, venue
- totalSeats, availableSeats, ticketPrice

### Booking Model:
- bookingId, userId, eventId
- numberOfTickets, totalAmount
- status, paymentId

### Payment Model:
- paymentId, bookingId, amount
- status, paymentMethod, transactionDate

### Notification Model:
- notificationId, userId, bookingId, paymentId
- type, message, status, sentAt

---

## 7. Setup Instructions

### Prerequisites:
- Node.js (v14+)
- MongoDB (running on localhost:27017)

### Installation:
1. Install dependencies in each service folder: `npm install`
2. Create `.env` files for each service (copy from `.env.example`)
3. Start MongoDB
4. Start all services using `start-all-services.ps1` or manually

### Running Services:
```bash
# Windows
.\start-all-services.ps1

# Or manually in separate terminals:
cd event-service && npm start
cd booking-service && npm start
cd payment-service && npm start
cd notification-service && npm start
```

---

## 8. Key Features & Benefits

### Features:
✅ Independent microservices with separate databases  
✅ RESTful API design  
✅ Inter-service communication via HTTP/REST  
✅ Proper error handling and validation  
✅ JSON responses with appropriate status codes  
✅ Environment-based configuration  
✅ Health check endpoints for monitoring  

### Benefits of SOA Approach:
- **Scalability**: Each service can be scaled independently
- **Maintainability**: Services can be updated without affecting others
- **Technology Flexibility**: Services can use different technologies
- **Fault Isolation**: Failure in one service doesn't crash the entire system
- **Team Independence**: Different teams can work on different services

---

## 9. Testing

The system can be tested using:
- **Automated Script**: `test-api.ps1` (PowerShell)
- **Manual Testing**: Using curl, Postman, or Thunder Client
- **API Documentation**: See `TESTING_GUIDE.md` for detailed examples

### Quick Test:
1. Create an event via Event Service
2. Create a booking via Booking Service
3. Check payment status via Payment Service
4. View notifications via Notification Service

---

## 10. Conclusion

This project successfully demonstrates a **Service-Oriented Architecture** implementation where multiple independent services work together to provide a complete event management and ticket booking solution. Each service is responsible for a specific business function, communicates via well-defined REST APIs, and maintains its own data store, showcasing the principles of microservices architecture.

The system is production-ready with proper error handling, validation, and inter-service communication patterns that can be extended for real-world applications.

---

## 11. Project Structure

```
project/
├── event-service/          # Event management service
├── booking-service/        # Ticket booking service
├── payment-service/        # Payment processing service
├── notification-service/   # Notification service
├── README.md              # Complete documentation
├── TESTING_GUIDE.md       # Testing instructions
└── PROJECT_REPORT.md       # This report
```

---

**Project Type**: Service-Oriented Architecture (SOA)  
**Technology**: Node.js + Express + MongoDB  
**Services**: 4 Independent Microservices  
**Communication**: REST APIs (JSON)  
**Status**: ✅ Complete and Functional

