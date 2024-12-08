const express = require('express');
const router = express.Router();
const { ObjectId, MongoClient } = require('mongodb');
require('dotenv').config();

let db = null;

// Initialize MongoDB connection
async function initializeMongo() {
    try {
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        console.log('Connected to MongoDB');
        db = client.db('firsttouch');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

// Initialize connection before handling routes
initializeMongo();

// Middleware to ensure database is connected
router.use(async (req, res, next) => {
    if (!db) {
        await initializeMongo();
    }
    next();
});

// User Routes
router.post('/users', async (req, res) => {
    try {
        const { profile_type, name, email, grade, age, profile_picture } = req.body;
        const result = await db.collection('users').insertOne({
            profile_type,
            name,
            email,
            grade,
            age,
            profile_picture
        });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Training Session Routes
router.post('/sessions', async (req, res) => {
    try {
        const { date, time, duration, coach_id } = req.body;
        const result = await db.collection('training_sessions').insertOne({
            date: new Date(date),
            time,
            duration,
            coach: new ObjectId(coach_id),
            players: [],
            status: 'available'
        });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Available Sessions
router.get('/sessions/available', async (req, res) => {
    try {
        const sessions = await db.collection('training_sessions')
            .find({ status: 'available' })
            .toArray();
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Book a Session
router.put('/sessions/:id/book', async (req, res) => {
    try {
        const { player_id } = req.body;
        const result = await db.collection('training_sessions').updateOne(
            { _id: new ObjectId(req.params.id) },
            { 
                $push: { players: new ObjectId(player_id) },
                $set: { status: 'booked' }
            }
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Payment Routes
router.post('/payments', async (req, res) => {
    try {
        const { session_id, player_id, amount } = req.body;
        const result = await db.collection('payments').insertOne({
            session: new ObjectId(session_id),
            player: new ObjectId(player_id),
            amount,
            status: 'pending',
            date: new Date()
        });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get User's Sessions
router.get('/users/:id/sessions', async (req, res) => {
    try {
        const sessions = await db.collection('training_sessions')
            .find({ players: new ObjectId(req.params.id) })
            .toArray();
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
