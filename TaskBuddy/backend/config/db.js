const mongoose = require('mongoose');

// Connects to MongoDB using MONGO_URI from the .env file.
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || uri === 'your_mongodb_connection_string') {
    throw new Error('MONGO_URI is not set. Copy backend/.env.example to backend/.env and add your connection string.');
  }

  mongoose.set('strictQuery', true);
  const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log(`MongoDB connected: ${conn.connection.host} / ${conn.connection.name}`);
};

module.exports = connectDB;
