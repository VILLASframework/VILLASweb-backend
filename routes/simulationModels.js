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
var Simulation = require('../models/simulation');

// create router
var router = express.Router();

// all model routes need authentication
router.use('/simulationModels', auth.validateToken);

// routes
router.get('/simulationModels', auth.validateRole('simulationModel', 'read'), function(req, res) {
  // get all user simulations
  SimulationModel.find(function(err, models) {
    if (err) {
      return res.status(400).send(err);
    }

    res.send({ simulationModel: models });
  });
});

router.post('/simulationModels', auth.validateRole('simulationModel', 'create'), function(req, res) {
  // create new model
  var model = new SimulationModel(req.body.simulationModel);

  model.save(function(err) {
    if (err) {
      return res.status(400).send(err);
    }

    // add model to simulation
    Simulation.findOne({ _id: model.simulation }, function(err, simulation) {
      if (err) {
        return res.status(500).send(err);
      }

      simulation.models.push(model._id);

      simulation.save(function(err) {
        if (err) {
          return res.status(500).send(err);
        }

        res.send({ simulationModel: model });
      });
    });
  });
});

router.put('/simulationModels/:id', auth.validateRole('simulationModel', 'update'), function(req, res) {
  // get model
  SimulationModel.findOne({ _id: req.params.id }, function(err, model) {
    if (err) {
      return res.status(400).send(err);
    }

    // update all properties
    for (property in req.body.simulationModel) {
      model[property] = req.body.simulationModel[property];
    }

    // save the changes
    model.save(function(err) {
      if (err) {
        return res.status(500).send(err);
      }

      res.send({ simulationModel: model });
    });
  });
});

router.get('/simulationModels/:id', auth.validateRole('simulationModel', 'read'), function(req, res) {
  SimulationModel.findOne({ _id: req.params.id }, function(err, model) {
    if (err) {
      return res.status(400).send(err);
    }

    res.send({ simulationModel: model });
  });
});

router.delete('/simulationModels/:id', auth.validateRole('simulationModel', 'delete'), function(req, res) {
  SimulationModel.findOne({ _id: req.params.id }, function(err, model) {
    if (err) {
      return res.status(400).send(err);
    }

    // remove from simulation's list
    Simulation.findOne({ _id: model.simulation }, function(err, simulation) {
      if (err) {
        return res.status(500).send(err);
      }

      for (var i = 0; simulation.models.length; i++) {
        var id = String(simulation.models[i]);
        if (id == model._id) {
          simulation.models.splice(i, 1);
        }
      }

      simulation.save(function(err) {
        if (err) {
          return res.status(500).send(err);
        }

        model.remove(function(err) {
          if (err) {
            return res.status(500).send(err);
          }

          res.send({});
        });
      });
    });
  });
});

module.exports = router;
