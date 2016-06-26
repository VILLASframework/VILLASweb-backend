// include
var jwt = require('jsonwebtoken');

var config = require('./config');

module.exports = {
  validateToken: function(req, res, next) {
    // check for token
    if (!req.headers['x-access-token']) {
      return res.status(403).send({ success: false, message: 'No token provided' });
    }

    // verify token
    jwt.verify(req.headers['x-access-token'], config.secret, function(err, decoded) {
      if (err) {
        return res.status(403).send({ success: false, message: 'Authentication failed' });
      }

      // save to request in other routes
      req.decoded = decoded;
      next();
    });
  },

  validateAdminLevel: function(requiredLevel) {
    return function(req, res, next) {
      // check admin level
      var userLevel = req.decoded._doc.adminLevel;
      if (userLevel >= requiredLevel) {
        next();
      } else {
        return res.status(401).send({ success: false, message: 'Invalid authorization' });
      }
    }
  }
}
