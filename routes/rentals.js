const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
const auth = require('../middleware/auth');

Fawn.init(mongoose);


// Creating middleware 
router.use(express.json());

const { Rental, validateRental } = require('../modles/rental');
const { Customer } = require('../modles/customer');
const { Movie } = require('../modles/movie');


// Router to all the endpoint to this customer
router.get('/', async (req, res) => {
    // GETTING DATA FROM  DATABASE
    const rental = await Rental
        .find()
        .sort('-dateOut');
    res.send(rental);
});

// Router to this endpoint at specific id 
router.get('/:id', async (req, res) => {
    // GETTING SPECIFIC ID DATA FROM DATABASE
    const rental = await Rental.findById(req.params.id);
    // IF NO SUCH DATA EXIST RETURN ERROR
    if(!rental) return res.status(404).send('There exist no rental with such id');
    // IF SUCH ID EXIST RETURN THAT DATA
    res.send(rental);
});


// Router to add data to the database
router.post('/', auth, async (req, res) => {
    // VALIDATING THAT THE INPUT IS CORRECT
    const { error } = validateRental(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // VALIDATING THAT THE CUSTOMER EXIST EXIST
    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid customer');

    // VALIDATING THAT THE MOVIE EXIST EXIST
    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Invalid movie');

    // VALIDATING THAT THE MOVIE IS IN STOCK
    if(movie.numberInStock === 0) return res.status(400).send('Movie Not in stock');

    // QUERYING DATABASE TO ADD DATA
    try {
        // MAKING NEW DATA
        const rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        });
        // ADDING TO THE DATABASE

        try {
            new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1}
            })
            .run();
            res.send(rental);
        }
        catch(err) {
            res.status(500).send('Something went wrong'); 
            console.log(`Error: ${err}`);
        }    
    }
    // IF QUERYING NOT SUCCESSFUL
    catch (err) {
        console.log(`Error : ${err}`);
    }
});

module.exports = router;