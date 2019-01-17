const express = require('express');

// Importing the routes
const genres = require('../routes/genres');
const home = require('../routes/home');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function(app) {
    // Directing all routes of generes to route
    app.use('/api/genres', genres);
    // Directing all routes of customers to customers
    app.use('/api/customers', customers);
    // Directing all routes of home page to home
    app.use('/', home);
    // Directing all routes of movie to movies
    app.use('/api/movies', movies);
    // Directing all routes of rental to rentals
    app.use('/api/rentals', rentals);
    // Directing all routes of users to users
    app.use('/api/users', users);
    // Directing all routes of auth to auth
    app.use('/api/auth', auth);
    // Directing all the errors to the error middleware
    app.use(error);
};