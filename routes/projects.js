/**
 * File: projects.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 26.06.2016
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
var Project = require('../models/project');
var User = require('../models/user');
var Simulation = require('../models/simulation');

// create router
var router = express.Router();

// all project routes need authentication
router.use('/projects', auth.validateToken);

// routes
router.get('/projects', /*auth.validateRole('project', 'read'),*/ function(req, res) {
  // get all projects
  Project.find({ }, function(err, projects) {
    if (err) {
      logger.error('Unable to receive projects', err);
      return res.status(400).send(err);
    }

    res.send({ projects });
  });
});

router.post('/projects', /*auth.validateRole('project', 'create'),*/ function(req, res) {
  // delete id if equals 'null'
  if (req.body.project._id === null) {
    delete req.body.project._id;
  }

  // create new project
  req.body.project.user = req.decoded._id;
  const project = new Project(req.body.project);

  // save project
  project.save(function(err) {
    if (err) {
      logger.error('Unable to create project', err);
      return res.status(500).send(err);
    }

    // add project to user
    User.findOne({ _id: project.user }, function(err, user) {
      if (err) {
        logger.error('Unable to find user ' + project.user, err);
        return res.status(400).send(err);
      }

      user.projects.push(project._id);

      user.save(function(err) {
        if (err) {
          logger.error('Unable to save user ' + project.user, err);
          return res.status(500).send(err);
        }

        // add project to simulation
        Simulation.findOne({ _id: project.simulation }, function(err, simulation) {
          if (err) {
            logger.log('verbose', 'Unknown simulation for id: ' + project.simulation, { err, project });
            return res.status(400).send(err);
          }

          simulation.projects.push(project._id);

          simulation.save(function(err) {
            if (err) {
              logger.error('Unable to save simulation', { err, simulation });
              return res.status(500).send(err);
            }

            res.send({ project });
          });
        });
      });
    });
  });
});

router.put('/projects/:id', /*auth.validateRole('project', 'update'),*/ function(req, res) {
  // get project
  Project.findOne({ _id: req.params.id }, function(err, project) {
    if (err) {
      logger.log('verbose', 'PUT Unknown project for id: ' + req.params.id);
      return res.status(400).send(err);
    }

    // update relationships
    if (req.body.project.user && req.body.project.user !== project.user) {
      // remove from old user
      User.findOne({ _id: project.user }, function(err, user) {
        if (err) {
          logger.error('Unable to find user ' + project.user, err);
          return res.status(500).send(err);
        }

        user.projects = user.projects.filter(function(element) {
          return element._id !== project._id;
        });

        user.save(function(err) {
          if (err) {
            logger.error('Unable to save user ' + project.user, err);
            return res.status(500).send(err);
          }
        });
      });

      // add to new user
      User.findOne({ _id: req.body.project.user }, function(err, user) {
        if (err) {
          logger.error('Unable to find user ' + req.body.project.user, err);
          return res.status(500).send(err);
        }

        user.projects.push(project._id);

        user.save(function(err) {
          if (err) {
            logger.error('Unable to save user ' + req.body.project.user, err);
            return res.status(500).send(err);
          }
        });
      });
    }

    if (req.body.project.simulation && req.body.project.simulation !== project.simulation) {
      // remove from old simulation
      Simulation.findOne({ _id: project.simulation }, function(err, simulation) {
        if (err) {
          logger.error('Unable to find simulation ' + project.simulation);
          return res.status(500).send(err);
        }

        simulation.projects = simulation.projects.filter(function(element) {
          return element._id !== project._id;
        });

        simulation.save(function(err) {
          if (err) {
            logger.error('Unable to save simulation ' + project.simulation, err);
            return res.status(500).send(err);
          }
        });
      });

      // add to new simulation
      Simulation.findOne({ _id: req.body.project.simulation }, function(err, simulation) {
        if (err) {
          logger.error('Unable to find simulation ' + req.body.project.simulation, err);
          return res.status(500).send(err);
        }

        simulation.projects.push(project._id);

        simulation.save(function(err) {
          if (err) {
            logger.error('Unable to save simulation ', req.body.project.simulation);
            return res.status(500).send(err);
          }
        });
      });
    }

    // update all properties
    for (property in req.body.project) {
      project[property] = req.body.project[property];
    }

    // save the changes
    project.save(function(err) {
      if (err) {
        logger.error('Unable to save project', project);
        return res.status(500).send(err);
      }

      res.send({ project });
    });
  });
});

router.get('/projects/:id', /*auth.validateRole('project', 'read'),*/ function(req, res) {
  Project.findOne({ _id: req.params.id }, function(err, project) {
    if (err) {
      logger.log('verbose', 'GET Unknown project for id: ' + req.params.id);
      return res.status(400).send(err);
    }

    res.send({ project: project });
  });
});

router.delete('/projects/:id', /*auth.validateRole('project', 'delete'),*/ function(req, res) {
  Project.findOne({ _id: req.params.id }, function(err, project) {
    if (err) {
      logger.log('verbose', 'DELETE Unknown project for id: ' + req.params.id);
      return res.status(400).send(err);
    }

    // remove from user's list
    User.findOne({ _id: project.user }, function(err, user) {
      if (err) {
        logger.error('Unable to find user ' + project.user, err);
        return res.status(500).send(err);
      }

      user.projects = user.projects.filter(function(element) {
        return element._id !== project._id;
      });

      user.save(function(err) {
        if (err) {
          logger.error('Unable to save user ' + project.user, err);
          return res.status(500).send(err);
        }

        // remove the project
        project.remove(function(err) {
          if (err) {
            logger.error('Unable to remove project', project);
            return res.status(500).send(err);
          }

          res.send({});
        });
      });
    });
  });
});

module.exports = router;
