const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcryptjs = require('bcryptjs');
//Password Complexity use for password validation.
//const PasswordComplexity = require('joi-password-complexity');
const mongoose = require('mongoose');
const {User, validateUser} = require('../models/user');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {  
  //throw new Error('Not working', err);
  const user = await User.find().select('-password');
  res.send(user);
});
//Routers
  router.get('/me', auth, async (req, res) => {  
    //throw new Error('Not working', err);
    const user = await User.findOne({email: req.user.email}).select('-password');
    res.send(user);
  });

  //Register new user
  router.post('/', async (req, res) => {
      const { error } = validateUser(req.body);
      if (error) return res.status(400).send(error.details[0].message);

        //Already existing user
        let user = await User.findOne({email: req.body.email});
        if (user) return res.status(400).send('User already exist');

        user = new User(_.pick(req.body, ['name', 'email', 'password']));

      //hashing password
      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(user.password, salt);
      
      
      const token = user.generateAuthToken();

      //sending token in header
      //res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));//use _.pick to select only 
      //to select user.name and user.email istead of the entire user.

      await user.save();
  });

  module.exports = router;