const Joi = require('joi');
const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


// making router to export all the routes  
const router = express.Router();

// Importing the genre model
const { Genre, validateGenre} = require('../modles/genre');

// Creating middleware 
router.use(express.json());


// GET request for genres endpoint
router.get('/', async (req, res) => {
    // QUERYING THE DATABASE
    throw new Error('could not get genres');
    const genres = await Genre
        .find()
        .sort('genre');
    // GIVING THE RESULT TO THE DATABASE
    res.send(genres);
});

// GET request for particular id
router.get('/:id', async (req, res) => {
    // QUERYING THE DATABASE FOR A SPECIFIC ID
    const genre = await Genre.findById(req.params.id);
    // IF NOT FOUND REPORT ERROR
    if(!genre) return res.status(404).send('There is no such genre with that id..');
    // IF FOUND THEN RETURN DATA
    res.send(genre);
});

// POST request  
router.post('/', auth, async (req, res) => {
    // VALIDATING THE DATA FOR CORRECTNESS
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // QUERYING DATABASE TO ADD DATA    
    const genre = new Genre({ genre: req.body.genre });
    // SAVING DATA TO THE DATABASE
    await genre.save();
    // RETURNING THE SAVED DATA WITH ID
    res.send(genre);
});

// PUT request to update a particular id
router.put('/:id', auth, async (req, res) => {
    // VALIDATING THE DATA FOR CORRECTNESS
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // UPDATING THE DATA IN THE DATABASE
    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        $set: {
            genre: req.body.genre
        }
    }, { new: true });
    // IF NOT SUCCESSFUL THEN REPORT ERROR
    if(!genre) return res.status(404).send('There is no such genre with that id..');
    // IF SUCCESFUL THEN RETURN UPDATED DATA
    res.send(genre);
});

// DELETE request of a particular genre
router.delete('/:id', [auth, admin], async (req, res) => {
    // FINDING AND DELETING A PARTIULAR ID
    const genre = await Genre.findByIdAndRemove(req.params.id);
    // IF NOT FOUND REPORT ERROR
    if(!genre) return res.status(404).send('There is no such genre with that id..');
    // IF FOUND RETURN DELETED DATA
    res.send(genre);
});


module.exports = router;