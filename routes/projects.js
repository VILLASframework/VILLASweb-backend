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

// create router
var router = express.Router();

// all project routes need authentication
router.use('/projects', auth.validateToken);

// authorize user function
function authorizeUser(req, project) {
  // get logged-in user id
  var userId = req.decoded._doc._id;
  var userAdminLevel = req.decoded._doc.adminLevel;

  if (project.owner == userId) {
    return true;
  } else if (userAdminLevel >= 1) {
    return true;
  }

  return false;
}

// routes
router.get('/projects', function(req, res) {
  // get all projects
  Project.find(function(err, projects) {
    if (err) {
      return res.send(err);
    }

    res.send({ projects: projects });
  });
});

router.route('/projects').post(function(req, res) {
  // create new project
  var project = new Project(req.body.project);

  project.save(function(err) {
    if (err) {
      return res.send(err);
    }

    res.send({ project: project });
  });

  // add project to user
  User.findOne({ _id: project.owner }, function(err, user) {
    if (err) {
      return console.log(err);
    }

    user.projects.push(project._id);

    user.save(function(err) {
      if (err) {
        console.log(err);
      }
    });
  });
});

router.route('/projects/:id').put(function(req, res) {
  // get project
  Project.findOne({ _id: req.params.id }, function(err, project) {
    if (err) {
      return res.send(err);
    }

    // update all properties
    for (property in req.body.project) {
      project[property] = req.body.project[property];
    }

    // save the changes
    project.save(function(err) {
      if (err) {
        return res.send(err);
      }

      res.send({ project: project });
    });
  });
});

router.route('/projects/:id').get(function(req, res) {
  Project.findOne({ _id: req.params.id }, function(err, project) {
    if (err) {
      return res.send(err);
    }

    res.send({ project: project });
  });
});

router.route('/projects/:id').delete(function(req, res) {
  Project.findOne({ _id: req.params.id }, function(err, project) {
    if (err) {
      return res.send(err);
    }

    // remove from owner's list
    User.findOne({ _id: project.owner }, function(err, user) {
      if (err) {
        return console.log(err);
      }

      for (var i = 0; user.projects.length; i++) {
        var id = String(user.projects[i]);
        if (id == project._id) {
          user.projects.splice(i, 1);
        }
      }

      user.save(function(err) {
        if (err) {
          return console.log(err);
        }
      });
    });

    project.remove(function(err) {
      if (err) {
        return res.send(err);
      }

      res.send({});
    });
  });
});

module.exports = router;
