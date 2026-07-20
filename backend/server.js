const app = require('./app');
require('dotenv').config();
const seed = require('./database/seed');
const db = require('./database/db');

const PORT = process.env.PORT || 5000;

let server;

// Run auto-seeder on startup
seed().then(() => {
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database seeding:', err);
  // We still start the server even if seeding fails
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

// Graceful shutdown logic to ensure SQLite WAL checkpoints
const shutdown = () => {
  console.log('Shutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
    });
  }
  if (db) {
    console.log('Closing SQLite database connection...');
    db.close();
  }
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
