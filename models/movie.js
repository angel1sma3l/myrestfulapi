const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const{ genreSchema } = require('./genre');

//Model with Schema
const Movie = mongoose.model('Movie', new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  genre: {
      type: genreSchema,
      required: true
  }, 
  numberInStock: {
       type: Number, 
       required: true,
       min: 0,
       max: 255
},
  dailyRentalRate: { 
      type: Number, 
      required: true,
      min: 0,
      max: 255
     }
}));

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required()

  });

  return schema.validate(movie);
}

async function createMovie(title, genre) {
    const movie = new Movie({
      title, 
      genre
    }); 
    
    const result = await movie.save();
    console.log(result);
  }

  async function listMovies() {
      const movies = await Movie
      .find()
      .populate('Genre', 'name -_id');
      console.log(movies);
  }

  //listMovies();
  //createMovie('Terminator', new Genre({name: 'Action'}));

module.exports.Movie = Movie;
module.exports.validate = validateMovie;