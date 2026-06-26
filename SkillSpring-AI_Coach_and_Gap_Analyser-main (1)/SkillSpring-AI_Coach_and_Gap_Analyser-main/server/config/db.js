const mongoose = require('mongoose');

let hasAttemptedConnection = false;

async function connectDb() {
  if (hasAttemptedConnection) {
    return mongoose.connection.readyState === 1;
  }

  hasAttemptedConnection = true;

  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI missing. Running server in in-memory development mode.');
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 4000,
    });

    console.log('MongoDB connected.');
    return true;
  } catch (error) {
    console.warn('MongoDB unavailable. Falling back to in-memory store.');
    console.warn(error.message);
    return false;
  }
}

function isDbReady() {
  return mongoose.connection.readyState === 1;
}

module.exports = {
  connectDb,
  isDbReady,
};

