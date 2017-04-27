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

//var auth = require('../auth');

// models
var Simulation = require('../models/simulation');
var User = require('../models/user');

// create router
var router = express.Router();

// all model routes need authentication
//router.use('/simulations', auth.validateToken);

// routes
router.get('/simulations', /*auth.validateRole('simulation', 'read'),*/ function(req, res) {
  Simulation.find(function(err, simulations) {
    if (err) {
      return res.send(err);
    }

    res.send({ simulations: simulations });
  });
});

router.post('/simulations', /*auth.validateRole('simulation', 'create'), auth.validateOwner('simulation'),*/ function(req, res) {
  // create new simulation
  var simulation = new Simulation(req.body.simulation);

  simulation.save(function(err) {
    if (err) {
      return res.status(400).send(err);
    }

    // add simulation to user
    /*User.findOne({ _id: simulation.owner }, function(err, user) {
      if (err) {
        return res.status(400).send(err);
      }

      user.simulations.push(simulation._id);

      user.save(function(err) {
        if (err) {
          res.status(500).send(err);
        }

        // send response*/
        res.send({ simulation: simulation });
      /*});
    });*/
  });
});

router.put('/simulations/:id', /*auth.validateRole('simulation', 'update'),*/ function(req, res) {
  // get simulation
  Simulation.findOne({ _id: req.params.id }, function(err, simulation) {
    if (err) {
      return res.status(400).send(err);
    }

    /*// validate owner
    if (simulation.owner != req.decoded._doc._id) {
      return res.status(403).send({ success: false, message: 'User is not owner' });
    }*/

    // update relationships
    /*if (req.body.simulation.owner && req.body.simulation.owner !== simulation.owner) {
      // remove from old user
      User.findOne({ _id: simulation.owner }, function(err, user) {
        if (err) {
          return console.log(err);
        }

        for (var i = 0; i < user.simulations; i++) {
          if (user.simulations[i] === simulation._id) {
            user.simulations.splice(i, 1);
          }
        }

        user.save(function(err) {
          if (err) {
            return console.log(err);
          }
        });
      });

      // add to new user
      User.findOne({ _id: req.body.simulation.owner }, function(err, user) {
        if (err) {
          return console.log(err);
        }

        user.simulations.push(simulation._id);

        user.save(function(err) {
          if (err) {
            return console.log(err);
          }
        });
      });
    }*/

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

router.get('/simulations/:id', /*auth.validateRole('simulation', 'read'),*/ function(req, res) {
  Simulation.findOne({ _id: req.params.id }, function(err, simulation) {
    if (err) {
      return res.send(err);
    }

    // validate owner
    /*if (simulation.owner == req.decoded._doc._id) {
      */res.send({ simulation: simulation });/*
    } else {
      res.status(403).send({ success: false, message: 'User is not owner' });
    }*/
  });
});

router.delete('/simulations/:id', /*auth.validateRole('simulation', 'delete'),*/ function(req, res) {
  Simulation.findOne({ _id: req.params.id }, function(err, simulation) {
    if (err) {
      return res.status(400).send(err);
    }

    // validate owner
    /*if (simulation.owner != req.decoded._doc._id) {
      return res.status(403).send({ success: false, message: 'User is not owner' });
    }*/

    // remove from owner's list
    /*User.findOne({ _id: simulation.owner }, function(err, user) {
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
        }*/

        // remove simulation itself
        simulation.remove(function(err) {
          if (err) {
            return res.status(500).send(err);
          }

          res.send({});
        });
      /*});
    });*/
  });
});

module.exports = router;
