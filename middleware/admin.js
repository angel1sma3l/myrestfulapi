
module.exports = function(req, res, next){
    //401 unAuthorized
    //403 forbidden
    
    if (!req.user.isAdmin) return res.status(403).send('Acces denied.');

    next();
}