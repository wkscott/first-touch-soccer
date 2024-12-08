const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('Attempting to connect to MongoDB...');
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        console.log('Successfully connected to MongoDB!');
        
        // Test database access
        const db = client.db('firsttouch');
        await db.command({ ping: 1 });
        console.log('Database access successful!');
        
        await client.close();
    } catch (error) {
        console.error('Connection error:', error);
    }
}

testConnection(); 