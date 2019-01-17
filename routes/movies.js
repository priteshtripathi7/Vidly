const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


// Creating middleware 
router.use(express.json());

// Importing genre model
const {Genre} = require('../modles/genre');
const {Movie, validateMovie} = require('../modles/movie');

// Router to all the endpoint to this customer
router.get('/', async (req, res) => {
    // GETTING DATA FROM  DATABASE
    const movies = await Movie
        .find()
        .sort('name');
    res.send(movies);
});

// Router to this endpoint at specific id 
router.get('/:id', async (req, res) => {
    // GETTING SPECIFIC ID DATA FROM DATABASE
    const movie = await Movie.findById(req.params.id);
    // IF NO SUCH DATA EXIST RETURN ERROR
    if(!movie) return res.status(404).send('There exist no movie with such id');
    // IF SUCH ID EXIST RETURN THAT DATA
    res.send(movie);
});


// Router to add data to the database
router.post('/', auth, async (req, res) => {
    // VALIDATING THAT THE INPUT IS CORRECT
    const { error } = validateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // VALIDATING THAT THE GENRE EXIST
    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid genre');

    // QUERYING DATABASE TO ADD DATA

    // MAKING NEW DATA
    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            genre: genre.genre
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    // ADDING TO THE DATABASE
    await movie.save();
    res.send(movie);
});

// Router to Update data in the database
router.put('/:id', [auth, admin], async (req, res) => {
    // VALIDATING THE DATA IS CORRECT
    const { error } = validateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // VALIDATING THAT THE GENRE EXIST
    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send('There exist no movie with such genre');

    // QUERYING THE DATABASE TO UPDATE
    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            genre: {
                _id: genre._id,
                genre: genre.genre
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }
    }, { new: true });

    // IF QUERY NOT SUCCESSFUL THEN REPORT ERROR
    if(!movie) return res.status(404).send('There is no such movie with that id');
    // IF QUERY SUCCESSFUL RETURN UPDATED DATA
    res.send(movie);
});

// Router to delete dat from database
router.delete('/:id', auth, async (req, res) => {
    // FINDING THE ID AND DELEING THE DATA FROM DATABASE
    const movie = await Movie.findByIdAndRemove(req.params.id);
    // IF NOT SUCCESSFUL THEN RETURN ERROR
    if(!movie) return res.status(404).send('There is no movie with such id');
    // IF SUCCESSFUL THEN RETURN DELETED DATA
    res.send(movie);
});

module.exports = router;