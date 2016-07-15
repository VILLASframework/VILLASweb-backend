// include
var express = require('express');

var auth = require('../auth');

// models
var Plot = require('../models/plot');
var Visualization = require('../models/visualization')

// create router
var router = express.Router();

// all plot routes need authentication
router.use('/plots', auth.validateToken);

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

router.route('/plots').post(function(req, res) {
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

router.route('/plots/:id').put(function(req, res) {
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

router.route('/plots/:id').get(function(req, res) {
  Plot.findOne({ _id: req.params.id }, function(err, plot) {
    if (err) {
      return res.send(err);
    }

    res.send({ plot: plot });
  });
});

router.route('/plots/:id').delete(function(req, res) {
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
