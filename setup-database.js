const { MongoClient } = require('mongodb');
require('dotenv').config();

async function setupDatabase() {
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        
        const db = client.db('firsttouch');
        
        // Create collections with validation
        await db.createCollection('users', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['profile_type', 'name', 'email'],
                    properties: {
                        profile_type: {
                            enum: ['coach', 'player', 'parent']
                        },
                        name: { bsonType: 'string' },
                        email: { bsonType: 'string' },
                        grade: { bsonType: 'number' },
                        age: { bsonType: 'number' },
                        profile_picture: { bsonType: 'string' }
                    }
                }
            }
        });

        await db.createCollection('training_sessions', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['date', 'time', 'duration', 'coach', 'status'],
                    properties: {
                        date: { bsonType: 'date' },
                        time: { bsonType: 'string' },
                        duration: { bsonType: 'number' },
                        coach: { bsonType: 'objectId' },
                        players: { 
                            bsonType: 'array',
                            items: { bsonType: 'objectId' }
                        },
                        status: {
                            enum: ['available', 'booked', 'completed']
                        }
                    }
                }
            }
        });

        await db.createCollection('payments', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['session', 'player', 'amount', 'status', 'date'],
                    properties: {
                        session: { bsonType: 'objectId' },
                        player: { bsonType: 'objectId' },
                        amount: { bsonType: 'number' },
                        status: { bsonType: 'string' },
                        date: { bsonType: 'date' }
                    }
                }
            }
        });

        console.log('Database collections created successfully');
        
    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        await client.close();
    }
}

setupDatabase();
