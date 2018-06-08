/**
 * File: counts.js
 * Author: Steffen Vogel <stvogel@eonerc.rwth-aachen.de>
 * Date: 20.09.2017
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

// models
var Simulator = require('../models/simulator');
var Simulation = require('../models/simulation');
var Project = require('../models/project');
var Visualization = require('../models/visualization');
var User = require('../models/user');

// create router
var router = express.Router();

// routes
router.get('/counts', function(req, res) {

  var queries = [
    Simulation.count().exec(),
    User.count().exec(),
    Simulator.count().exec(),
    Project.count().exec(),
    Visualization.count().exec(),
  ]

  Promise.all(queries).then(function(counts) {
    res.send({
      simulations: counts[0],
      users: counts[1],
      simulators: counts[2],
      projects: counts[3],
      visualizations: counts[4],
    });
  });
});

module.exports = router;
