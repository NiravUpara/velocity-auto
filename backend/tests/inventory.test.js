const request = require('supertest');
const app = require('../app');
const db = require('../database/db');

// Valid password that meets all requirements
const VALID_PASSWORD = 'Test@1234';

let adminToken;
let userToken;

// Before all tests: set up admin and user accounts
beforeAll(async () => {
  db.exec('DELETE FROM purchases');
  db.exec('DELETE FROM vehicles');
  db.exec('DELETE FROM users');

  const bcrypt = require('bcrypt');
  const hashedPassword = await bcrypt.hash(VALID_PASSWORD, 10);
  db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run(
    'admin', hashedPassword, 'admin'
  );

  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: VALID_PASSWORD });
  adminToken = adminRes.body.token;

  const userRes = await request(app)
    .post('/api/auth/register')
    .send({ username: 'buyer', password: VALID_PASSWORD });
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

describe('POST /api/vehicles/:id/purchase', () => {
  // Test 1: Successful purchase (default quantity 1)
  // When a user buys a vehicle, the quantity should decrease by 1
  it('should purchase a vehicle and decrement quantity by 1 by default', async () => {
    // Create a vehicle with quantity 3
    const created = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 3 });

    const res = await request(app)
      .post(`/api/vehicles/${created.body.id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Purchase successful');
    expect(res.body.vehicle.quantity).toBe(2); // 3 - 1 = 2
  });

  // Test 1b: Successful purchase (multiple quantity)
  it('should purchase a vehicle and decrement quantity by requested amount', async () => {
    const created = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Honda', model: 'Accord', category: 'Sedan', price: 25000, quantity: 5 });

    const res = await request(app)
      .post(`/api/vehicles/${created.body.id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 2 });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Purchase successful');
    expect(res.body.vehicle.quantity).toBe(3); // 5 - 2 = 3
  });

  // Test 2: Out of stock
  // Users should not be able to purchase a vehicle with 0 quantity
  it('should return 400 when vehicle is out of stock', async () => {
    const created = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 0 });

    const res = await request(app)
      .post(`/api/vehicles/${created.body.id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Vehicle is out of stock');
  });

  // Test 2b: Insufficient stock
  it('should return 400 when requesting more than available stock', async () => {
    const created = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 2 });

    const res = await request(app)
      .post(`/api/vehicles/${created.body.id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 3 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Insufficient stock for this purchase');
  });

  // Test 3: Vehicle not found
  it('should return 404 for non-existent vehicle', async () => {
    const res = await request(app)
      .post('/api/vehicles/9999/purchase')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Vehicle not found');
  });
});

describe('POST /api/vehicles/:id/restock', () => {
  // Test 4: Admin can restock a vehicle
  it('should allow admin to restock a vehicle', async () => {
    const created = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Ford', model: 'Mustang', category: 'Sports', price: 45000, quantity: 2 });

    const res = await request(app)
      .post(`/api/vehicles/${created.body.id}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Restock successful');
    expect(res.body.vehicle.quantity).toBe(7); // 2 + 5 = 7
  });

  // Test 5: Regular user cannot restock
  // Only admins should be able to add inventory
  it('should deny regular user from restocking', async () => {
    const created = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Ford', model: 'Mustang', category: 'Sports', price: 45000, quantity: 2 });

    const res = await request(app)
      .post(`/api/vehicles/${created.body.id}/restock`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Admin access required');
  });

  // Test 6: Invalid restock quantity
  it('should return 400 for invalid quantity', async () => {
    const created = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Ford', model: 'Mustang', category: 'Sports', price: 45000, quantity: 2 });

    const res = await request(app)
      .post(`/api/vehicles/${created.body.id}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: -5 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Quantity must be a positive number');
  });
});
