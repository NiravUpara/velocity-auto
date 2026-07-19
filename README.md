# Velocity Auto
 **Live Demo:** <https://velocity-auto-one.vercel.app>

## Overview

Velocity Auto is a premium full-stack vehicle dealership inventory management application built as part of the Incubyte TDD assessment.

The application serves two distinct user roles:
- **Customers**: Can browse the premium vehicle collection, filter/search for specific vehicles, purchase vehicles, and manage their personal garage.
- **Administrators**: Can manage the vehicle inventory (create, update, delete, restock), manage registered users, and view an immutable purchase history sales ledger complete with automated analytics.

## Key Highlights

- Secure JWT Authentication
- Admin & Customer Dashboards
- Immutable Purchase History
- Automated Sales Analytics
- Responsive Premium UI
- SQLite + Express Backend
- Comprehensive Unit Testing
- Cloud Deployment (Render + Vercel)

## Features

### Authentication
- JWT Authentication
- Secure Login & Registration
- Role-based Authorization
- Protected Routes

### Customer Features
- Browse Premium Vehicle Collection
- Search, Filter & Sort Vehicles
- Purchase Vehicles
- Personal Garage
- Responsive Dashboard

### Administrator Features
- Inventory Management
- Vehicle Restocking
- User Management
- Purchase History
- Sales Analytics

### User Experience
- Responsive UI
- Dark Theme
- Loading States
- Confirmation Dialogs

### System
- Automatic Database Initialization
- Immutable Purchase History

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **Testing**: Jest, Supertest
- **Deployment**: Vercel (Frontend), Render (Backend)

## Project Structure

```
├── backend/
│   ├── controllers/      # Route logic and request handling
│   ├── database/         # Database connection and initialization (db.js)
│   ├── middleware/       # Authentication and Authorization guards
│   ├── models/           # Database queries and data modeling
│   ├── routes/           # API route definitions
│   └── tests/            # Jest automated test suites
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI elements (Navbar, Modals)
│   │   ├── pages/        # Main application views (Dashboard, Admin, Garage)
│   │   ├── services/     # Axios API client setup
│   │   └── utils/        # Helper functions (currency formatting)
```

## Installation

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (see below).
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the `backend/` directory:
```
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
```

### Database Initialization

The SQLite database (`database.sqlite`) is automatically created and initialized upon starting the backend server for the first time. The schema incorporates the `users`, `vehicles`, and `purchases` tables. Additionally, `seed.js` can be manually executed to populate initial data if required.

## Demo Credentials

- **Admin Account**:
  - Username: `admin`
  - Password: `adminpassword`
- **Regular User**:
  - You can register a new regular user via the Sign Up page in the UI.

## Deployment

The application is fully deployed and accessible online.

- **Frontend (Vercel):** <https://velocity-auto-one.vercel.app>
- **Backend (Render):** <https://velocity-auto.onrender.com>

The frontend is built with React + Vite and the backend is powered by Node.js, Express, and SQLite. The database is automatically initialized with the required schema and seed data during the first application startup.

## API Overview

- **Auth**
  - `POST /api/auth/register` - Create a new user
  - `POST /api/auth/login` - Authenticate a user
- **Vehicles**
  - `GET /api/vehicles` - List all vehicles
  - `POST /api/vehicles` - Create a new vehicle (Admin only)
  - `PUT /api/vehicles/:id` - Update a vehicle (Admin only)
  - `DELETE /api/vehicles/:id` - Delete a vehicle (Admin only)
  - `POST /api/vehicles/:id/purchase` - Purchase a vehicle
  - `POST /api/vehicles/:id/restock` - Restock a vehicle (Admin only)
- **Admin**
  - `GET /api/admin/stats` - Get dashboard stats
  - `GET /api/admin/users` - Get all users
  - `GET /api/admin/purchase-history` - Get immutable sales ledger

## Database Design

- **Users**: Stores user credentials, roles (`admin` or `user`), and timestamps.
- **Vehicles**: Stores vehicle metadata (brand, name, type, price) and active inventory quantities.
- **Purchases**: Stores an immutable ledger of transactions.
  
### Purchase History

The `purchases` table acts as a permanent historical record. It is strictly **immutable**:
- Every purchase creates a permanent historical record storing a snapshot of the vehicle and customer data at the time of purchase (`unit_price`, `total_amount`, `customer_name`, `vehicle_brand`, etc.).
- Deleting users or vehicles never affects completed business transactions (using `ON DELETE SET NULL` for foreign keys while preserving the snapshots).
- Revenue and sales analytics are calculated exclusively from this purchase history ledger to ensure financial integrity.

## Screenshots

*(Placeholders for future screenshots)*
- `[Screenshot: Landing Page]`
- `[Screenshot: Customer Dashboard]`
- `[Screenshot: User Garage]`
- `[Screenshot: Admin Inventory Management]`
- `[Screenshot: Admin Purchase History Ledger]`

## Future Improvements

- **Export CSV**: Allow administrators to export the purchase history ledger to a CSV file.
- **Pagination**: Implement cursor-based or offset pagination for large data tables.
- **Notifications**: Add real-time web socket notifications for low stock alerts or new purchases.
- **Inventory Reports**: Generate PDF reports for monthly inventory changes and revenue.
- **Cloud Database**: Migrate from SQLite to PostgreSQL for multi-region scalability.
- **Email Receipts**: Automatically send email receipts upon successful vehicle purchase using services like SendGrid.

## My AI Usage

### ChatGPT
I used ChatGPT during the initial ideation phases for:
- Brainstorming architectural decisions and directory layouts.
- Explaining complex JWT authentication concepts.
- Generating test ideas and edge-case scenarios for the TDD assessment.
- Improving documentation drafts.

### Antigravity

I used Antigravity AI for iterative implementation, refactoring, and UI improvements, including:

- Generating boilerplate for React components and Express controllers.
- Improving the UI with premium dark theme styling and Tailwind CSS layouts.
- Debugging deployment issues and backend SQL constraints.
- Refactoring backend logic to support the immutable Purchase History architecture.
- Generating Conventional Commit message suggestions.

**Important Note**: All generated code was manually reviewed, integrated, tested, modified where necessary, and comprehensively understood before being committed. AI dramatically improved my development speed and code organization, while all final implementation and architectural decisions remained entirely manual.