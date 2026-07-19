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

// Enable Foreign Keys for constraints enforcement
db.pragma('foreign_keys = ON');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Add created_at column to existing databases that lack it
try {
  // Check if created_at exists
  const tableInfo = db.prepare('PRAGMA table_info(users)').all();
  const hasCreatedAt = tableInfo.some(col => col.name === 'created_at');
  
  if (!hasCreatedAt) {
    db.pragma('foreign_keys = OFF');
    db.exec(`
      DROP TABLE IF EXISTS users_new;
      CREATE TABLE users_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      INSERT INTO users_new (id, username, password, role) SELECT id, username, password, role FROM users;
      DROP TABLE users;
      ALTER TABLE users_new RENAME TO users;
    `);
    db.pragma('foreign_keys = ON');
  }
} catch (e) {
  console.error('Migration error:', e);
}

db.exec(`
  CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    description TEXT
  )
`);

try {
  // Check if description exists
  const vehicleTableInfo = db.prepare('PRAGMA table_info(vehicles)').all();
  const hasDescription = vehicleTableInfo.some(col => col.name === 'description');
  if (!hasDescription) {
    db.exec(`ALTER TABLE vehicles ADD COLUMN description TEXT`);
  }
} catch (e) {
  console.error('Vehicle migration error:', e);
}

db.exec(`
  CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    vehicle_id INTEGER,
    quantity INTEGER NOT NULL DEFAULT 1,
    purchase_price REAL NOT NULL,
    purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    vehicle_make TEXT,
    vehicle_model TEXT,
    vehicle_category TEXT,
    vehicle_image TEXT,
    username TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL
  )
`);

try {
  // Check if snapshot columns exist
  const purchaseTableInfo = db.prepare('PRAGMA table_info(purchases)').all();
  const hasSnapshotCols = purchaseTableInfo.some(col => col.name === 'vehicle_make');
  
  if (!hasSnapshotCols) {
    db.pragma('foreign_keys = OFF');
    db.exec(`
      DROP TABLE IF EXISTS purchases_new;
      CREATE TABLE purchases_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        vehicle_id INTEGER,
        quantity INTEGER NOT NULL DEFAULT 1,
        purchase_price REAL NOT NULL,
        purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        vehicle_make TEXT,
        vehicle_model TEXT,
        vehicle_category TEXT,
        vehicle_image TEXT,
        username TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL
      );
      
      INSERT INTO purchases_new (id, user_id, vehicle_id, quantity, purchase_price, purchase_date, vehicle_make, vehicle_model, vehicle_category, username)
      SELECT p.id, p.user_id, p.vehicle_id, p.quantity, p.purchase_price, p.purchase_date, v.make, v.model, v.category, u.username
      FROM purchases p
      LEFT JOIN vehicles v ON p.vehicle_id = v.id
      LEFT JOIN users u ON p.user_id = u.id;
      
      DROP TABLE purchases;
      ALTER TABLE purchases_new RENAME TO purchases;
    `);
    db.pragma('foreign_keys = ON');
  }
} catch (e) {
  console.error('Purchase migration error:', e);
}

module.exports = db;
