const sqlite3 = require('sqlite3').verbose();

// Create or open the database
const db = new sqlite3.Database('./fitnessTracker.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

module.exports = db;