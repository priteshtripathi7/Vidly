const mongoose = require('mongoose');
const Joi = require('joi');

// Creating the schema
const genreSchema = new mongoose.Schema({
    genre: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    }
});

// Creating the class
const Genre = mongoose.model('Genre', genreSchema);

// JOI INPUT VALIDATOR
const validateGenre = genre => {
    const schema = {
        genre: Joi.string().min(3).required()
    };

    return Joi.validate(genre, schema);
};

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validateGenre = validateGenre;