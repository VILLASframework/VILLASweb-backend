// include
var express = require('express');
var jwt = require('jsonwebtoken');

var User = require('../models/user');
var auth = require('../auth');
var config = require('../config');

// create router
var router = express.Router();

// all user routes need authentication
router.use('/users', auth.validateToken);

// routes
router.route('/users').get(auth.validateAdminLevel(1), function(req, res) {
  // get all users
  User.find(function(err, users) {
    if (err) {
      return res.send(err);
    }

    res.json({ users: users });
  });
});

router.route('/users').post(function(req, res) {
  // create new user
  var user = new User(req.body);

  user.save(function(err) {
    if (err) {
      return res.send(err);
    }

    res.send({ user: user });
  });
});

router.route('/users/:id').put(auth.validateAdminLevel(1), function(req, res) {
  // get user
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) {
      return res.send(err);
    }

    // update all properties
    for (property in req.body.user) {
      user[property] = req.body.user[property];
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

router.route('/users/me').get(function(req, res) {
  // get the logged-in user ID
  var userId = req.decoded._doc._id;

  User.findOne({ _id: userId }, function(err, user) {
    if (err) {
      return res.send(err);
    }

    res.send({ user: user });
  });
});

router.route('/users/:id').get(auth.validateAdminLevel(1), function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) {
      return res.send(err);
    }

    res.send({ user: user });
  });
});

router.route('/users/:id').delete(auth.validateAdminLevel(1), function(req, res) {
  User.remove({ _id: req.params.id }, function(err) {
    if (err) {
      return res.send(err);
    }

    res.send({ success: true, message: 'User deleted' });
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
