const request = require('supertest');
const app = require('../app');
const db = require('../database/db');

// Valid password that meets all requirements
const VALID_PASSWORD = 'Test@1234';

// Clean up the test database before each test
beforeEach(() => {
  db.exec('DELETE FROM purchases');
  db.exec('DELETE FROM users');
});

// Close the database connection after all tests
afterAll(() => {
  db.close();
});

describe('POST /api/auth/register', () => {
  // Test 1: Successful registration
  // A new user should be created and a JWT token should be returned
  it('should register a new user and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: VALID_PASSWORD });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
    expect(res.body.token).toBeDefined();
    expect(res.body.user.username).toBe('testuser');
    expect(res.body.user.role).toBe('user');
  });

  // Test 2: Duplicate username
  // The system should reject registration if the username already exists
  it('should return 409 if username already exists', async () => {
    // Register once
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: VALID_PASSWORD });

    // Try to register again with the same username
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'Other@456' });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('Username already exists');
  });

  // Test 3: Missing fields
  // The system should validate that both username and password are provided
  it('should return 400 if username or password is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser' }); // Missing password

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Username and password are required');
  });

  // Test 4: Short password
  // Passwords must be at least 8 characters
  it('should return 400 if password is too short', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'Ab@1' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Password must be at least 8 characters');
  });

  // Test 5: Password without uppercase letter
  it('should return 400 if password has no uppercase letter', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'test@1234' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Password must contain at least one uppercase letter');
  });

  // Test 6: Password without digit
  it('should return 400 if password has no digit', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'Test@abcd' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Password must contain at least one digit');
  });

  // Test 7: Password without special character
  it('should return 400 if password has no special character', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'Test12345' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Password must contain at least one special character');
  });

  // Test 8: Username too short
  // Usernames must be at least 3 characters to prevent meaningless accounts
  it('should return 400 if username is too short', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'ab', password: VALID_PASSWORD });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Username must be at least 3 characters');
  });

  // Test 9: Whitespace-only username
  // Spaces should not count as valid characters in a username
  it('should return 400 if username is only whitespace', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: '   ', password: VALID_PASSWORD });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Username must be at least 3 characters');
  });
});

describe('POST /api/auth/login', () => {
  // Before each login test, create a user to log in with
  beforeEach(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: VALID_PASSWORD });
  });

  // Test 10: Successful login
  // A registered user should be able to log in and receive a JWT token
  it('should login and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: VALID_PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Login successful');
    expect(res.body.token).toBeDefined();
    expect(res.body.user.username).toBe('testuser');
  });

  // Test 11: Wrong password
  // Should return a generic "Invalid credentials" message (not "wrong password")
  // This prevents attackers from knowing which field is wrong
  it('should return 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'WrongPass@1' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  // Test 12: Non-existent user
  // Should return the same generic error as wrong password
  it('should return 401 for non-existent user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'nouser', password: VALID_PASSWORD });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  // Test 13: Missing fields
  // Login should also validate required fields
  it('should return 400 if fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({}); // No username or password

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Username and password are required');
  });
});
