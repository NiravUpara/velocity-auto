# PROMPTS.md

## 1. Project Initialization
**Representative Prompt:**
> "Create a new project folder for a Car Dealership Inventory System. Set up an Express backend with an SQLite database and a React frontend using Vite and Tailwind CSS. Keep the folders clean and separate."

## 2. Backend Authentication
**Representative Prompt:**
> "Write the backend code for user login and registration. Use JWT for authentication and bcrypt for hashing passwords. Create two roles: admin and user. Make sure to protect routes that only admins should access."

## 3. Vehicle CRUD
**Representative Prompt:**
> "Create the database model and API routes for vehicles. I need endpoints to add a new car, edit its details, update the stock quantity, and delete the car. Only admins should be able to do this."

## 4. Purchase & Inventory
**Representative Prompt:**
> "Write the logic for buying a car. When a logged-in user buys a car, reduce the stock count by one and save the purchase history in a new table. If the stock is zero, return an error."

## 5. Admin Dashboard
**Representative Prompt:**
> "Create admin dashboard APIs that return total users, total vehicles, revenue, and out-of-stock count. Only admins should be able to access these routes. Also add a route to get a list of all users and their past purchases."

## 6. React Frontend
**Representative Prompt:**
> "Build the frontend pages using React. Create a nice landing page, login/register forms, and a main dashboard to show the cars. Set up Axios so that the JWT token is sent automatically with every request."

## 7. UI Improvements
**Representative Prompt:**
> "Make the UI look like a premium luxury car website. Use a dark theme, glass-like effects on the modals, and keep the buttons consistent (blue for action, red for delete). Change all prices to show in Indian Rupees (₹)."

## 8. Testing
**Representative Prompt:**
> "Write integration tests for the backend using Jest and Supertest. Use a separate SQLite database just for testing. Make sure to test the login process, adding cars, and buying cars."

## 9. Final Review
**Representative Prompt:**
> "Review the entire repository and compare it with the assignment requirements. Find any missing features, UI improvements, testing gaps, or documentation issues before final submission."

## 10. Documentation
**Representative Prompt:**
> "Write the final README.md file. Include setup instructions, the tech stack, API overview, and a section explaining how AI was used during development. Keep it professional and easy to understand."

---

*AI suggestions were treated as starting points, not final solutions. Every important change was reviewed, tested locally, modified where required, and then integrated into the project.*
