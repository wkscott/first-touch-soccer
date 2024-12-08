const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const db = require('./db');

// Venmo payment endpoint
router.post('/payments/venmo', async (req, res) => {
  try {
    const { amount, note, recipient, player_id, session_id } = req.body;
    
    // Create payment record
    const payment = await db.collection('payments').insertOne({
      session: new ObjectId(session_id),
      player: new ObjectId(player_id),
      amount: amount,
      status: 'pending',
      payment_method: 'venmo',
      date: new Date(),
      venmo_details: {
        recipient,
        note
      }
    });

    // Return Venmo deep link
    const venmoDeepLink = `venmo://paycharge?txn=pay&recipients=${recipient}&amount=${amount}&note=${encodeURIComponent(note)}`;
    
    res.json({
      payment_id: payment.insertedId,
      venmo_link: venmoDeepLink,
      web_fallback: `https://venmo.com/${recipient}`
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify Venmo payment status
router.post('/payments/venmo/verify', async (req, res) => {
  try {
    const { payment_id } = req.body;
    
    // In a real implementation, you would verify the payment with Venmo's API
    // For now, we'll just update the status
    await db.collection('payments').updateOne(
      { _id: new ObjectId(payment_id) },
      { $set: { status: 'completed' } }
    );

    res.json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 