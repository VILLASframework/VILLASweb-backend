/**
 * File: auth.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 26.06.2016
 *
 * This file is part of VILLASweb-backend.
 *
 * VILLASweb-backend is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * VILLASweb-backend is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with VILLASweb-backend. If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/

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
      if (!req.decoded) {
        // no logged in user
        return res.status(403).send({ success: false, message: 'Authentication missing' });
      }

      var role = roles[req.decoded._doc.role];
      if (role.resource[resource].indexOf(action) > -1) {
        // item found in list
        next();
      } else {
        // item not found
        return res.status(403).send({ success: false, message: 'Action not permitted' });
      }
    };
  },

  validateOwner: function(model) {
    return function(req, res, next) {
      // get owner id from request
      var owner = req.body[model].owner;
      var userId = req.decoded._doc._id;

      if (owner === userId) {
        // owner is logged in user
        next();
      } else {
        // owner is not user
        return res.status(403).send({ success: false, message: 'User is not owner' });
      }
    };
  }
}
