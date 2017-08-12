/**
 * File: simulations.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 26.07.2016
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

var auth = require('../auth');
var logger = require('../utils/logger');

// models
var Simulation = require('../models/simulation');
var User = require('../models/user');

// create router
var router = express.Router();

// all model routes need authentication
router.use('/simulations', auth.validateToken);

// routes
router.get('/simulations', /*auth.validateRole('simulation', 'read'),*/ function(req, res) {
  Simulation.find({ user: req.decoded._id }, function(err, simulations) {
    if (err) {
      logger.error('Unable to receive simulations', err);
      return res.status(400).send(err);
    }

    res.send({ simulations });
  });
});

router.post('/simulations', /*auth.validateRole('simulation', 'create'),*/ function(req, res) {
  // delete id if equals 'null'
  if (req.body.simulation._id === null) {
    delete req.body.simulation._id;
  }

  // create new simulation
  req.body.simulation.user = req.decoded._id;
  const simulation = new Simulation(req.body.simulation);

  simulation.save(function(err) {
    if (err) {
      logger.error('Unable to create simulation', err);
      return res.status(400).send(err);
    }

    // add simulation to user
    User.findOne({ _id: simulation.user }, function(err, user) {
      if (err) {
        logger.error('Unable to find user ' + simulation.user, err);
        return res.status(400).send(err);
      }

      user.simulations.push(simulation._id);

      user.save(function(err) {
        if (err) {
          logger.error('Unable to save user', err);
          return res.status(500).send(err);
        }

        // send response
        res.send({ simulation });
      });
    });
  });
});

router.put('/simulations/:id', /*auth.validateRole('simulation', 'update'),*/ function(req, res) {
  Simulation.findOne({ _id: req.params.id, user: req.decoded._id }, function(err, simulation) {
    if (err) {
      logger.log('verbose', 'PUT Unknown simulation for id: ' + req.params.id);
      return res.status(400).send(err);
    }

    // update relationships
    if (req.body.simulation.user && req.body.simulation.user !== simulation.user) {
      // remove from old user
      User.findOne({ _id: simulation.user }, function(err, user) {
        if (err) {
          logger.error('Unable to find user ' + simulation.user);
          return res.status(500).send(err);
        }

        // remove simulation from user
        user.simulations = user.simulations.filter(function(element) {
          return element._id !== simulation._id;
        });

        user.save(function(err) {
          if (err) {
            logger.error('Unable to save user ' + simulation.user, err);
            return res.status(500).send(err);
          }
        });
      });

      // add to new user
      User.findOne({ _id: req.body.simulation.user }, function(err, user) {
        if (err) {
          logger.verbose('PUT Simulation Unknown user for id: ' + req.body.simulation.user);
          return res.status(400).send(err);
        }

        user.simulations.push(simulation._id);

        user.save(function(err) {
          if (err) {
            logger.error('Unable to save user ' + req.body.simulation.user, err);
            return res.status(500).send(err);
          }
        });
      });
    }

    // update all properties
    for (property in req.body.simulation) {
      simulation[property] = req.body.simulation[property];
    }

    // save the changes
    simulation.save(function(err) {
      if (err) {
        logger.error('Unable to save simulation', simulation);
        return res.status(400).send(err);
      }

      res.send({ simulation });
    });
  });
});

router.get('/simulations/:id', /*auth.validateRole('simulation', 'read'),*/ function(req, res) {
  Simulation.findOne({ _id: req.params.id, user: req.decoded._id }, function(err, simulation) {
    if (err) {
      logger.log('verbose', 'GET Unknown simulation for id: ' + req.params.id);
      return res.send(err);
    }

    res.send({ simulation });
  });
});

router.delete('/simulations/:id', /*auth.validateRole('simulation', 'delete'),*/ function(req, res) {
  Simulation.findOne({ _id: req.params.id, user: req.decoded._id }, function(err, simulation) {
    if (err) {
      logger.log('verbose', 'DELETE Unknown simulation for id: ' + req.params.id);
      return res.status(400).send(err);
    }

    // remove from user's list
    User.findOne({ _id: simulation.user }, function(err, user) {
      if (err) {
        logger.error('Unable to find user ' + simulation.user, err);
        return res.status(500).send(err);
      }

      user.simulations = user.simulations.filter(function(element) {
        return element._id !== simulation._id;
      });

      user.save(function(err) {
        if (err) {
          logger.error('Unable to save user ' + simulation.user, err);
          return res.status(500).send(err);
        }

        // remove simulation itself
        simulation.remove(function(err) {
          if (err) {
            logger.error('Unable to remove simulation', simulation);
            return res.status(500).send(err);
          }

          res.send({});
        });
      });
    });
  });
});

module.exports = router;
