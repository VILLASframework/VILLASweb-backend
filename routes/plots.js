// include
var express = require('express');

var Plot = require('../models/plot');
var auth = require('../auth');

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
  Plot.remove({ _id: req.params.id }, function(err, plot) {
    if (err) {
      return res.send(err);
    }

    res.send({ plot: plot });
  });
});

module.exports = router;
