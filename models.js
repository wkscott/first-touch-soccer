const { MongoClient } = require('mongodb');
require('dotenv').config();

async function setupDatabase() {
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        
        const db = client.db('firsttouch'); // Create/use database named 'firsttouch'
        
        // Create collections with validation
        await db.createCollection('users', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['profile_type', 'name', 'email'],
                    properties: {
                        profile_type: {
                            enum: ['coach', 'player', 'parent'],
                            description: 'must be coach, player, or parent'
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
                            enum: ['available', 'booked', 'completed'],
                            description: 'must be available, booked, or completed'
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
        
        // Create indexes for better performance
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        await db.collection('training_sessions').createIndex({ date: 1, time: 1 });
        await db.collection('payments').createIndex({ session: 1, player: 1 });
        
        console.log('Indexes created successfully');

    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        await client.close();
    }
}

setupDatabase();
