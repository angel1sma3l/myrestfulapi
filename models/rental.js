const Joi = require('joi');
const moment = require('moment');
const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  customer: {
      type: new mongoose.Schema({
        name: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 15
        },
        isGold: {
            type: Boolean,
            default: false
        },
        phone: {
            type: String,
            required: true,
            minlength: 7,
            maxlength: 11
        }
      }),
      required: true
  },
  movie: {
      type: new mongoose.Schema({
          title: {
            type: String,
            trim: true,
            required: true,
            minlength: 5,
            maxlength: 255
          },
            dailyRentalRate: { 
              type: Number, 
              required: true,
              min: 0,
              max: 255
             }
      }),
      required:true
  },
    dateOut: {
        type: Date,
        require: true,
        date: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    },

});

//static function
rentalSchema.statics.lookup = function (customerId, movieId) {
  return this.findOne({
    'customer._id': customerId,
    'movie._id': movieId
  });
}

//instance function, Calculate rentalFee with rental day and rate
rentalSchema.methods.return = function () {
    this.dateReturned = new Date();

    const rentalDays = moment().diff(this.dateOut, 'days');
    this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

//Model 
const Rental = mongoose.model('Rental', rentalSchema); 
    
function validateRental(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()//using objectI(), isntead of string() to check if ID is a valid ID
  };

  return Joi.validate(rental, schema);
}

module.exports.Rental = Rental;
module.exports.validate = validateRental;