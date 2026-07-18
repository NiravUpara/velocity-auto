const request = require('supertest');
const app = require('../app');
const db = require('../database/db');

let adminToken;
let userToken;

// Before all tests: create an admin and a regular user, get their tokens
beforeAll(async () => {
  // Clean tables
  db.exec('DELETE FROM vehicles');
  db.exec('DELETE FROM users');

  // Register admin (manually insert with admin role)
  const bcrypt = require('bcrypt');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run(
    'admin', hashedPassword, 'admin'
  );

  // Login as admin to get token
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'admin123' });
  adminToken = adminRes.body.token;

  // Register a regular user
  const userRes = await request(app)
    .post('/api/auth/register')
    .send({ username: 'testuser', password: 'password123' });
  userToken = userRes.body.token;
});

// Clean vehicles table before each test
beforeEach(() => {
  db.exec('DELETE FROM vehicles');
});

afterAll(() => {
  db.close();
});

describe('POST /api/vehicles (Create)', () => {
  // Test 1: Admin can create a vehicle
  it('should allow admin to create a vehicle', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 10
      });

    expect(res.status).toBe(201);
    expect(res.body.make).toBe('Toyota');
    expect(res.body.model).toBe('Camry');
    expect(res.body.id).toBeDefined();
  });

  // Test 2: Regular user cannot create a vehicle
  // Only admins should be able to add vehicles to inventory
  it('should deny regular user from creating a vehicle', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: 25000,
        quantity: 10
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Admin access required');
  });

  // Test 3: Missing fields should fail validation
  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Toyota' }); // Missing other fields

    expect(res.status).toBe(400);
  });

  // Test 4: Negative price should fail validation
  // Price and quantity must be non-negative numbers
  it('should return 400 for negative price', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: -1000, quantity: 5 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Price and quantity must be non-negative');
  });
});

describe('GET /api/vehicles (Read)', () => {
  // Test 4: Get all vehicles
  it('should return all vehicles', async () => {
    // Seed a vehicle first
    db.prepare('INSERT INTO vehicles (make, model, category, price, quantity) VALUES (?, ?, ?, ?, ?)')
      .run('Honda', 'Civic', 'Sedan', 22000, 5);

    const res = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].make).toBe('Honda');
  });

  // Test 5: Unauthenticated users cannot view vehicles
  it('should return 401 without a token', async () => {
    const res = await request(app).get('/api/vehicles');

    expect(res.status).toBe(401);
  });
});

describe('GET /api/vehicles/search', () => {
  beforeEach(() => {
    // Seed some vehicles for search tests
    db.prepare('INSERT INTO vehicles (make, model, category, price, quantity) VALUES (?, ?, ?, ?, ?)')
      .run('Toyota', 'Camry', 'Sedan', 25000, 10);
    db.prepare('INSERT INTO vehicles (make, model, category, price, quantity) VALUES (?, ?, ?, ?, ?)')
      .run('Ford', 'F-150', 'Truck', 35000, 5);
  });

  // Test 6: Search by make
  it('should find vehicles matching the search query', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?q=Toyota')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].make).toBe('Toyota');
  });

  // Test 7: Search with no results
  it('should return empty array for no matches', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?q=BMW')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });

  // Test 8: Search by category
  it('should search by category', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?q=Truck')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].model).toBe('F-150');
  });
});

describe('PUT /api/vehicles/:id (Update)', () => {
  // Test 9: Admin can update a vehicle
  it('should allow admin to update a vehicle', async () => {
    // Create a vehicle
    const created = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 10 });

    const res = await request(app)
      .put(`/api/vehicles/${created.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 27000 });

    expect(res.status).toBe(200);
    expect(res.body.price).toBe(27000);
  });

  // Test 10: Update non-existent vehicle
  it('should return 404 for non-existent vehicle', async () => {
    const res = await request(app)
      .put('/api/vehicles/9999')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 27000 });

    expect(res.status).toBe(404);
  });

  // Test 11: Update with negative price should fail
  // Validates that the update endpoint doesn't accept invalid values
  it('should return 400 for negative price', async () => {
    const created = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 10 });

    const res = await request(app)
      .put(`/api/vehicles/${created.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: -5000 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Price must be non-negative');
  });
});

describe('DELETE /api/vehicles/:id', () => {
  // Test 11: Admin can delete a vehicle
  it('should allow admin to delete a vehicle', async () => {
    const created = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 10 });

    const res = await request(app)
      .delete(`/api/vehicles/${created.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Vehicle deleted successfully');
  });

  // Test 12: Regular user cannot delete a vehicle
  it('should deny regular user from deleting', async () => {
    const created = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 10 });

    const res = await request(app)
      .delete(`/api/vehicles/${created.body.id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });
});
