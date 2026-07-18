# 🚗 Car Dealership Inventory System

A full-stack web application for managing car dealership inventory with role-based access control.

Built with **Node.js**, **Express**, **React**, **SQLite**, and **Tailwind CSS**.

---

## Features

### User Features
- User registration and login with JWT authentication
- Browse all vehicles in inventory
- Search vehicles by make, model, or category
- Purchase vehicles (auto-disables when out of stock)

### Admin Features
- Add new vehicles to inventory
- Update existing vehicle details
- Delete vehicles from inventory
- Restock vehicles

### Technical Features
- JWT-based authentication with bcrypt password hashing
- Role-based access control (User / Admin)
- Input validation on all endpoints
- RESTful API design
- SQLite database (persistent, file-based)
- Comprehensive test suite (30 tests)
- Debounced search input
- Responsive UI with Tailwind CSS

---

## Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Backend    | Node.js, Express.js           |
| Frontend   | React, Tailwind CSS, Axios    |
| Database   | SQLite (better-sqlite3)       |
| Auth       | JWT, bcrypt                   |
| Testing    | Jest, Supertest               |
| Dev Tools  | Vite, Nodemon                 |

---

## Folder Structure

```
car-dealership-inventory-system/
├── backend/
│   ├── controllers/          # Request handlers
│   │   ├── authController.js       # Register & login logic
│   │   ├── vehicleController.js    # Vehicle CRUD logic
│   │   └── inventoryController.js  # Purchase & restock logic
│   ├── middleware/            # Express middleware
│   │   └── authMiddleware.js       # JWT verify & admin check
│   ├── models/                # Database queries
│   │   ├── userModel.js            # User DB operations
│   │   └── vehicleModel.js         # Vehicle DB operations
│   ├── routes/                # Route definitions
│   │   ├── authRoutes.js           # POST /register, /login
│   │   └── vehicleRoutes.js        # All vehicle endpoints
│   ├── database/              # Database setup
│   │   ├── db.js                   # SQLite connection & schema
│   │   └── seed.js                 # Admin account & sample data
│   ├── tests/                 # Test suites
│   │   ├── auth.test.js            # 10 auth tests
│   │   ├── vehicles.test.js        # 14 vehicle tests
│   │   └── inventory.test.js       # 6 inventory tests
│   ├── app.js                 # Express app setup
│   ├── server.js              # Server entry point
│   ├── .env.example           # Environment variable template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── VehicleCard.jsx
│   │   │   ├── AddVehicleForm.jsx
│   │   │   ├── EditVehicleModal.jsx
│   │   │   └── RestockModal.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/          # API client
│   │   │   └── api.js
│   │   ├── App.jsx            # Root with routing
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   └── package.json
├── .gitignore
├── README.md
└── PROMPTS.md
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Clone the repository
```bash
git clone https://github.com/your-username/car-dealership-inventory-system.git
cd car-dealership-inventory-system
```

### 2. Backend setup
```bash
cd backend
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` if needed (defaults work for local development):
```
PORT=5000
JWT_SECRET=your_super_secret_key_change_in_production
DB_PATH=./database/dealership.db
```

### 4. Seed the database
```bash
npm run seed
```
This creates:
- **Admin account** — username: `admin`, password: `admin123`
- **5 sample vehicles** — Toyota Camry, Ford F-150, Honda Civic, BMW M3, Tesla Model 3

### 5. Frontend setup
```bash
cd ../frontend
npm install
```

---

## Running the Application

### Start backend (port 5000)
```bash
cd backend
npm run dev
```

### Start frontend (port 5173)
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Environment Variables

| Variable     | Description                      | Default                                    |
|-------------|----------------------------------|--------------------------------------------|
| `PORT`       | Backend server port              | `5000`                                     |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_super_secret_key_change_in_production` |
| `DB_PATH`    | Path to SQLite database file     | `./database/dealership.db`                 |

> **Note:** Never commit `.env` to version control. Use `.env.example` as a template.

---

## API Endpoints

### Authentication

| Method | Endpoint              | Description         | Auth |
|--------|-----------------------|---------------------|------|
| POST   | `/api/auth/register`  | Register a new user | No   |
| POST   | `/api/auth/login`     | Login & get JWT     | No   |

### Vehicles

| Method | Endpoint                     | Description          | Auth  | Admin |
|--------|------------------------------|----------------------|-------|-------|
| GET    | `/api/vehicles`              | Get all vehicles     | Yes   | No    |
| GET    | `/api/vehicles/search?q=`    | Search vehicles      | Yes   | No    |
| POST   | `/api/vehicles`              | Add a vehicle        | Yes   | Yes   |
| PUT    | `/api/vehicles/:id`          | Update a vehicle     | Yes   | Yes   |
| DELETE | `/api/vehicles/:id`          | Delete a vehicle     | Yes   | Yes   |

### Inventory

| Method | Endpoint                        | Description        | Auth  | Admin |
|--------|---------------------------------|--------------------|-------|-------|
| POST   | `/api/vehicles/:id/purchase`    | Purchase (qty - 1) | Yes   | No    |
| POST   | `/api/vehicles/:id/restock`     | Restock (qty + n)  | Yes   | Yes   |

---

## Testing

Run all tests:
```bash
cd backend
npm test
```

### Test Results
```
Test Suites: 3 passed, 3 total
Tests:       30 passed, 30 total
```

### Test Coverage

| Suite               | Tests | What's Tested                                            |
|---------------------|-------|----------------------------------------------------------|
| `auth.test.js`      | 10    | Register, login, validation (short password, short username, whitespace) |
| `vehicles.test.js`  | 14    | CRUD, search, auth guards, negative price validation     |
| `inventory.test.js` | 6     | Purchase, restock, out of stock, admin guards            |

---

## Screenshots

> Screenshots will be added after deployment.

---

## AI Usage

This project was developed with the assistance of **Google Gemini (Antigravity IDE)** as a pair programming partner.

### How AI was used
1. **Initial scaffolding** — Generated project structure, Express setup, and SQLite schema
2. **Feature implementation** — Controller logic, middleware, and route definitions
3. **Test writing** — Created test suites covering happy paths and edge cases
4. **Code review** — Identified bugs (missing error handling in Dashboard), security issues (update validation), and UX improvements (search debounce)
5. **Documentation** — Generated README and PROMPTS.md

### What I did
- Reviewed every line of generated code
- Understood the architecture decisions (MVC, JWT flow, middleware chaining)
- Made design decisions (SQLite over Postgres, no ORM, Tailwind v4)
- Tested the application manually end-to-end
- Can explain any part of the codebase in an interview

### What I learned
- How JWT authentication works (sign, verify, middleware pattern)
- How bcrypt hashing works (salt rounds, timing-safe comparison)
- How to structure Express.js APIs (separate app.js from server.js for testing)
- How to write meaningful API tests with Supertest
- How React Router, Axios interceptors, and state management work together

---

## Future Improvements

- [ ] Add pagination for vehicle listing
- [ ] Add price range filter to search
- [ ] Implement purchase history tracking
- [ ] Add image uploads for vehicles
- [ ] Deploy to a cloud provider (Railway, Render)
- [ ] Add rate limiting for API security
- [ ] Implement refresh tokens
