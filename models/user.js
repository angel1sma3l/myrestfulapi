const config = require('config');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

//Schema
const userSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 23
    },
    email: {
        type: String,
        unique: true,
        required: true,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: Boolean
 });

 //generateAuthToken function
 userSchema.methods.generateAuthToken = function (){
//creating json web token
 const privatekey = config.get('jwtPrivateKey');
 const payload = {email: this.email, isAdmin: this.isAdmin};
 const token = jwt.sign( payload, privatekey, {
     expiresIn: '1h'
 });

 return token;
 }
 
//Model
const User = mongoose.model('User', userSchema);
 
 function validateUser(user) {
     schema = Joi.object({
         name: Joi.string().min(3).max(23).required(),
         email: Joi.string().min(5).max(255).required().email(),
         password: Joi.string().min(5).max(255).required()
     });

     return schema.validate(user);

 }

 module.exports.User = User;
 module.exports.validateUser = validateUser;