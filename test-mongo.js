const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testMongo() {
    try {
        console.log('URI:', process.env.MONGODB_URI); // This will help us verify the URI
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        console.log('Connected successfully!');
        const db = client.db('firsttouch');
        await db.command({ ping: 1 });
        console.log('Database pinged successfully!');
        await client.close();
    } catch (error) {
        console.error('Connection error:', error);
    }
}

testMongo();
