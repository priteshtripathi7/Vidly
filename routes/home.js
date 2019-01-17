const express = require('express');
const router = express.Router();

// GET request for the main directory
router.get('/', (req, res) => {
    res.send('Welcome to VIDLY ');
});

module.exports = router;
