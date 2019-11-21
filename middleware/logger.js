
const log = function(req, res, next){
  console.log('Logging....');
  next();
}
const auth = function(req, res, next){
  console.log('Authenticating....');
  next();
}

module.exports.log = log;
module.exports.auth = auth;
