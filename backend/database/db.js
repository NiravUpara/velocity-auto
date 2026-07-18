const Database = require('better-sqlite3');
const path = require('path');

// Load environment variables
require('dotenv').config({
  path: path.resolve(__dirname, '..', process.env.NODE_ENV === 'test' ? '.env.test' : '.env')
});

const dbPath = path.resolve(__dirname, '..', process.env.DB_PATH || './database/dealership.db');

// Create the database connection
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin'))
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0
  )
`);

module.exports = db;
