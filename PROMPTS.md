# Development Log: Prompt Engineering Journey

This document serves as a chronological log of the major development milestones for the Velocity Auto project, highlighting the primary intents behind the prompts provided to the AI assistant.

---

## 1. Project Initialization
**Intent:** Establish the foundational architecture and technology stack.
- Prompted the AI to scaffold a monolithic repository containing both an Express.js backend and a React/Vite frontend.
- Directed the setup of an initial SQLite database (`better-sqlite3`) to simplify local development without relying on external services.
- Emphasized a clean, modular folder structure suitable for a scalable dealership inventory system.

## 2. Authentication
**Intent:** Secure the application using industry-standard JWT protocols.
- Prompted the creation of robust `register` and `login` flows with secure password hashing (`bcryptjs`).
- Directed the implementation of strict backend middleware to guard protected routes and parse `Authorization` headers.
- Refined the prompt to enforce role-based access control (RBAC), distinguishing between standard `user` accounts and highly privileged `admin` accounts.

## 3. Vehicle Management
**Intent:** Build the core CRUD functionality for the dealership inventory.
- Prompted the backend API creation for fetching, adding, updating, and deleting vehicle records.
- Directed the implementation of a search API capable of instantly filtering vehicles by brand, model, and category.
- Ensured strict authorization rules, allowing only administrators to create or modify inventory stock.

## 4. Admin Dashboard
**Intent:** Provide a centralized management hub for administrators.
- Prompted the frontend generation of a dedicated Admin Dashboard to manage users and view inventory metrics.
- Refined the prompt to include a comprehensive "User Management" page, allowing the admin to view registered users, their purchase counts, and permanently delete accounts.

## 5. Purchase Flow
**Intent:** Enable customers to buy vehicles and decrement active inventory.
- Prompted the creation of a transactional API endpoint (`/api/vehicles/:id/purchase`) to process purchases and safely decrement the `quantity` of the vehicle in the database.
- Instructed the AI to implement strict backend validations to prevent purchasing out-of-stock vehicles or negative quantities.

## 6. Garage
**Intent:** Give customers a private view of their own purchases.
- Prompted the AI to build a "My Garage" interface for standard users.
- Directed the backend to fetch all purchases linked to the currently authenticated user's ID, displaying them beautifully on the frontend with vehicle images and timestamps.

## 7. Architecture Improvements
**Intent:** Refactor the database to protect critical business data from cascading deletions.
- Prompted a significant architectural pivot: transitioning the `purchases` table from strict relational dependencies to an **immutable snapshot model**.
- Instructed the AI to utilize `ON DELETE SET NULL` for foreign keys while permanently capturing `customer_name`, `vehicle_brand`, `unit_price`, and `total_amount` at the exact moment of purchase.

## 8. Purchase History
**Intent:** Build a permanent, read-only sales ledger for the dealership.
- Prompted the creation of an Admin-only "Purchase History" interface.
- Directed the implementation of a fully immutable table (no edit/delete buttons) that safely surfaces the snapshot data, ensuring deleted users or vehicles do not erase past business transactions.

## 9. Sales Analytics
**Intent:** Provide real-time financial insights based on the immutable ledger.
- Prompted the AI to calculate strict aggregates from the `purchases` table, including `Total Revenue`, `Total Transactions`, `Today's Sales`, and `Average Order Value`.
- Stressed that these calculations must dynamically derive from the snapshot fields (`total_amount`) to guarantee financial accuracy.

## 10. UI Improvements
**Intent:** Polish the visual aesthetic to reflect a premium automotive brand.
- Prompted the implementation of a sleek, dark-mode-exclusive design language mimicking high-end brands like Porsche or Tesla.
- Instructed the AI to remove early light/dark theme toggles in favor of absolute consistency, enhancing layout spacing, glassmorphism effects, and vibrant red accents across the application.

## 11. Bug Fixes
**Intent:** Resolve edge cases and stabilize the application logic.
- Prompted fixes for the dashboard analytics to strictly exclude `admin` accounts from the "Registered Users" metric.
- Directed the AI to intercept and gracefully handle 401 Unauthorized errors on the frontend if an admin deletes a user who is currently logged in, ensuring immediate session termination.

## 12. Deployment
**Intent:** Prepare the application for production hosting environments.
- Prompted improvements to the database initialization scripts (`seed.js` and table creation logic) so that fresh deployments automatically generate the default admin account and sample vehicles without manual intervention.

---

## Lessons Learned

Throughout the development of Velocity Auto, my approach to prompt engineering evolved significantly:

1. **Precision Over Broad Requests**: Early on, asking the AI to "build a dashboard" resulted in generic layouts. By shifting to highly specific prompts (e.g., "Build a responsive grid with 4 cards displaying SUM of total_amount, styled with glassmorphism"), the AI consistently delivered production-ready components.
2. **Architectural Guardrails**: I learned that AI relies heavily on standard relational models by default. To achieve the immutable ledger, I had to explicitly constrain the AI's behavior ("Do NOT use JOINs for historical data. Store immutable snapshots instead"). Setting strict guardrails upfront saved hours of refactoring.
3. **Iterative Refinement**: Instead of prompting an entire feature in one go, breaking tasks down chronologically (Database -> API -> Frontend -> UI Polish) yielded far more stable code and allowed me to test contracts at each boundary layer.
4. **Context is King**: The AI performed best when it understood the *business rules* behind the code (e.g., "Purchases represent completed business transactions and must never disappear"). Providing the "Why" alongside the "What" led to intuitive, high-quality architectural choices.
