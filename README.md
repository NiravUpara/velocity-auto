# Velocity Auto

**Engineered For Every Journey.**

Velocity Auto is a premium Car Dealership Inventory System designed to emulate a luxury automotive startup. It provides a highly polished, robust platform for managing high-performance vehicle fleets, customer purchases, and user accounts.

---

## Features Implemented

- **Premium UI/UX**: Features a clean, minimal, sporty design with glassmorphism, tailored animations, and a strict dark mode design language.
- **Role-Based Access Control**: Differentiates securely between 'admin' and 'user' flows using JWT.
- **Vehicle Management**: Admins can easily add, edit, restock, or remove vehicles from the inventory.
- **Purchase System**: Users can view detailed vehicle profiles and smoothly acquire vehicles.
- **My Garage**: A personalized view for users to track their purchased vehicles and total investment.
- **User Management**: Admins can manage registered clients and view their individual purchase history securely.
- **Dashboard Analytics**: Real-time stats summarizing total vehicles, registered users, total revenue, and out-of-stock items.
- **Search & Filters**: Instantly find vehicles by make, category, or sort by price.
- **Responsive Layout**: Designed to scale flawlessly from mobile screens to ultrawide desktop monitors, featuring 2-column modal layouts on large screens.

---

## Tech Stack Used

### Frontend
- **React.js** (v18+)
- **Vite** (Build Tool)
- **Tailwind CSS v4** (Utility-first styling)
- **Framer Motion** (Micro-animations and layout transitions)
- **React Router DOM** (Client-side routing)
- **Axios** (API requests)

### Backend
- **Node.js** & **Express**
- **SQLite3** (Lightweight embedded database)
- **JSON Web Tokens (JWT)** (Authentication)
- **bcryptjs** (Password hashing)
- **cors** & **dotenv** (Middleware)

---

## Project Folder Structure

```
velocity-auto/
├── backend/
│   ├── controllers/      # Route handlers for auth, vehicles, purchases, and admin
│   ├── database/         # SQLite connection and seeding logic
│   ├── middleware/       # JWT and role verification middleware
│   ├── models/           # Data access layers (User, Vehicle, Purchase)
│   ├── routes/           # Express router definitions
│   ├── tests/            # API integration and unit tests
│   ├── app.js            # Express app configuration
│   └── server.js         # Entry point for backend server
├── frontend/
│   ├── public/           # Static assets (Favicon, Icons)
│   ├── src/
│   │   ├── assets/       # Images and SVGs
│   │   ├── components/   # Reusable UI components and Modals
│   │   ├── context/      # React context providers
│   │   ├── pages/        # Core page components (Dashboard, Login, MyGarage, etc.)
│   │   ├── services/     # Axios API configuration
│   │   ├── utils/        # Utility helpers (e.g., Currency formatting)
│   │   ├── App.jsx       # Root router configuration
│   │   └── index.css     # Global styles and Tailwind configuration
│   ├── index.html        # Entry HTML file
│   └── vite.config.js    # Vite configuration
├── README.md             # Project documentation
└── PROMPTS.md            # Development prompt history
```

---

## Backend Setup Instructions

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The server will start on http://localhost:5000 and the SQLite database will be automatically initialized.*

---

## Frontend Setup Instructions

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The client will start on http://localhost:5173.*

---

## Environment Variable Configuration

Create a `.env` file in the `backend/` directory with the following variables:
```env
PORT=5000
JWT_SECRET=your_super_secret_key_here
```
*(If no `.env` file is provided, the backend falls back to port 5000 and a default secret key for development purposes).*

---

## Database Information

The project utilizes **SQLite**, a lightweight, embedded relational database.
- The database is stored locally in `backend/database/dealership.db`.
- **Tables**: `users`, `vehicles`, `purchases`.
- A seed script (`seed.js`) automatically provisions initial inventory (e.g., Porsche 911 GT3, Rimac Nevera) and a default admin account upon first execution.

---

## API Overview

**Auth Routes (`/api/auth`)**:
- `POST /register`: Register a new user.
- `POST /login`: Authenticate and receive a JWT.

**Vehicle Routes (`/api/vehicles`)**:
- `GET /`: Retrieve all inventory.
- `GET /search`: Search vehicles by make or model.
- `POST /`: Add a new vehicle (Admin only).
- `PUT /:id`: Update a vehicle (Admin only).
- `DELETE /:id`: Delete a vehicle (Admin only).
- `POST /:id/purchase`: Purchase a vehicle, decrementing stock (Authenticated).
- `POST /:id/restock`: Increase vehicle stock (Admin only).

**Purchase Routes (`/api/purchases`)**:
- `GET /my-garage`: Retrieve purchase history for the logged-in user.

**Admin Routes (`/api/admin`)**:
- `GET /stats`: Retrieve platform analytics (Admin only).
- `GET /users`: Retrieve all registered users (Admin only).
- `GET /users/:id`: Retrieve purchase history for a specific user (Admin only).
- `DELETE /users/:id`: Delete a user account (Admin only).

---

## Authentication Overview

Authentication is handled via **JSON Web Tokens (JWT)**.
1. Users submit credentials via the Login/Register endpoints.
2. The server verifies/hashes passwords utilizing `bcryptjs`.
3. A JWT is issued and stored in the client's `sessionStorage`.
4. Subsequent API requests attach the token as a `Bearer` token via Axios interceptors.
5. The `authMiddleware` on the backend validates the token and extracts role parameters (`admin` vs `user`) to enforce authorization boundaries.

---

## Testing Instructions

The backend API is rigorously covered by integration tests using **Jest** and **Supertest**.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Execute the test suite:
   ```bash
   npm test
   ```
*(Note: The project uses a separate SQLite test database (`test.db`) so that testing does not affect your development data).*

---

## Test Report Section

The automated test suite verifies critical assertions across 3 core modules:
- **Authentication**: Validates registration, login, password hashing, and token generation.
- **Vehicles/Inventory**: Validates CRUD operations, stock management constraints, and admin-only route protection.
- **Transactions**: Validates purchase logic, stock decrementing, out-of-stock rejection, and secure garage history retrieval.

At the time of submission, all backend tests were passing successfully.

---

## Screenshots

*(Screenshots will be added before submission)*

### Landing Page
*(Placeholder for Landing Page screenshot)*

### Login
*(Placeholder for Login screenshot)*

### Dashboard
*(Placeholder for Dashboard screenshot)*

### Admin Dashboard
*(Placeholder for Admin Dashboard screenshot)*

### Purchase Flow
*(Placeholder for Purchase Flow screenshot)*

### User Garage
*(Placeholder for User Garage screenshot)*

---

# My AI Usage

### Tools Used:
- **ChatGPT**
- **Google Gemini**
- **Antigravity IDE**

### How AI was utilized during development:
- Brainstorming architecture and database schema
- Generating initial backend boilerplate
- Debugging React state and JSX syntax errors
- Improving the UI with Tailwind CSS and glassmorphism
- Writing Jest and Supertest backend tests
- Formatting and structuring markdown documentation

### Reflection on AI Assistance:
AI made the development process much faster by quickly generating boilerplate code and styling setups. I manually reviewed every AI-generated suggestion, ensuring I fully understood the code before using it. Whenever the AI suggested something overly complex or misaligned with the project goals, I modified the code to keep it simple, secure, and robust.

I understand the overall architecture of this project and can explain the implementation, debugging process, and how AI was used during development.

*AI Transparency Note: This repository documents AI usage transparently through this README and the PROMPTS.md file. All generated code was thoroughly reviewed, verified, modified where necessary, and integrated manually.*
