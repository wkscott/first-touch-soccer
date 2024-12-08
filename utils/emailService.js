const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Email templates
const emailTemplates = {
    bookingConfirmation: (userName, bookingDetails) => ({
        subject: 'Booking Confirmation - First Touch Soccer',
        html: `
            <h1>Booking Confirmation</h1>
            <p>Hi ${userName},</p>
            <p>Your session has been confirmed for:</p>
            <p>Date: ${bookingDetails.date}</p>
            <p>Time: ${bookingDetails.time}</p>
            <p>Location: ${bookingDetails.location}</p>
            <br>
            <p>Please arrive 10 minutes before your session.</p>
            <p>If you need to cancel or reschedule, please contact us at least 24 hours in advance.</p>
        `
    }),

    reminderEmail: (userName, bookingDetails) => ({
        subject: 'Session Reminder - First Touch Soccer',
        html: `
            <h1>Session Reminder</h1>
            <p>Hi ${userName},</p>
            <p>This is a reminder about your upcoming session:</p>
            <p>Date: ${bookingDetails.date}</p>
            <p>Time: ${bookingDetails.time}</p>
            <p>Location: ${bookingDetails.location}</p>
            <br>
            <p>We look forward to seeing you!</p>
        `
    }),

    paymentConfirmation: (userName, paymentDetails) => ({
        subject: 'Payment Confirmation - First Touch Soccer',
        html: `
            <h1>Payment Confirmation</h1>
            <p>Hi ${userName},</p>
            <p>We've received your payment:</p>
            <p>Amount: $${paymentDetails.amount}</p>
            <p>Date: ${paymentDetails.date}</p>
            <p>Thank you for your business!</p>
        `
    })
};

// Send email function
async function sendEmail(to, template, data) {
    try {
        const emailContent = emailTemplates[template](data.userName, data.details);
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: emailContent.subject,
            html: emailContent.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
}

module.exports = { sendEmail }; 