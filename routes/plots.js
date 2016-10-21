/**
 * File: plots.js
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
var Plot = require('../models/plot');
var Visualization = require('../models/visualization')

// create router
var router = express.Router();

// all plot routes need authentication
router.use('/plots', auth.validateRole('visualization', 'read'), auth.validateToken);

// routes
router.get('/plots', function(req, res) {
  // get all plots
  Plot.find(function(err, plots) {
    if (err) {
      return res.send(err);
    }

    res.send({ plots: plots });
  });
});

router.post('/plots', auth.validateRole('visualization', 'create'), function(req, res) {
  // create new plot
  var plot = new Plot(req.body.plot);

  plot.save(function(err) {
    if (err) {
      return res.send(err);
    }

    res.send({ plot: plot });
  });

  // add plot to visualization
  Visualization.findOne({ _id: plot.visualization }, function(err, visualization) {
    if (err) {
      return console.log(err);
    }

    visualization.plots.push(plot._id);

    visualization.save(function(err) {
      if (err) {
        return console.log(err);
      }
    });
  });
});

router.put('/plots/:id', auth.validateRole('visualization', 'update'), function(req, res) {
  // get plot
  Plot.findOne({ _id: req.params.id }, function(err, plot) {
    if (err) {
      return res.send(err);
    }

    // update all properties
    for (property in req.body.plot) {
      plot[property] = req.body.plot[property];
    }

    // save the changes
    plot.save(function(err) {
      if (err) {
        return res.send(err);
      }

      res.send({ plot: plot });
    });
  });
});

router.get('/plots/:id', auth.validateRole('visualization', 'read'), function(req, res) {
  Plot.findOne({ _id: req.params.id }, function(err, plot) {
    if (err) {
      return res.send(err);
    }

    res.send({ plot: plot });
  });
});

router.delete('/plots/:id', auth.validateRole('visualization', 'delete'), function(req, res) {
  Plot.findOne({ _id: req.params.id }, function(err, plot) {
    if (err) {
      return res.send(err);
    }

    // remove from visualization's list
    Visualization.findOne({ _id: plot.visualization }, function(err, visualization) {
      if (err) {
        return console.log(err);
      }

      for (var i = 0; i < visualization.plots.length; i++) {
        var id = String(visualization.plots[i]);
        if (id == plot._id) {
          visualization.plots.splice(i, 1);
        }
      }

      visualization.save(function(err) {
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
