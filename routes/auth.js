const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const { User } = require('../modles/user');

// Creating middleware 
router.use(express.json());

// POST request  
router.post('/', async (req, res) => {
    // VALIDATING THE DATA FOR CORRECTNESS
    const { error } = validateLogin(req.body);
    if(error) return res.status(400).send(error.details[0].message);


    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Invalid email or password');

    // MATCHING PASSWORD
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
    res.send(token);
});

const validateLogin = user => {
    const schema = {
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().required().min(5).max(255)
    }

    return Joi.validate(user, schema)
};

module.exports = router;
