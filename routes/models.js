/**
 * File: models.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 19.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

// include
var express = require('express');

var auth = require('../auth');

// models
var Model = require('../models/model');

// create router
var router = express.Router();

// all model routes need authentication
router.use('/models', auth.validateToken);

// routes
router.get('/models', function(req, res) {
  // get all models
  Model.find(function(err, models) {
    if (err) {
      return res.send(err);
    }

    res.send({ models: models });
  });
});

router.post('/models', function(req, res) {
  // create new model
  var model = new Model(req.body.model);

  model.save(function(err) {
    if (err) {
      return res.send(err);
    }

    res.send({ model: model });
  });

  // add model to user
  Model.findOne({ _id: model.owner }, function(err, user) {
    if (err) {
      return console.log(err);
    }

    user.models.push(model._id);

    user.save(function(err) {
      if (err) {
        console.log(err);
      }
    });
  });
});

router.put('/models/:id', function(req, res) {
  // get model
  Model.findOne({ _id: req.params.id }, function(err, model) {
    if (err) {
      return res.send(err);
    }

    // update all properties
    for (property in req.body.model) {
      model[property] = req.body.model[property];
    }

    // save the changes
    model.save(function(err) {
      if (err) {
        return res.send(err);
      }

      res.send({ model: model });
    });
  });
});

router.get('/models/:id', function(req, res) {
  Model.findOne({ _id: req.params.id }, function(err, model) {
    if (err) {
      return res.send(err);
    }

    res.send({ model: model });
  });
});

router.delete('/models/:id', function(req, res) {
  Model.findOne({ _id: req.params.id }, function(err, model) {
    if (err) {
      return res.send(err);
    }

    // remove from owner's list
    User.findOne({ _id: model.owner }, function(err, user) {
      if (err) {
        return console.log(err);
      }

      for (var i = 0; user.models.length; i++) {
        var id = String(user.models[i]);
        if (id == model._id) {
          user.models.splice(i, 1);
        }
      }

      user.save(function(err) {
        if (err) {
          return console.log(err);
        }
      });
    });

    model.remove(function(err) {
      if (err) {
        return res.send(err);
      }

      res.send({});
    });
  });
});

module.exports = router;
