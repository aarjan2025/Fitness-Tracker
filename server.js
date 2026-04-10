const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const workoutRoutes = require('./routes/workoutRoutes');

// Middleware
app.use(bodyParser.json());  // for parsing application/json
app.use('/workouts', workoutRoutes);

// Database setup
const db = new sqlite3.Database('./fitnessTracker.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create workouts table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    duration INTEGER,
    calories INTEGER
  )`);

  // Insert some sample workout data (optional for testing)
  const sampleWorkouts = [
    { type: 'Running', duration: 30, calories: 200 },
    { type: 'GYM', duration: 45, calories: 350 },
    { type: 'Yoga', duration: 60, calories: 150 },
    { type: 'Cycling', duration: 40, calories: 220 },
    { type: 'HIIT', duration: 20, calories: 230 }
  ];

  // Insert sample workouts into the database
  sampleWorkouts.forEach(workout => {
    db.run(`INSERT INTO workouts (type, duration, calories) VALUES (?, ?, ?)`,
      [workout.type, workout.duration, workout.calories], function(err) {
        if (err) {
          console.error('Error inserting sample data:', err.message);
        }
      });
  });
});

/**
 * @api {get} /workouts Get all workouts
 * @apiName GetWorkouts
 * @apiGroup Workouts
 *
 * @apiSuccess {Object[]} workouts List of all workouts.
 */
app.get('/workouts', (req, res) => {
  db.all('SELECT * FROM workouts', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ workouts: rows });
  });
});

/**
 * @api {post} /workouts Add a new workout
 * @apiName AddWorkout
 * @apiGroup Workouts
 *
 * @apiParam {String} type The type of workout (e.g., running, cycling).
 * @apiParam {Number} duration The duration of the workout in minutes.
 * @apiParam {Number} calories The number of calories burned during the workout.
 *
 * @apiSuccess {Number} id The ID of the newly created workout.
 */
app.post('/workouts', (req, res) => {
  const { type, duration, calories } = req.body;
  const query = `INSERT INTO workouts (type, duration, calories) VALUES (?, ?, ?)`;
  db.run(query, [type, duration, calories], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

/**
 * @api {put} /workouts/:id Update an existing workout
 * @apiName UpdateWorkout
 * @apiGroup Workouts
 *
 * @apiParam {Number} id The ID of the workout to update.
 * @apiParam {String} type The new type of workout.
 * @apiParam {Number} duration The new duration of the workout.
 * @apiParam {Number} calories The new number of calories burned during the workout.
 *
 * @apiSuccess {Number} updated The number of rows updated.
 */
app.put('/workouts/:id', (req, res) => {
  const { id } = req.params;
  const { type, duration, calories } = req.body;
  const query = `UPDATE workouts SET type = ?, duration = ?, calories = ? WHERE id = ?`;
  db.run(query, [type, duration, calories, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ updated: this.changes });
  });
});

/**
 * @api {delete} /workouts/:id Delete a workout
 * @apiName DeleteWorkout
 * @apiGroup Workouts
 *
 * @apiParam {Number} id The ID of the workout to delete.
 *
 * @apiSuccess {Number} deleted The number of rows deleted.
 */
app.delete('/workouts/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM workouts WHERE id = ?`;
  db.run(query, id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ deleted: this.changes });
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});