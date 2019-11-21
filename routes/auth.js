//Sign in 

const _ = require('lodash');
const bcryptjs = require('bcryptjs');
const Joi = require('joi');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

//Routers
  router.post('/', async (req, res) => {
      //validating body with Joi.validate function.
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

      //find user.email
        let user = await User.findOne({email: req.body.email});
        if (!user) return res.status(400).send('Email or Password incorrect!');
    
    //validate passsword
        const validPassword = await bcryptjs.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send('Email or Password incorrect!');
    
        const token = user.generateAuthToken();

        res.send(token);
   
  });


function validate(req) {
    schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(req, schema);

}

module.exports = router;