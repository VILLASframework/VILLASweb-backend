/**
 * File: simulators.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 28.09.2016
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
      logger.error('Unable to receive simulators', err);
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
      logger.error('Unable to create simulator', err);
      return res.status(400).send(err);
    }

    res.send({ simulator: simulator });
  });
});

router.put('/simulators/:id', /*auth.validateRole('simulator', 'update'),*/ function(req, res) {
  // get simulator
  Simulator.findOne({ _id: req.params.id }, function(err, simulator) {
    if (err) {
      logger.log('verbose', 'PUT Unknown simulator for id: ' + req.params.id);
      return res.status(400).send(err);
    }

    // update all properties
    for (property in req.body.simulator) {
      simulator[property] = req.body.simulator[property];
    }

    // save the changes
    simulator.save(function(err) {
      if (err) {
        logger.error('Unable to save simulator', simulator);
        return res.status(500).send(err);
      }

      res.send({ simulator: simulator });
    });
  });
});

router.get('/simulators/:id', /*auth.validateRole('simulator', 'read'),*/ function(req, res) {
  Simulator.findOne({ _id: req.params.id }, function(err, simulator) {
    if (err) {
      logger.log('verbose', 'GET Unknown simulator for id: ' + req.params.id);
      return res.status(400).send(err);
    }

    res.send({ simulator: simulator });
  });
});

router.delete('/simulators/:id', /*auth.validateRole('simulator', 'delete'),*/ function(req, res) {
  Simulator.findOne({ _id: req.params.id }, function(err, simulator) {
    if (err) {
      logger.log('verbose', 'DELETE Unknown simulator for id: ' + req.params.id);
      return res.status(400).send(err);
    }

    simulator.remove(function(err) {
      if (err) {
        logger.error('Unable to remove simulator', simulator);
        return res.status(500).send(err);
      }

      res.send({});
    });
  });
});

module.exports = router;
