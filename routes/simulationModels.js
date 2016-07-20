/**
 * File: simulationModels.js
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
var SimulationModel = require('../models/simulationModel');
var User = require('../models/user');

// create router
var router = express.Router();

// all model routes need authentication
router.use('/simulationModels', auth.validateToken);

// routes
router.get('/simulationModels', function(req, res) {
  // get all models
  SimulationModel.find(function(err, models) {
    if (err) {
      return res.send(err);
    }

    res.send({ simulationModel: models });
  });
});

router.post('/simulationModels', function(req, res) {
  // create new model
  var model = new SimulationModel(req.body.simulationModel);

  model.save(function(err) {
    if (err) {
      return res.send(err);
    }

    res.send({ simulationModel: model });
  });

  // add model to user
  User.findOne({ _id: model.owner }, function(err, user) {
    if (err) {
      return console.log(err);
    }

    user.simulationModels.push(model._id);

    user.save(function(err) {
      if (err) {
        console.log(err);
      }
    });
  });
});

router.put('/simulationModels/:id', function(req, res) {
  // get model
  SimulationModel.findOne({ _id: req.params.id }, function(err, model) {
    if (err) {
      return res.send(err);
    }

    // update all properties
    for (property in req.body.simulationModel) {
      model[property] = req.body.simulationModel[property];
    }

    // save the changes
    model.save(function(err) {
      if (err) {
        return res.send(err);
      }

      res.send({ simulationModel: model });
    });
  });
});

router.get('/simulationModels/:id', function(req, res) {
  SimulationModel.findOne({ _id: req.params.id }, function(err, model) {
    if (err) {
      return res.send(err);
    }

    res.send({ simulationModel: model });
  });
});

router.delete('/simulationModels/:id', function(req, res) {
  SimulationModel.findOne({ _id: req.params.id }, function(err, model) {
    if (err) {
      return res.send(err);
    }

    // remove from owner's list
    User.findOne({ _id: model.owner }, function(err, user) {
      if (err) {
        return console.log(err);
      }

      for (var i = 0; user.simulationModels.length; i++) {
        var id = String(user.simulationModels[i]);
        if (id == model._id) {
          user.simulationModels.splice(i, 1);
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
