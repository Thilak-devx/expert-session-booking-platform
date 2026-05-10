# Expert Session Booking System

Full-stack expert discovery and session booking platform with realtime slot updates, admin expert management, and MongoDB-backed double-booking protection.

## Project Overview

The platform lets users:

- browse experts by category
- search and paginate expert listings
- view live availability by date
- book a session with an expert
- review bookings by email
- cancel pending bookings

It also includes an admin workflow for managing experts, categories, and available slots.

## Features

### User Experience

- Expert listing with search, category filtering, and pagination
- Expert detail page with grouped availability
- Booking flow with validation, loading states, and toast feedback
- My Bookings page with status badges and cancellation support
- Responsive UI built with Tailwind CSS

### Admin Management

- Create expert
- Edit expert
- Delete expert
- Add and remove date groups
- Add and remove individual slots

### Realtime

- `slotBooked` updates availability instantly across tabs and devices
- `bookingCancelled` restores the correct slot instantly
- Expert-specific Socket.io room subscriptions
- Automatic reconnect handling with client resync

### Data Integrity

- MongoDB compound unique index on `expertId + date + timeSlot`
- Race-condition-safe booking protection at the database layer
- Centralized backend error handling
- Request validation for experts and bookings

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hot Toast
- Socket.io Client

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Socket.io
- dotenv

## Project Structure

```text
expert-booking-system/
  client/
    src/
      components/
      context/
      hooks/
      layouts/
      pages/
      services/
      socket/
      utils/
  server/
    config/
    controllers/
    data/
    middleware/
    models/
    routes/
    scripts/
    socket/
    utils/
```

## Setup

### 1. Install dependencies

Backend:

```bash
cd server
npm install
```

Frontend:

```bash
cd client
npm install
```

### 2. Configure environment variables

Backend: `server/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_uri
CLIENT_URL=your_client_url
```

Frontend: `client/.env`

```env
VITE_API_BASE_URL=your_api_url
VITE_SOCKET_URL=your_socket_url
```

Notes:

- `VITE_API_BASE_URL` is used by the frontend REST client
- `VITE_SOCKET_URL` is optional if the frontend and backend share the same origin in production

### 3. Seed expert data

After adding a valid `MONGO_URI`:

```bash
cd server
npm run seed:experts
```

The backend also supports automatic expert seeding on startup when the database is empty.

### 4. Run locally

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

Default local URLs:

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)

## API Summary

Base API URL:

- `http://localhost:5000/api`

### Health

- `GET /api/health`

### Experts

- `GET /api/experts`
- `GET /api/experts/:id`
- `GET /api/experts/categories`
- `GET /api/experts/admin/all`
- `POST /api/experts`
- `PUT /api/experts/:id`
- `DELETE /api/experts/:id`

### Bookings

- `POST /api/bookings`
- `GET /api/bookings?email=`
- `PATCH /api/bookings/:id/status`
- `DELETE /api/bookings/:id`

## Realtime Flow

When a booking is created:

1. The backend validates the request and stores the booking.
2. MongoDB enforces the unique slot constraint.
3. The backend emits `slotBooked`.
4. Subscribed clients update availability immediately.

When a pending booking is cancelled:

1. The booking is deleted.
2. The backend emits `bookingCancelled`.
3. Other clients immediately see the slot available again.

## Double-Booking Prevention

Double booking is prevented with a MongoDB compound unique index on:

```text
expertId + date + timeSlot
```

This guarantees:

- duplicate slot booking is impossible at the database level
- concurrent requests remain safe
- duplicate attempts return a proper `409 Conflict`

## Production Build

Frontend:

```bash
cd client
npm run build
```

Backend:

- ensure `MONGO_URI` is valid
- run the server with a production process manager such as PM2, Render, Railway, or a container platform

## Deployment Instructions

### Frontend Deployment

Set:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_SOCKET_URL=https://your-api-domain.com
```

Then build:

```bash
cd client
npm run build
```

Deploy the generated `client/dist` output to your frontend host.

### Backend Deployment

Set:

```env
PORT=5000
MONGO_URI=your_production_mongodb_uri
CLIENT_URL=https://your-frontend-domain.com
```

Then run:

```bash
cd server
npm start
```

## Screenshots

Add screenshots before submission:

- `docs/screenshots/homepage.png`
- `docs/screenshots/expert-detail.png`
- `docs/screenshots/booking-page.png`
- `docs/screenshots/my-bookings.png`
- `docs/screenshots/admin-page.png`

Example markdown:

```md
![Homepage](docs/screenshots/homepage.png)
![Expert Detail](docs/screenshots/expert-detail.png)
![Booking Page](docs/screenshots/booking-page.png)
![My Bookings](docs/screenshots/my-bookings.png)
![Admin Page](docs/screenshots/admin-page.png)
```

## Final Notes

- The UI is responsive and assignment-focused
- Realtime synchronization is included for booking and cancellation
- Admin management is route-based and intentionally kept simple without authentication
- The frontend and backend are structured for clean extension into a fuller production system
