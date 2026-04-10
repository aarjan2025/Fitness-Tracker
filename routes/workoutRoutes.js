const express = require('express');
const router = express.Router();
const db = require('../db/database');

/**
 * @api {get} /workouts Get all workouts
 * @apiName GetWorkouts
 * @apiGroup Workout
 *
 * @apiSuccess {Number} id Workout unique ID.
 * @apiSuccess {String} type Type of workout.
 * @apiSuccess {Number} duration Duration of the workout in minutes.
 * @apiSuccess {Number} calories Number of calories burned.
 */
router.get('/', (req, res) => {
  db.all("SELECT * FROM workouts", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// POST a new workout
router.post('/', (req, res) => {
  const { type, duration, calories } = req.body;
  db.run(`INSERT INTO workouts (type, duration, calories) VALUES (?, ?, ?)`,
    [type, duration, calories],
    function(err) {
      res.json({ id: this.lastID });
    }
  );
});

// PUT update workout
router.put('/:id', (req, res) => {
  const { type, duration, calories } = req.body;
  db.run(`UPDATE workouts SET type=?, duration=?, calories=? WHERE id=?`,
    [type, duration, calories, req.params.id],
    function(err) {
      res.json({ updated: this.changes });
    }
  );
});

// DELETE workout
router.delete('/:id', (req, res) => {
  db.run(`DELETE FROM workouts WHERE id=?`,
    [req.params.id],
    function(err) {
      res.json({ deleted: this.changes });
    }
  );
});

module.exports = router;