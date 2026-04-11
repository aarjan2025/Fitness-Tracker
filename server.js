const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');

const workoutRoutes = require('./routes/workoutRoutes');

const app = express();

// Middleware
app.use(cors());                   // allow requests from the frontend
app.use(bodyParser.json());        // parse JSON request bodies

// Routes - all workout endpoints handled by workoutRoutes
app.use('/workouts', workoutRoutes);

// 404 handler for any unrecognised route
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});