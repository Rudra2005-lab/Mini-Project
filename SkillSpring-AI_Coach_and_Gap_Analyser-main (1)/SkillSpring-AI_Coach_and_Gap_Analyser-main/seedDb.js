const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.resolve(__dirname, './users.db');
const db = new sqlite3.Database(dbPath);

async function seedUser() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);

  db.run(
    'INSERT OR IGNORE INTO users (username, email, password) VALUES (?, ?, ?)',
    ['admin', 'admin@skillspring.com', hashedPassword],
    function(err) {
      if (err) {
        console.error("Error seeding:", err.message);
      } else {
        console.log("Successfully seeded user: admin / admin@skillspring.com / admin123");
      }
      db.close();
    }
  );
}

seedUser();
