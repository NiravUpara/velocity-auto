const request = require('supertest');
const app = require('../app');
const db = require('../database/db');

// Valid password that meets all requirements
const VALID_PASSWORD = 'Test@1234';

let adminToken;
let userToken;

// Before all tests: create an admin and a regular user, get their tokens
beforeAll(async () => {
  // Clean tables
  db.exec('DELETE FROM purchases');
  db.exec('DELETE FROM vehicles');
  db.exec('DELETE FROM users');

  // Register admin (manually insert with admin role)
  const bcrypt = require('bcrypt');
  const hashedPassword = await bcrypt.hash(VALID_PASSWORD, 10);
  db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run(
    'admin', hashedPassword, 'admin'
  );

  // Login as admin to get token
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: VALID_PASSWORD });
  adminToken = adminRes.body.token;

  // Register a regular user
  const userRes = await request(app)
    .post('/api/auth/register')
    .send({ username: 'testuser', password: VALID_PASSWORD });
  userToken = userRes.body.token;
});

// Clean tables before each test
beforeEach(() => {
  db.exec('DELETE FROM purchases');
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
  it('should return 400 for negative price', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: -1000, quantity: 5 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Price must be greater than 0');
  });

  // Test 5: Zero price should fail validation
  it('should return 400 for zero price', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 0, quantity: 5 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Price must be greater than 0');
  });
});

describe('GET /api/vehicles (Read)', () => {
  // Test 6: Get all vehicles
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

  // Test 7: Unauthenticated users cannot view vehicles
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

  // Test 8: Search by make
  it('should find vehicles matching the search query', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?q=Toyota')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].make).toBe('Toyota');
  });

  // Test 9: Search with no results
  it('should return empty array for no matches', async () => {
    const res = await request(app)
      .get('/api/vehicles/search?q=BMW')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });

  // Test 10: Search by category
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
  // Test 11: Admin can update a vehicle
  it('should allow admin to update a vehicle', async () => {
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

  // Test 12: Update non-existent vehicle
  it('should return 404 for non-existent vehicle', async () => {
    const res = await request(app)
      .put('/api/vehicles/9999')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 27000 });

    expect(res.status).toBe(404);
  });

  // Test 13: Update with negative price should fail
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
    expect(res.body.error).toBe('Price must be greater than 0');
  });
});

describe('DELETE /api/vehicles/:id', () => {
  // Test 14: Admin can delete a vehicle
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

  // Test 15: Regular user cannot delete a vehicle
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
