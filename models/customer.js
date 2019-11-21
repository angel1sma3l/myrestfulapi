const Joi = require('Joi');
const mongoose = require('mongoose');


//Model with Schema
const customerSchema = new mongoose.Schema({
  name: 
  {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 15
  },
  isGold: {
      type: Boolean,
      default: false
  },
  phone:
  {
      type: String,
      minlength: 7,
      maxlength: 11
  }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const schema = {
      name: Joi.string().min(5).required(),
      isGold: Joi.boolean(),
      phone: Joi.string().min(7).max(11)
    };
  
    return Joi.validate(customer, schema);
  }

  module.exports.Customer = Customer;
  module.exports.validateCustomer = validateCustomer();