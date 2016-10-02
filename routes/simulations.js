/**
 * File: simulations.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 26.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

// include
var express = require('express');

var auth = require('../auth');

// models
var Simulation = require('../models/simulation');
var User = require('../models/user');

// create router
var router = express.Router();

// all model routes need authentication
router.use('/simulations', auth.validateToken);

// routes
router.get('/simulations', function(req, res) {
  // get all simulations
  Simulation.find(function(err, simulations) {
    if (err) {
      return res.send(err);
    }

    res.send({ simulations: simulations });
  });
});

router.post('/simulations', function(req, res) {
  // create new simulation
  var simulation = new Simulation(req.body.simulation);

  simulation.save(function(err) {
    if (err) {
      return res.status(400).send(err);
    }

    // add simulation to user
    User.findOne({ _id: simulation.owner }, function(err, user) {
      if (err) {
        return res.status(400).send(err);
      }

      user.simulations.push(simulation._id);

      user.save(function(err) {
        if (err) {
          res.status(500).send(err);
        }

        // send response
        res.send({ simulation: simulation });
      });
    });
  });
});

router.put('/simulations/:id', function(req, res) {
  // get simulation
  Simulation.findOne({ _id: req.params.id }, function(err, simulation) {
    if (err) {
      return res.status(400).send(err);
    }

    // update all properties
    for (property in req.body.simulation) {
      simulation[property] = req.body.simulation[property];
    }

    // save the changes
    simulation.save(function(err) {
      if (err) {
        return res.status(400).send(err);
      }

      res.send({ simulation: simulation });
    });
  });
});

router.get('/simulations/:id', function(req, res) {
  Simulation.findOne({ _id: req.params.id }, function(err, simulation) {
    if (err) {
      return res.send(err);
    }

    res.send({ simulation: simulation });
  });
});

router.delete('/simulations/:id', function(req, res) {
  Simulation.findOne({ _id: req.params.id }, function(err, simulation) {
    if (err) {
      return res.status(400).send(err);
    }

    // remove from owner's list
    User.findOne({ _id: simulation.owner }, function(err, user) {
      if (err) {
        return res.status(500).send(err);
      }

      for (var i = 0; user.simulations.length; i++) {
        var id = String(user.simulations[i]);
        if (id == simulation._id) {
          user.simulations.splice(i, 1);
        }
      }

      user.save(function(err) {
        if (err) {
          return res.status(500).send(err);
        }

        // remove simulation itself
        simulation.remove(function(err) {
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
