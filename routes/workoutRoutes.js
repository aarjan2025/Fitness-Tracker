const express = require('express');
const router  = express.Router();
const db      = require('../db/database');

/**
 * @api {get} /workouts Get all workouts
 * @apiName GetWorkouts
 * @apiGroup Workout
 * @apiSuccess {Object[]} workouts Array of workout objects.
 * @apiSuccess {Number}   workouts.id       Unique workout ID.
 * @apiSuccess {String}   workouts.type     Type of workout.
 * @apiSuccess {Number}   workouts.duration Duration in minutes.
 * @apiSuccess {Number}   workouts.calories Calories burned.
 */
router.get('/', (req, res) => {
  db.all('SELECT * FROM workouts', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

/**
 * @api {get} /workouts/:id Get a single workout
 * @apiName GetWorkout
 * @apiGroup Workout
 * @apiParam  {Number} id Workout unique ID.
 * @apiSuccess {Number} id       Unique workout ID.
 * @apiSuccess {String} type     Type of workout.
 * @apiSuccess {Number} duration Duration in minutes.
 * @apiSuccess {Number} calories Calories burned.
 * @apiError   {String} error    Workout not found.
 */
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM workouts WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.json(row);
  });
});

/**
 * @api {post} /workouts Add a new workout
 * @apiName AddWorkout
 * @apiGroup Workout
 * @apiParam  {String} type     Type of workout (e.g. Running).
 * @apiParam  {Number} duration Duration in minutes.
 * @apiParam  {Number} calories Calories burned.
 * @apiSuccess {Number} id ID of the newly created workout.
 * @apiError   {String} error Validation or database error.
 */
router.post('/', (req, res) => {
  const { type, duration, calories } = req.body;

  if (!type || !duration || !calories) {
    return res.status(400).json({ error: 'type, duration and calories are all required' });
  }
  if (typeof duration !== 'number' || duration <= 0) {
    return res.status(400).json({ error: 'duration must be a positive number' });
  }
  if (typeof calories !== 'number' || calories <= 0) {
    return res.status(400).json({ error: 'calories must be a positive number' });
  }

  db.run(
    'INSERT INTO workouts (type, duration, calories) VALUES (?, ?, ?)',
    [type, duration, calories],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

/**
 * @api {put} /workouts/:id Update an existing workout
 * @apiName UpdateWorkout
 * @apiGroup Workout
 * @apiParam  {Number} id       Workout unique ID (URL param).
 * @apiParam  {String} type     New type of workout.
 * @apiParam  {Number} duration New duration in minutes.
 * @apiParam  {Number} calories New calories burned.
 * @apiSuccess {Number} updated Number of rows updated (1 on success).
 * @apiError   {String} error   Validation or database error.
 */
router.put('/:id', (req, res) => {
  const { type, duration, calories } = req.body;
  const { id } = req.params;

  if (!type || !duration || !calories) {
    return res.status(400).json({ error: 'type, duration and calories are all required' });
  }

  db.run(
    'UPDATE workouts SET type = ?, duration = ?, calories = ? WHERE id = ?',
    [type, duration, calories, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Workout not found' });
      }
      res.json({ updated: this.changes });
    }
  );
});

/**
 * @api {delete} /workouts/:id Delete a workout
 * @apiName DeleteWorkout
 * @apiGroup Workout
 * @apiParam  {Number} id Workout unique ID.
 * @apiSuccess {Number} deleted Number of rows deleted (1 on success).
 * @apiError   {String} error   Workout not found or database error.
 */
router.delete('/:id', (req, res) => {
  db.run(
    'DELETE FROM workouts WHERE id = ?',
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Workout not found' });
      }
      res.json({ deleted: this.changes });
    }
  );
});

module.exports = router;