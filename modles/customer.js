const Joi = require('Joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: String,
        trim: true,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        required: true,
        enum: [true, false]
    }
});

// Making the customer model
const Customer = mongoose.model('Customer', customerSchema);

const validateCustomer = customer => {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold:Joi.boolean().required()
    };

    return Joi.validate(customer, schema);
}

exports.customerSchema = customerSchema;
exports.validateCustomer = validateCustomer;
exports.Customer = Customer;