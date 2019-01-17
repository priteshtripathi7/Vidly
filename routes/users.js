const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');


const { User, validateUser } = require('../modles/user');

// Creating middleware 
router.use(express.json());

// GETTING current user
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

// POST request  
router.post('/', async (req, res) => {
    // VALIDATING THE DATA FOR CORRECTNESS
    const { error } = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);


    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send('User already registerd');

    // QUERYING DATABASE TO ADD DATA
    try {
        // MAKING NEW DATA
        user = new User(
            _.pick(req.body, ['name', 'email', 'password'])
        );

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        // ADDING TO THE DATABASE
        await user.save();
        const token = user.generateAuthToken();
        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    }
    // IF QUERYING NOT SUCCESSFUL
    catch (err) {
        console.log(`Error : ${err}`);
    }
});

module.exports = router;
