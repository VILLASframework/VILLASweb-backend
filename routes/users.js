/**
 * File: users.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 26.06.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

// include
var express = require('express');
var jwt = require('jsonwebtoken');

var auth = require('../auth');
var config = require('../config');

// models
var User = require('../models/user');

// create router
var router = express.Router();

// all user routes need authentication
router.use('/users', auth.validateToken);

// routes
router.get('/users', auth.validateRole('user', 'read'), function(req, res) {
  // get all users
  User.find(function(err, users) {
    if (err) {
      return next(err);
    }

    res.json({ users: users });
  });
});

router.post('/users', auth.validateRole('user', 'create'), function(req, res) {
  // create new user
  var user = new User(req.body.user);

  user.save(function(err) {
    if (err) {
      return res.send(err);
    }

    res.send({ user: user });
  });
});

router.put('/users/:id', auth.validateRole('user', 'update'), function(req, res) {
  // get user
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) {
      return res.send(err);
    }

    if (user == null) {
      return res.status(404).send({});
    }

    // if user is not an admin, only allow some changes on own data

    // update all properties
    if (req.decoded._doc.adminLevel >= 1) {
      for (property in req.body.user) {
        user[property] = req.body.user[property];
      }
    } else if (req.decoded._doc._id === req.params.id) {
      // only copy the allowed properties since the user is not an admin
      for (property in req.body.user) {
        if (property === '_id' || property === 'adminLevel') {
          continue;
        }

        user[property] = req.body.user[property];
      }
    } else {
      return res.send({ success: false, message: 'Invalid authorization' });
    }

    // save the changes
    user.save(function(err) {
      if (err) {
        return res.send(err);
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
      return res.send(err);
    }

    res.send({ user: user });
  });
});

router.get('/users/:id', auth.validateRole('user', 'read'), function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) {
      return res.send(err);
    }

    res.send({ user: user });
  });
});

router.delete('/users/:id', auth.validateRole('user', 'delete'), function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) {
      return res.send(err);
    }

    user.remove(function(err) {
      if (err) {
        return res.send(err);
      }

      res.send({});
    });
  });
});

router.route('/authenticate').post(function(req, res) {
  // get the user by the name
  if (!req.body.username || !req.body.password) {
    return res.status(401).send({ success: false, message: 'Invalid credentials' });
  }

  User.findOne({ username: req.body.username }, function(err, user) {
    // handle errors and missing user
    if (err) {
      return res.send(err);
    }

    if (!user) {
      return res.status(401).send({ success: false, message: 'Invalid credentials' });
    }

    // validate password
    user.verifyPassword(req.body.password, function(err, isMatch) {
      if (err || !isMatch) {
        return res.status(401).send({ success: false, message: 'Invalid credentials' });
      }

      // create authentication token
      var token = jwt.sign(user, config.secret, {});

      return res.send({ success: true, message: 'Authenticated', token: token});
    });
  });
});

module.exports = router;
