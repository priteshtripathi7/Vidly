const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


// Importing the customer model
const { customerSchema, validateCustomer } = require('../modles/customer');

// Creating middleware 
router.use(express.json());

// Making the customer model
const Customer = mongoose.model('Customer', customerSchema);


// Router to all the endpoint to this customer
router.get('/', async (req, res) => {
    // GETTING DATA FROM  DATABASE
    const customers = await Customer
        .find()
        .sort('name');
    res.send(customers);
});


// Router to this endpoint at specific id 
router.get('/:id', async (req, res) => {
    // GETTING SPECIFIC ID DATA FROM DATABASE
    const customer = await Customer.findById(req.params.id);
    // IF NO SUCH DATA EXIST RETURN ERROR
    if(!customer) return res.status(404).send('There exist no customer with such id');
    // IF SUCH ID EXIST RETURN THAT DATA
    res.send(customer);
});


// Router to add data to the database
router.post('/', auth, async (req, res) => {
    // VALIDATING THAT THE INPUT IS CORRECT
    const { error } = validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // QUERYING DATABASE TO ADD DATA
   
    // MAKING NEW DATA
    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
         isGold: req.body.isGold
    });
    // ADDING TO THE DATABASE
    await customer.save();
    res.send(customer);
});

// Router to Update data in the database
router.put('/:id', auth, async (req, res) => {
    // VALIDATING THE DATA IS CORRECT
    const { error } = validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // QUERYING THE DATABASE TO UPDATE
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold
        }
    }, { new: true });

    // IF QUERY NOT SUCCESSFUL THEN REPORT ERROR
    if(!customer) return res.status(404).send('There is no such customer with that id');
    // IF QUERY SUCCESSFUL RETURN UPDATED DATA
    res.send(customer);
});

// Router to delete dat from database
router.delete('/:id', [auth, admin], async (req, res) => {
    // FINDING THE ID AND DELEING THE DATA FROM DATABASE
    const customer = await Customer.findByIdAndRemove(req.params.id);
    // IF NOT SUCCESSFUL THEN RETURN ERROR
    if(!customer) return res.status(404).send('There is no customer with such id');
    // IF SUCCESSFUL THEN RETURN DELETED DATA
    res.send(customer);
});

// Exporting the router to the outside index
module.exports = router;