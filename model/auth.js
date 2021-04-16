var jwt = require('jsonwebtoken');
var db = require('./database.js');

function verifyToken(req, res, next) {
  var token = req.headers['sass-access-token'];
  var id    = req.headers['id'];
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  jwt.verify(token, db.secret, function(err, decoded) {
    if (err)
    return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    if(id !== decoded.id)   
    return res.status(401).send({ auth: false, message: 'invalid token.' })
    next();
  });
}
module.exports = verifyToken;
