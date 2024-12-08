const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/health', async (req, res) => {
    try {
        // Check database connection
        const dbStatus = mongoose.connection.readyState === 1;

        // Check other services as needed
        const emailService = await checkEmailService();
        const paymentService = await checkPaymentService();

        res.json({
            status: 'healthy',
            timestamp: new Date(),
            services: {
                database: dbStatus ? 'connected' : 'disconnected',
                email: emailService ? 'operational' : 'down',
                payment: paymentService ? 'operational' : 'down'
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            error: error.message
        });
    }
});

module.exports = router; 