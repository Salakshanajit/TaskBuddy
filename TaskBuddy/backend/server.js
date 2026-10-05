require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// CORS: only the configured frontend origin(s) may call the API from a browser.
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // allow tools without an Origin header (curl, Postman) and whitelisted origins
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
  })
);
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (req, res) => res.status(200).json({ success: true, status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_secret_key') {
    console.error('JWT_SECRET is not set. Copy backend/.env.example to backend/.env and set a real secret.');
    process.exit(1);
  }

  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection failed:', err.message);
    console.error('Check MONGO_URI in backend/.env and make sure MongoDB is running (or your Atlas IP is allowed).');
    process.exit(1);
  }

  app.listen(PORT, () => console.log(`TaskBuddy API running on port ${PORT}`));
};

start();
