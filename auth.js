/**
 * File: auth.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 26.06.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

// include
var jwt = require('jsonwebtoken');

var config = require('./config');
var roles = require('./roles');

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

  validateRole: function(resource, action) {
    return function(req, res, next) {
      // get user role
      var role = roles[req.decoded._doc.role];
      if (role.resource[resource].indexOf(action) > -1) {
        // item found in list
        next();
      } else {
        // item not found
        return res.status(403).send({ success: false, message: 'Action not permitted' });
      }
    }
  }
}
