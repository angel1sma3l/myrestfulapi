const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const genres = require('../routes/genres');
const movies = require('../routes/movies');
const users = require('../routes/users');
const auth = require('../routes/auth');
const customers = require('../routes/customers');
const rentals = require('../routes/rentals');
const returns = require('../routes/returns');
const error  = require('../middleware/error');
const home = require('../routes/home');
const checkToken = require('../routes/checktoken');

module.exports = function(app) {
//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/returns', returns);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/home', home);
app.use('/checkToken', checkToken);

app.use(error);
}