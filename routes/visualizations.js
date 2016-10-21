/**
 * File: visualizations.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 28.06.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

// include
var express = require('express');

var auth = require('../auth');

// models
var Visualization = require('../models/visualization');
var Project = require('../models/project');

// create router
var router = express.Router();

// all visualization routes need authentication
router.use('/visualizations', auth.validateToken);

// routes
router.get('/visualizations', auth.validateRole('visualization', 'read'), function(req, res) {
  // get all visualizations
  Visualization.find(function(err, visualizations) {
    if (err) {
      return res.send(err);
    }

    res.send({ visualizations: visualizations });
  });
});

router.post('/visualizations', auth.validateRole('visualization', 'create'), function(req, res) {
  // create new visualization
  var visualization = new Visualization(req.body.visualization);

  visualization.save(function(err) {
    if (err) {
      return res.send(err);
    }

    res.send({ visualization: visualization });
  });

  // add visualization to project
  Project.findOne({ _id: visualization.project }, function(err, project) {
    if (err) {
      return console.log(err);
    }

    project.visualizations.push(visualization._id);

    project.save(function(err) {
      if (err) {
        return console.log(err);
      }
    });
  });
});

router.put('/visualizations/:id', auth.validateRole('visualization', 'update'), function(req, res) {
  // get visualization
  Visualization.findOne({ _id: req.params.id }, function(err, visualization) {
    if (err) {
      return res.send(err);
    }

    // update all properties
    for (property in req.body.visualization) {
      visualization[property] = req.body.visualization[property];
    }

    // save the changes
    visualization.save(function(err) {
      if (err) {
        return res.send(err);
      }

      res.send({ visualization: visualization });
    });
  });
});

router.get('/visualizations/:id', auth.validateRole('visualization', 'read'), function(req, res) {
  Visualization.findOne({ _id: req.params.id }, function(err, visualization) {
    if (err) {
      return res.send(err);
    }

    res.send({ visualization: visualization });
  });
});

router.delete('/visualizations/:id', auth.validateRole('visualization', 'delete'), function(req, res) {
  Visualization.findOne({ _id: req.params.id }, function(err, visualization) {
    if (err) {
      return res.send(err);
    }

    // remove from project's list
    Project.findOne({ _id: visualization.project }, function(err, project) {
      if (err) {
        return console.log(err);
      }

      for (var i = 0; i < project.visualizations.length; i++) {
        var id = String(project.visualizations[i]);
        if (id == visualization._id) {
          project.visualizations.splice(i, 1);
        }
      }

      project.save(function(err) {
        if (err) {
          return console.log(err);
        }
      });
    });

    visualization.remove(function(err) {
      if (err) {
        return res.send(err);
      }

      res.send({});
    });
  });
});

module.exports = router;
