// include
var express = require('express');

var Project = require('../models/project');
var auth = require('../auth');

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

    res.json({ projects: projects });
  });
});

router.route('/projects').post(function(req, res) {
  // create new project
  var project = new Project(req.body.project);

  project.save(function(err) {
    if (err) {
      return res.send(err);
    }

    //res.send({ success: true, message: 'Project added', project: project });
    res.send({ project: project });
  });
});

router.route('/projects/:id').patch(function(req, res) {
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

    Project.remove({ _id: req.params.id }, function(err) {
      if (err) {
        return res.send(err);
      }

      res.send({ success: true, message: 'Project deleted' });
    });
  });
});

module.exports = router;
