/**
 * Seed script to create the default admin account.
 * Run once: node database/seed.js
 * 
 * Default admin credentials:
 *   username: admin
 *   password: admin123
 */

const bcrypt = require('bcrypt');
const db = require('./db');

async function seed() {
  try {
    const adminUsername = 'admin';
    const adminPassword = 'admin123';

    // Check if admin already exists
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(adminUsername);
    if (existing) {
      console.log('Admin account already exists. Skipping seed.');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Insert admin user
    db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run(
      adminUsername,
      hashedPassword,
      'admin'
    );

    console.log('Admin account created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');

    // Seed sample vehicles so the dashboard isn't empty
    const sampleVehicles = [
      { make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 10 },
      { make: 'Ford', model: 'F-150', category: 'Truck', price: 35000, quantity: 5 },
      { make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 8 },
      { make: 'BMW', model: 'M3', category: 'Sports', price: 70000, quantity: 3 },
      { make: 'Tesla', model: 'Model 3', category: 'Electric', price: 42000, quantity: 6 }
    ];

    const insertVehicle = db.prepare(
      'INSERT INTO vehicles (make, model, category, price, quantity) VALUES (?, ?, ?, ?, ?)'
    );

    for (const v of sampleVehicles) {
      insertVehicle.run(v.make, v.model, v.category, v.price, v.quantity);
    }

    console.log(`Seeded ${sampleVehicles.length} sample vehicles.`);
  } catch (error) {
    console.error('Seed failed:', error.message);
  }
}

seed();
