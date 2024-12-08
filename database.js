const { MongoClient } = require('mongodb');
require('dotenv').config();

// Database schema
const collections = {
  users: {
    profile_type: String, // "coach", "player", "parent"
    name: String,
    email: String,
    grade: Number,
    age: Number,
    profile_picture: String
  },

  training_sessions: {
    date: Date,
    time: String,
    duration: Number,
    coach: ObjectId,
    players: [ObjectId],
    status: String // "available", "booked", "completed"
  },

  payments: {
    session: ObjectId,
    player: ObjectId,
    amount: Number,
    status: String,
    date: Date
  }
};

// Connection URL from your .env file
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('firsttouch');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

module.exports = { connectToDatabase };