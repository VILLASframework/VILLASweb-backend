/**
 * File: simulationModels.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 19.07.2016
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

//var auth = require('../auth');
var logger = require('../utils/logger');

// models
var SimulationModel = require('../models/simulationModel');
var Simulation = require('../models/simulation');

// create router
var router = express.Router();

// all model routes need authentication
//router.use('/simulationModels', auth.validateToken);

// routes
router.get('/simulationModels', /*auth.validateRole('simulationModel', 'read'),*/ function(req, res) {
  // get all user simulations
  SimulationModel.find(function(err, models) {
    if (err) {
      logger.error('Unable to receive simulation models', err);
      return res.status(400).send(err);
    }

    res.send({ simulationModel: models });
  });
});

router.post('/simulationModels', /*auth.validateRole('simulationModel', 'create'),*/ function(req, res) {
  // create new model
  var model = new SimulationModel(req.body.simulationModel);

  model.save(function(err) {
    if (err) {
      logger.error('Unable to create simulation model', err);
      return res.status(400).send(err);
    }

    // add model to simulation
    Simulation.findOne({ _id: model.simulation }, function(err, simulation) {
      if (err) {
        logger.verbose('Unable to find simulation for id: ' + model.simulation);
        return res.status(500).send(err);
      }

      simulation.models.push(model._id);

      simulation.save(function(err) {
        if (err) {
          logger.error('Unable to save simulation', simulation);
          return res.status(500).send(err);
        }

        res.send({ simulationModel: model });
      });
    });
  });
});

router.put('/simulationModels/:id', /*auth.validateRole('simulationModel', 'update'),*/ function(req, res) {
  // get model
  SimulationModel.findOne({ _id: req.params.id }, function(err, model) {
    if (err) {
      logger.log('verbose', 'PUT Unknown simulation model for id: ' + req.params.id);
      return res.status(400).send(err);
    }

    // update all properties
    for (property in req.body.simulationModel) {
      model[property] = req.body.simulationModel[property];
    }

    // save the changes
    model.save(function(err) {
      if (err) {
        logger.error('Unable to save simulation model', model);
        return res.status(500).send(err);
      }

      res.send({ simulationModel: model });
    });
  });
});

router.get('/simulationModels/:id', /*auth.validateRole('simulationModel', 'read'),*/ function(req, res) {
  SimulationModel.findOne({ _id: req.params.id }, function(err, model) {
    if (err) {
      logger.log('verbose', 'GET Unknown project for id: ' + req.params.id);
      return res.status(400).send(err);
    }

    res.send({ simulationModel: model });
  });
});

router.delete('/simulationModels/:id', /*auth.validateRole('simulationModel', 'delete'),*/ function(req, res) {
  SimulationModel.findOne({ _id: req.params.id }, function(err, model) {
    if (err) {
      logger.log('verbose', 'DELETE Unknown simulation model for id: ' + req.params.id);
      return res.status(400).send(err);
    }

    // remove from simulation's list
    Simulation.findOne({ _id: model.simulation }, function(err, simulation) {
      if (err) {
        logger.log('verbose', 'Unable to find simulation for id: ' + model.simulation);
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
          logger.error('Unable to save simulation', simulation);
          return res.status(500).send(err);
        }

        model.remove(function(err) {
          if (err) {
            logger.error('Unable to remove simulation model', model);
            return res.status(500).send(err);
          }

          res.send({});
        });
      });
    });
  });
});

module.exports = router;
