# Service Communication Diagram

## Architecture Overview

This diagram shows how the 4 services communicate with each other in the Event Management & Ticket Booking System.

```mermaid
graph TB
    User[👤 User/Client]
    
    subgraph "Service Layer"
        ES[🎫 Event Service<br/>Port: 4001<br/>Database: event_service_db]
        BS[🎟️ Booking Service<br/>Port: 4002<br/>Database: booking_service_db]
        PS[💳 Payment Service<br/>Port: 4003<br/>Database: payment_service_db]
        NS[📧 Notification Service<br/>Port: 4004<br/>Database: notification_service_db]
    end
    
    User -->|1. Create Event| ES
    User -->|2. Create Booking| BS
    User -->|3. Check Payment| PS
    User -->|4. View Notifications| NS
    
    BS -->|Check Availability<br/>GET /events/:id| ES
    BS -->|Update Seats<br/>PUT /events/:id| ES
    BS -->|Initiate Payment<br/>POST /payments/initiate| PS
    
    PS -->|Send Notification<br/>POST /notifications/send| NS
    
    style ES fill:#e1f5ff
    style BS fill:#fff4e1
    style PS fill:#e8f5e9
    style NS fill:#fce4ec
```

---

## Detailed Booking Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant BS as Booking Service
    participant ES as Event Service
    participant PS as Payment Service
    participant NS as Notification Service
    
    User->>BS: POST /bookings/create<br/>{userId, eventId, numberOfTickets}
    
    BS->>ES: GET /events/:id<br/>(Check availability)
    ES-->>BS: Event data with availableSeats
    
    alt Seats Available
        BS->>ES: PUT /events/:id<br/>(Update availableSeats)
        ES-->>BS: Updated event
        
        BS->>BS: Create booking record<br/>(status: pending_payment)
        
        BS->>PS: POST /payments/initiate<br/>{bookingId, userId, amount}
        PS->>PS: Process payment<br/>(90% success rate)
        
        alt Payment Success
            PS->>PS: Create payment record<br/>(status: success)
            PS->>NS: POST /notifications/send<br/>(Payment confirmation)
            NS-->>PS: Notification sent
            PS-->>BS: Payment success response
            BS->>BS: Update booking<br/>(status: confirmed)
        else Payment Failed
            PS->>PS: Create payment record<br/>(status: failed)
            PS-->>BS: Payment failed response
            BS->>BS: Keep booking<br/>(status: pending_payment)
        end
        
        BS-->>User: Booking response<br/>(with payment status)
    else Insufficient Seats
        BS-->>User: Error: Insufficient seats
    end
```

---

## Service Communication Matrix

| From Service | To Service | API Call | Purpose |
|-------------|------------|----------|---------|
| **Booking Service** | **Event Service** | `GET /events/:id` | Check event availability |
| **Booking Service** | **Event Service** | `PUT /events/:id` | Update available seats |
| **Booking Service** | **Payment Service** | `POST /payments/initiate` | Process payment |
| **Payment Service** | **Notification Service** | `POST /notifications/send` | Send confirmation |

---

## Cancellation Flow

```mermaid
sequenceDiagram
    participant User
    participant BS as Booking Service
    participant ES as Event Service
    
    User->>BS: PUT /bookings/:id/status<br/>{status: "cancelled"}
    
    BS->>ES: GET /events/:id<br/>(Get current seats)
    ES-->>BS: Event data
    
    BS->>ES: PUT /events/:id<br/>(Release seats back)
    ES-->>BS: Updated event
    
    BS->>BS: Update booking<br/>(status: cancelled)
    BS-->>User: Booking cancelled
```

---

## Service Dependencies

```
┌─────────────────────────────────────────┐
│         Event Service (4001)            │
│  ┌──────────────────────────────────┐   │
│  │  No dependencies                 │   │
│  │  Standalone service             │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
              ▲
              │ (called by)
              │
┌─────────────────────────────────────────┐
│       Booking Service (4002)            │
│  ┌──────────────────────────────────┐   │
│  │  Depends on:                    │   │
│  │  • Event Service (4001)         │   │
│  │  • Payment Service (4003)       │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
              ▲
              │ (called by)
              │
┌─────────────────────────────────────────┐
│       Payment Service (4003)            │
│  ┌──────────────────────────────────┐   │
│  │  Depends on:                    │   │
│  │  • Notification Service (4004)  │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
              ▲
              │ (called by)
              │
┌─────────────────────────────────────────┐
│    Notification Service (4004)         │
│  ┌──────────────────────────────────┐   │
│  │  No dependencies                 │   │
│  │  Standalone service             │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## API Endpoints Summary

### Event Service (4001)
- `POST /events/add` - Create event
- `GET /events/` - List all events
- `GET /events/:id` - Get event by ID
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event

### Booking Service (4002)
- `POST /bookings/create` - Create booking
- `GET /bookings/:userId` - Get user bookings
- `PUT /bookings/:id/status` - Update booking status

### Payment Service (4003)
- `POST /payments/initiate` - Process payment
- `GET /payments/:id/status` - Get payment status

### Notification Service (4004)
- `POST /notifications/send` - Send notification
- `GET /notifications/user/:id` - Get user notifications

---

**Note**: These Mermaid diagrams will render automatically on GitHub. For other platforms, you can use online Mermaid editors like [mermaid.live](https://mermaid.live).

