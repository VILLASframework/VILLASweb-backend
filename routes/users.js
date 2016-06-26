// include
var express = require('express');

var User = require('../models/user');

// create router
var router = express.Router();

// routes
router.route('/users').get(function(req, res) {
  // get all users
  User.find(function(err, users) {
    if (err) {
      return res.send(err);
    }

    res.json(users);
  });
});

router.route('/users').post(function(req, res) {
  // create new user
  var user = new User(req.body);

  console.log(req.body);

  user.save(function(err) {
    if (err) {
      return res.send(err);
    }

    res.send({ success: true, message: 'User added' });
  });
});

router.route('/users/:id').put(function(req, res) {
  // get user
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) {
      return res.send(err);
    }

    // update all properties
    for (property in req.body) {
      user[property] = req.body[property];
    }

    // save the changes
    user.save(function(err) {
      if (err) {
        return res.send(err);
      }

      res.send({ success: true, message: 'User updated' });
    });
  });
});

router.route('/users/:id').get(function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) {
      return res.send(err);
    }

    res.send(user);
  });
});

router.route('/users/:id').delete(function(req, res) {
  User.remove({ _id: req.params.id }, function(req, res) {
    if (err) {
      return res.send(err);
    }

    res.send({ success: true, message: 'User deleted' });
  });
});

module.exports = router;
