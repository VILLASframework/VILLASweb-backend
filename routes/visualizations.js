/**
 * File: visualizations.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 28.06.2016
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
var Visualization = require('../models/visualization');
var Project = require('../models/project');

// create router
var router = express.Router();

// all visualization routes need authentication
router.use('/visualizations', auth.validateToken);

// routes
router.get('/visualizations', /*auth.validateRole('visualization', 'read'),*/ function(req, res) {
  // get all visualizations
  Visualization.find({ user: req.decoded._id }, function(err, visualizations) {
    if (err) {
      logger.error('Unable to receive visualizations', err);
      return res.status(500).send(err);
    }

    res.send({ visualizations });
  });
});

router.post('/visualizations', /*auth.validateRole('visualization', 'create'),*/ function(req, res) {
  // get project for visualization
  Project.findOne({ _id: req.body.visualization.project, user: req.decoded._id }, function(err, project) {
    if (err) {
      logger.log('verbose', 'Unable to find project ' + req.body.visualization.project, err);
      return res.status(400).send(err);
    }

    // create new visualization
    const visualization = new Visualization(req.body.visualization);
  
    visualization.save(function(err) {
      if (err) {
        logger.error('Unable to create visualization', err);
        return res.status(500).send(err);
      }

      project.visualizations.push(visualization._id);
      
      project.save(function(err) {
        if (err) {
          logger.error('Unable to save project ' + visualization.project, err);
          return res.status(500).send(err);
        }

        res.send({ visualization });
      });
    });
  });
});

router.put('/visualizations/:id', /*auth.validateRole('visualization', 'update'),*/ function(req, res) {
  // get visualization
  Visualization.findOne({ _id: req.params.id, user: req.decoded._id }, function(err, visualization) {
    if (err) {
      logger.log('verbose', 'PUT Unknown visualization for id: ' + req.params.id);
      return res.status(400).send(err);
    }

    // update all properties
    for (property in req.body.visualization) {
      visualization[property] = req.body.visualization[property];
    }

    // save the changes
    visualization.save(function(err) {
      if (err) {
        logger.error('Unable to save visualization ' + req.params.id, err);
        return res.status(500).send(err);
      }

      res.send({ visualization });
    });
  });
});

router.get('/visualizations/:id', /*auth.validateRole('visualization', 'read'),*/ function(req, res) {
  Visualization.findOne({ _id: req.params.id, user: req.decoded._id }, function(err, visualization) {
    if (err) {
      logger.log('verbose', 'GET Unknown visualization ' + req.params.id, err);
      return res.status(400).send(err);
    }

    res.send({ visualization });
  });
});

router.delete('/visualizations/:id', /*auth.validateRole('visualization', 'delete'),*/ function(req, res) {
  Visualization.findOne({ _id: req.params.id, user: req.decoded._id }, function(err, visualization) {
    if (err) {
      logger.log('verbose', 'DELETE Unknown visualization ' + req.params.id, err);
      return res.status(400).send(err);
    }

    // remove from project's list
    Project.findOne({ _id: visualization.project, user: req.decoded._id }, function(err, project) {
      if (err) {
        logger.log('verbose', 'Unable to find project ' + visualization.project, err);
        return res.status(400).send(err);
      }

      project.visualizations = project.visualizations.filter(function(element) {
        return element._id !== visualization._id;
      });

      project.save(function(err) {
        if (err) {
          logger.error('Unable to save project ' + visualization.project, err);
          return res.status(500).send(err);
        }

        visualization.remove(function(err) {
          if (err) {
            logger.error('Unable to remove visualization ' + req.params.id, err);
            return res.status(500).send(err);
          }
    
          res.send({});
        });
      });
    });
  });
});

module.exports = router;
