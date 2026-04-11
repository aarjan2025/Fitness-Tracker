const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./fitnessTracker.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create table and seed sample data only if table is empty
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS workouts (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    type     TEXT    NOT NULL,
    duration INTEGER NOT NULL,
    calories INTEGER NOT NULL
  )`, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
      return;
    }

    // Only insert sample data if table is currently empty
    db.get('SELECT COUNT(*) AS count FROM workouts', (err, row) => {
      if (err) { console.error(err.message); return; }

      if (row.count === 0) {
        const sampleWorkouts = [
          { type: 'Running',  duration: 30, calories: 200 },
          { type: 'GYM',      duration: 45, calories: 350 },
          { type: 'Yoga',     duration: 60, calories: 150 },
          { type: 'Cycling',  duration: 40, calories: 220 },
          { type: 'HIIT',     duration: 20, calories: 230 },
          { type: 'Swimming', duration: 45, calories: 400 },
          { type: 'Walking',  duration: 60, calories: 180 },
          { type: 'Pilates',  duration: 50, calories: 200 },
          { type: 'Boxing',   duration: 40, calories: 450 },
          { type: 'Rowing',   duration: 35, calories: 300 },
          { type: 'Running',  duration: 25, calories: 175 },
          { type: 'GYM',      duration: 60, calories: 420 },
          { type: 'Yoga',     duration: 45, calories: 130 },
          { type: 'Cycling',  duration: 50, calories: 280 },
          { type: 'HIIT',     duration: 30, calories: 320 },
          { type: 'Swimming', duration: 30, calories: 260 },
          { type: 'Walking',  duration: 90, calories: 250 },
          { type: 'Pilates',  duration: 60, calories: 220 },
          { type: 'Boxing',   duration: 45, calories: 500 },
          { type: 'Rowing',   duration: 40, calories: 340 },
        ];

        const stmt = db.prepare(
          'INSERT INTO workouts (type, duration, calories) VALUES (?, ?, ?)'
        );
        sampleWorkouts.forEach((w) => {
          stmt.run([w.type, w.duration, w.calories], (err) => {
            if (err) console.error('Seed error:', err.message);
          });
        });
        stmt.finalize();
        console.log('Sample workout data inserted (20 records)');
      }
    });
  });
});

module.exports = db;