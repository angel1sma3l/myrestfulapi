const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {Rental, validate } = require('../models/rental'); 
const validateObjectId = require('../middleware/validateObjectId');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');
const Fawn = require('fawn');//works as database transaction

Fawn.init(mongoose);


//ROUTE methods Get
router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('dateOut');
  res.send(rentals);
});

//POST method
router.post('/', validateObjectId,  async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send(error.details[0].message);

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Not movie found');

    if (movie.numberInStock === 0) return res.status(400).send('Movie is not in stock');

  let rental = new Rental({ 
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate
      }
    });
  
    try {
        new Fawn.Task()
        .save('rentals', rental)
        .update('movies', {_id: movie._id }, {
            $inc: { numberInStock: -1 }
        })
        .run();
    
    res.send(rental);
    } catch {
        res.status(500).send('Something failed');
    }

});

module.exports = router;