const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Student Task Manager API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;