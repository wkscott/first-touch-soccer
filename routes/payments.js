const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { sendEmail } = require('../utils/emailService');
const { generateReceipt } = require('../utils/pdfGenerator');

// Create new payment
router.post('/create', isAuthenticated, async (req, res) => {
    try {
        const { bookingId, venmoUsername } = req.body;
        
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const payment = new Payment({
            user: req.user._id,
            booking: bookingId,
            amount: 2000, // $20.00 in cents
            paymentMethod: 'venmo',
            venmoUsername
        });

        await payment.save();

        // Send payment instructions email
        await sendEmail({
            to: req.user.email,
            subject: 'Payment Instructions',
            template: 'paymentInstructions',
            data: {
                amount: payment.formattedAmount,
                venmoUsername: process.env.VENMO_USERNAME
            }
        });

        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create payment' });
    }
});

// Verify payment (admin only)
router.post('/:id/verify', isAdmin, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        payment.status = 'completed';
        payment.verificationStatus = 'verified';
        payment.verifiedBy = req.user._id;
        payment.verificationDate = new Date();
        payment.venmoTransactionId = req.body.transactionId;

        await payment.save();

        // Generate and store receipt
        const receiptBuffer = await generateReceipt(payment);
        const receiptUrl = await uploadReceipt(receiptBuffer, payment._id);
        payment.receiptUrl = receiptUrl;
        await payment.save();

        // Send confirmation email
        await sendEmail({
            to: req.user.email,
            subject: 'Payment Confirmed',
            template: 'paymentConfirmed',
            data: {
                amount: payment.formattedAmount,
                receiptUrl: payment.receiptUrl
            }
        });

        res.json(payment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to verify payment' });
    }
});

// Get payment history for user
router.get('/history', isAuthenticated, async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user._id })
            .populate('booking')
            .sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payment history' });
    }
});

// Request refund
router.post('/:id/refund', isAuthenticated, async (req, res) => {
    try {
        const payment = await Payment.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        payment.status = 'refunded';
        payment.refundReason = req.body.reason;
        await payment.save();

        // Notify admin of refund request
        await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: 'Refund Request',
            template: 'refundRequest',
            data: {
                paymentId: payment._id,
                amount: payment.formattedAmount,
                reason: req.body.reason
            }
        });

        res.json(payment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to request refund' });
    }
});

module.exports = router; 