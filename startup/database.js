const mongoose = require('mongoose');
const winston = require('winston');

// Connecting to the database
module.exports = function() {
    mongoose.connect('mongodb://localhost/Vidly')
    .then(() => winston.info('Connected to the database'));
}