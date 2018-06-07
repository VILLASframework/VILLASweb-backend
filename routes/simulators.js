/**
 * File: simulators.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 03.03.2018
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
const express = require('express');

const auth = require('../auth');
const logger = require('../utils/logger');
const amqpClient = require('../broker/client');

// models
const Simulator = require('../models/simulator');

// create router
const router = express.Router();

// all simulator routes need authentication
router.use('/simulators', auth.validateToken);

// routes
router.get('/simulators', (req, res) => {
  Simulator.find((err, simulators) => {
    if (err) {
      logger.error('Unable to find simulators', err);
      return res.status(400).send(err);
    }

    res.send({ simulators });
  });
});

router.post('/simulators', (req, res) => {
  if (req.body.simulator._id == null) {
    delete req.body.simulator._id;
  }

  const simulator = new Simulator(req.body.simulator);

  // save simulator
  simulator.save((err) => {
    if (err) {
      logger.error('Unable to create simulator', err);
      return res.status(500).send(err);
    }

    res.send({ simulator });
  });
});

router.put('/simulators/:id', (req, res) => {
  Simulator.findById(req.params.id, (err, simulator) => {
    if (err) {
      logger.error('PUT Error finding simulator ' + req.params.id + ': ' + err);
      return res.status(500).send(err);
    }

    if (simulator == null) {
      logger.log('verbose', 'PUT Unknown simulator for id: ' + req.params.id);
      return res.status(400).send(err);
    }

    // update properties
    simulator.properties = req.body.simulator.properties;

    // save changes
    simulator.save(err => {
      if (err) {
        logger.error('Unable to save simulator', simulator);
        return res.status(500).send(err);
      }

      res.send({ simulator });
    });
  });
});

router.get('/simulators/:id', (req, res) => {
  Simulator.findById(req.params.id, (err, simulator) => {
    if (err) {
      logger.log('verbose', 'GET Unknown simulator for id: ' + req.params.id + ': ' + err);
      return res.status(400).send(err);
    }

    res.send({ simulator });
  });
});

router.delete('/simulators/:id', (req, res) => {
  Simulator.findById(req.params.id, (err, simulator) => {
    if (err) {
      logger.log('verbose', 'DELETE Unknown simulator for id: ' + req.params.id);
      return res.status(400).send(err);
    }

    simulator.remove((err) => {
      if (err) {
        logger.error('Unable to remove simulator', project);
        return res.status(500).send(err);
      }

      res.send({});
    });
  });
});

router.post('/simulators/:id', (req, res) => {
  Simulator.findById(req.params.id, (err, simulator) => {
    if (err) {
      logger.log('verbose', 'POST Unknown simulator for id: ' + req.params.id);
      return res.status(400).send(err);
    }

    const when = req.body.when || Date.now() / 1000.0;

    switch (req.body.action) {
      case 'reset':
        amqpClient.resetSimulator(simulator.uuid, when);
        break;

      case 'shutdown':
        amqpClient.shutdownSimulator(simulator.uuid, when);
        break;

      case 'start':
        amqpClient.startSimulator(simulator.uuid, when, req.body.parameters);
        break;

      case 'stop':
        amqpClient.stopSimulator(simulator.uuid, when);
        break;

      case 'pause':
        amqpClient.pauseSimulator(simulator.uuid, when);
        break;

      case 'resume':
        amqpClient.resumeSimulator(simulator.uuid, when);
        break;

      default:
        logger.log('verbose', 'POST Unknown action ' + req.body.action);
    }

    res.send({});
  });
});

module.exports = router;
