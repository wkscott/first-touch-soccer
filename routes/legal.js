const express = require('express');
const router = express.Router();

router.get('/privacy-policy', (req, res) => {
    res.render('legal/privacy-policy', {
        lastUpdated: '2024-03-19',
        companyName: 'Your Company Name',
        contactEmail: 'privacy@yourcompany.com'
    });
});

module.exports = router; 