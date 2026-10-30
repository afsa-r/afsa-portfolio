const mongoose = require('mongoose');

// Connects to MongoDB using the secret URI from the .env file.
async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing. Check your .env file.');
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');
}

module.exports = connectDB;
