# PROMPTS.md — AI Development Prompts

This file documents the prompts used during the development of this project with AI assistance (Google Gemini / Antigravity IDE).

---

## Prompt 1 — Project Setup & Planning

**Goal:** Define the entire project scope and get an implementation plan.

```
You are my senior software engineer and pair programming partner.

I need to build this project for an interview assignment. The goal is NOT to generate the most
advanced architecture. The goal is to generate a clean, professional, beginner-friendly project
that I can understand and explain during an interview.

Tech Stack: Node.js, Express.js, JavaScript, SQLite, JWT, bcrypt, React, Tailwind CSS, Axios,
Jest, Supertest, Git

Application: Car Dealership Inventory System with User and Admin roles.

Requirements included:
- Vehicle model (make, model, category, price, quantity)
- Authentication (register, login with JWT)
- Admin seeding via script
- Vehicle CRUD (admin only for create/update/delete)
- Search by make, model, category
- Purchase (decrement quantity) and Restock (admin only)
- React SPA with Login, Register, Dashboard pages
- Tailwind CSS styling
- Jest + Supertest tests
- Clean git history with conventional commits
```

**Result:** AI generated an 8-phase implementation plan which I reviewed and approved.

---

## Prompt 2 — Approval & Implementation

**Goal:** Execute the approved plan phase by phase.

```
[Approved the implementation plan]
```

**Result:** AI built the project incrementally across 8 phases:

1. **Phase 1:** Project scaffolding — Express, SQLite (better-sqlite3), Vite + React + Tailwind CSS
2. **Phase 2:** User registration & login with bcrypt hashing and JWT tokens
3. **Phase 3:** JWT authentication middleware with role-based authorization
4. **Phase 4:** Vehicle CRUD endpoints with admin-only access control
5. **Phase 5:** Purchase and restock inventory operations
6. **Phase 6:** React frontend — Login, Register, Dashboard pages
7. **Phase 7:** Admin modals (Edit, Restock), notifications, responsive design
8. **Phase 8:** README.md and PROMPTS.md documentation

---

## Prompt 3 — Code Review & Improvements

**Goal:** Senior engineer review of the existing codebase to find bugs, missing tests, and improvements.

```
You are an experienced Senior Software Engineer, Tech Lead, Code Reviewer, QA Engineer,
and TDD mentor.

I already have a working Car Dealership Inventory System. Do NOT regenerate the project.
Instead, work as a senior reviewer improving the existing project.

Workflow:
1. AUDIT — Analyze every file against assignment requirements
2. IMPROVEMENT PLAN — Prioritized roadmap (P0/P1/P2)
3. IMPLEMENTATION — One milestone at a time

Focus areas: input validation, error handling, security, tests, documentation, UX
```

**Result:** AI performed a comprehensive audit and found:

- **3 bugs** — Missing try/catch in Dashboard handlers (add, update, restock)
- **1 security issue** — Update endpoint accepted arbitrary fields without validation
- **4 new tests** — Username validation (short, whitespace), negative price (create, update)
- **UX improvement** — Debounced search input (300ms)
- **DX improvement** — `.env.example` file, sample vehicles in seed script
- **Documentation** — Improved README with environment variables, AI usage details

Total tests: 26 → 30 (all passing)

---

## Notes

- All code was generated with AI assistance and reviewed by the developer
- The developer made all design decisions and can explain every part of the codebase
- AI was used as a learning tool, not a replacement for understanding
