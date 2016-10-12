/**
 * File: projects.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 26.06.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

// include
var express = require('express');

var auth = require('../auth');

// models
var Project = require('../models/project');
var User = require('../models/user');
var Simulation = require('../models/simulation');

// create router
var router = express.Router();

// all project routes need authentication
router.use('/projects', auth.validateToken);

// routes
router.get('/projects', function(req, res) {
  // get all projects
  Project.find(function(err, projects) {
    if (err) {
      return res.status(400).send(err);
    }

    res.send({ projects: projects });
  });
});

router.post('/projects', function(req, res) {
  // create new project
  var project = new Project(req.body.project);

  // save project
  project.save(function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    // add project to user
    User.findOne({ _id: project.owner }, function(err, user) {
      if (err) {
        return res.status(400).send(err);
      }

      user.projects.push(project._id);

      user.save(function(err) {
        if (err) {
          return res.status(500).send(err);
        }

        // add project to simulation
        Simulation.findOne({ _id: project.simulation }, function(err, simulation) {
          if (err) {
            return res.status(400).send(err);
          }

          simulation.projects.push(project._id);

          simulation.save(function(err) {
            if (err) {
              return res.status(500).send(err);
            }

            res.send({ project: project });
          });
        });
      });
    });
  });
});

router.put('/projects/:id', function(req, res) {
  // get project
  Project.findOne({ _id: req.params.id }, function(err, project) {
    if (err) {
      return res.status(400).send(err);
    }

    // update relationships
    if (req.body.project.owner && req.body.project.owner !== project.owner) {
      // remove from old user
      User.findOne({ _id: project.owner }, function(err, user) {
        if (err) {
          return console.log(err);
        }

        for (var i = 0; i < user.projects; i++) {
          if (user.projects[i] === project._id) {
            user.projects.splice(i, 1);
          }
        }

        user.save(function(err) {
          if (err) {
            return console.log(err);
          }
        });
      });

      // add to new user
      User.findOne({ _id: req.body.project.owner }, function(err, user) {
        if (err) {
          return console.log(err);
        }

        user.projects.push(project._id);

        user.save(function(err) {
          if (err) {
            return console.log(err);
          }
        });
      });
    }

    if (req.body.project.simulation && req.body.project.simulation !== project.simulation) {
      // remove from old simulation
      Simulation.findOne({ _id: project.simulation }, function(err, simulation) {
        if (err) {
          return console.log(err);
        }

        for (var i = 0; i < simulation.projects; i++) {
          if (simulation.projects[i] === project._id) {
            simulation.projects.splice(i, 1);
          }
        }

        simulation.save(function(err) {
          if (err) {
            return console.log(err);
          }
        });
      });

      // add to new user
      Simulation.findOne({ _id: req.body.project.simulation }, function(err, simulation) {
        if (err) {
          return console.log(err);
        }

        simulation.projects.push(project._id);

        simulation.save(function(err) {
          if (err) {
            return console.log(err);
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
        return res.status(500).send(err);
      }

      res.send({ project: project });
    });
  });
});

router.get('/projects/:id', function(req, res) {
  Project.findOne({ _id: req.params.id }, function(err, project) {
    if (err) {
      return res.status(400).send(err);
    }

    res.send({ project: project });
  });
});

router.delete('/projects/:id', function(req, res) {
  Project.findOne({ _id: req.params.id }, function(err, project) {
    if (err) {
      return res.status(400).send(err);
    }

    // remove from owner's list
    User.findOne({ _id: project.owner }, function(err, user) {
      if (err) {
        return res.status(400).send(err);
      }

      for (var i = 0; user.projects.length; i++) {
        var id = String(user.projects[i]);
        if (id == project._id) {
          user.projects.splice(i, 1);
        }
      }

      user.save(function(err) {
        if (err) {
          return res.status(500).send(err);
        }

        // remove the project
        project.remove(function(err) {
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
