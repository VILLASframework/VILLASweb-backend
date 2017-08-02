/**
 * File: users.js
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
var express = require('express');
var jwt = require('jsonwebtoken');

var auth = require('../auth');
var config = require('../config')[process.env.NODE_ENV || 'development'];
var logger = require('../utils/logger');

// models
var User = require('../models/user');

// create router
var router = express.Router();

// all user routes need authentication
router.use('/users', auth.validateToken);

// routes
router.get('/users', auth.validateRole('user', 'read'), function(req, res) {
  // get all users
  User.find({}, 'username role mail', function(err, users) {
    if (err) {
      logger.error('Unable to receive users', err);
      return next(err);
    }

    res.json({ users: users });
  });
});

router.post('/users', auth.validateRole('user', 'create'), function(req, res) {
  // create new user, only if username hasn't been taken

  User.findOne({ username: req.body.user.username }, function(err, foundUser) {
    if (err) {
      logger.error('Unable to create user', err);
      return res.send(err);
    }

    // If query was successful, the username has already been taken
    if (foundUser) {
      // Send a Bad Request response code
      logger.log('verbose', 'Unable to create user with existing username: ' + req.body.user.username);
      return res.status(400).send({ success: false, message: 'Username is already taken' });
    }

    var user = new User(req.body.user);

    user.save(function(err) {
      if (err) {
        logger.error('Unable to create user', { err, user });
        return res.send(err);
      }

      res.send({ user: user });
    });
  });

});

router.put('/users/:id', auth.validateRole('user', 'update'), function(req, res) {
  // get user
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) {
      logger.log('verbose', 'PUT Unknown user for id: ' + req.params.id);
      return res.send(err);
    }

    if (user == null) {
      logger.log('verbose', 'Unable to find user for id: ' + req.params.id);
      return res.status(404).send({});
    }

    // if user is not an admin, only allow some changes on own data
    // update all properties
    if (req.decoded._doc.role === 'admin') {
      for (property in req.body.user) {
        user[property] = req.body.user[property];
      }
    } else if (req.decoded._doc._id === req.params.id) {
      // only copy the allowed properties since the user is not an admin
      for (property in req.body.user) {
        if (property === '_id') {
          continue;
        }

        user[property] = req.body.user[property];
      }
    } else {
      logger.log('verbose', 'Missing authorization for user change (id): ' + req.decoded._doc._id, user);
      return res.status(403).send({ success: false, message: 'Invalid authorization' });
    }

    // save the changes
    user.save(function(err) {
      if (err) {
        // catch 'duplicate' errors, send a Bad Request response code
        // Message is only valid as long as Username is the only unique field
        logger.error('Unable to save user', user);
        return err.code === 11000? res.status(400).send({ success: false, message: 'Username is already taken' }) : res.send(err)
      }

      res.send({ user: user });
    });
  });
});

// This route needs no role validation, since it just requests the current user
router.get('/users/me', function(req, res) {
  // get the logged-in user ID
  var userId = req.decoded._doc._id;

  User.findOne({ _id: userId }, function(err, user) {
    if (err) {
      logger.log('verbose', 'GET Unknown user for id: ' + req.decoded._doc._id);
      return res.send(err);
    }

    res.send({ user: user });
  });
});

router.get('/users/:id', auth.validateRole('user', 'read'), function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) {
      logger.log('verbose', 'GET Unknown user for id: ' + req.decoded._doc._id);
      return res.send(err);
    }

    res.send({ user: user });
  });
});

router.delete('/users/:id', auth.validateRole('user', 'delete'), function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) {
      logger.log('verbose', 'DELETE Unknown user for id: ' + req.params.id);
      return res.send(err);
    }

    user.remove(function(err) {
      if (err) {
        logger.error('Unable to remove user', user);
        return res.send(err);
      }

      res.send({});
    });
  });
});

router.route('/authenticate').post(function(req, res) {
  // get the user by the name
  if (!req.body.username || !req.body.password) {
    logger.log('verbose', 'Missing credentials', req.body);
    return res.status(401).send({ success: false, message: 'Invalid credentials' });
  }

  User.findOne({ username: req.body.username }, 'password', function(err, user) {
    // handle errors and missing user
    if (err) {
      logger.log('verbose', 'Unknown user for username: ' + req.body.username);
      return res.send(err);
    }

    if (!user) {
      logger.log('verbose', 'Unknown user for username: ' + req.body.username);
      return res.status(401).send({ success: false, message: 'Invalid credentials' });
    }

    // validate password
    user.verifyPassword(req.body.password, function(err, isMatch) {
      if (err) {
        logger.error('Unable to compare passwords:', err);
        return res.status(500).send({ success: false, message: 'Internal server error' });
      } else if (!isMatch) {
        logger.log('verbose', 'Invalid credentials:', req.body);
        return res.status(401).send({ success: false, message: 'Invalid credentials' });
      }

      // create authentication token
      const token = jwt.sign(user, config.secret, {});

      return res.send({ success: true, message: 'Authenticated', token: token});
    });
  });
});

module.exports = router;
