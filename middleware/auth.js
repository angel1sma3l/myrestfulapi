const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next){
    const token = req.cookies.token;
    if(!token) return res.status(401).send('Access denied, no token provided..')
    
    try {
    const decodedToken = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decodedToken;
    next();
    } catch(ex) {
        res.status(400).send('Invalid token');
    }
    
  }

   