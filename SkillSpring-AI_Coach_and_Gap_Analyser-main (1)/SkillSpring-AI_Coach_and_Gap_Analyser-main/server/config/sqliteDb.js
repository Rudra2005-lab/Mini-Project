const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../users.db');

let db;

function initSqliteDb() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error connecting to SQLite database', err.message);
        return reject(err);
      }
      console.log(`Connected to the SQLite database at: ${dbPath}`);

      db.run(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        (tableErr) => {
          if (tableErr) {
            console.error('Error creating users table', tableErr.message);
            return reject(tableErr);
          }
          console.log('Ensure "users" table exists.');
          return resolve(db);
        }
      );
    });
  });
}

function getSqliteDb() {
  return db;
}

module.exports = {
  initSqliteDb,
  getSqliteDb,
};
