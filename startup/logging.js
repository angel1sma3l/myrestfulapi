const config = require('config');
const winston = require('winston');
require('express-async-errors');//try and catch errors
require('winston-mongodb');

module.exports = function() {

//Catching exception that are not in express processes.
winston.exceptions.handle( 
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' }));

//Catching unhandled promise rejection.
process.on('unhandledRejection', (ex) => {
    throw ex;
});

//logging message in logfile
winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.Console({ colorize: true, prettyPrint: true }));
//logging errors to database.
// winston.add(new winston.transports.MongoDB({ 
//     db: config.get('dbconnect'),
//     level: 'info' 
// }));
}