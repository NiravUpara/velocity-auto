const app = require('./app');
require('dotenv').config();
const seed = require('./database/seed');

const PORT = process.env.PORT || 5000;

// Run auto-seeder on startup
seed().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database seeding:', err);
  // We still start the server even if seeding fails
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
