const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');


module.exports = function() {
    // Catching uncaught exceptions
    winston.handleExceptions(
        new winston.transports.Console({ colorise: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'uncaughtExceptions' })
    );

    // Handeling rejections
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    // Configuring winston to log error to the file
    winston.add(winston.transports.File, { filename: 'logFile.log'});
    winston.add(winston.transports.MongoDB, { 
        db: 'mongodb://localhost/Vidly',
        level: 'error' 
    });
}