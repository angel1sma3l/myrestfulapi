const Joi = require('joi');//validation

module.exports = function() {
Joi.objectId = require('joi-objectid')(Joi);//use to catch valid Id.
}