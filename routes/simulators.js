/**
 * File: simulators.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 28.09.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

// include
var express = require('express');

//var auth = require('../auth');

// models
var Simulator = require('../models/simulator');

// create router
var router = express.Router();

// all model routes need authentication
//router.use('/simulators', auth.validateToken);

// routes
router.get('/simulators', /*auth.validateRole('simulator', 'read'),*/ function(req, res) {
  // get all simulators
  Simulator.find(function(err, simulators) {
    if (err) {
      return res.status(400).send(err);
    }

    res.send({ simulators: simulators });
  });
});

router.post('/simulators', /*auth.validateRole('simulator', 'create'),*/ function(req, res) {
  // create new simulator
  var simulator = new Simulator(req.body.simulator);

  simulator.save(function(err) {
    if (err) {
      return res.status(400).send(err);
    }

    res.send({ simulator: simulator });
  });
});

router.put('/simulators/:id', /*auth.validateRole('simulator', 'update'),*/ function(req, res) {
  // get simulator
  Simulator.findOne({ _id: req.params.id }, function(err, simulator) {
    if (err) {
      return res.status(400).send(err);
    }

    // update all properties
    for (property in req.body.simulator) {
      simulator[property] = req.body.simulator[property];
    }

    // save the changes
    simulator.save(function(err) {
      if (err) {
        return res.status(500).send(err);
      }

      res.send({ simulator: simulator });
    });
  });
});

router.get('/simulators/:id', /*auth.validateRole('simulator', 'read'),*/ function(req, res) {
  Simulator.findOne({ _id: req.params.id }, function(err, simulator) {
    if (err) {
      return res.status(400).send(err);
    }

    res.send({ simulator: simulator });
  });
});

router.delete('/simulators/:id', /*auth.validateRole('simulator', 'delete'),*/ function(req, res) {
  Simulator.findOne({ _id: req.params.id }, function(err, simulator) {
    if (err) {
      return res.status(400).send(err);
    }

    simulator.remove(function(err) {
      if (err) {
        return res.status(500).send(err);
      }

      res.send({});
    });
  });
});

module.exports = router;
