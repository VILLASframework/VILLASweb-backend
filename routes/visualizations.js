// include
var express = require('express');

var Visualization = require('../models/visualization');
var auth = require('../auth');

// create router
var router = express.Router();

// all visualization routes need authentication
router.use('/visualizations', auth.validateToken);

// routes
router.get('/visualizations', function(req, res) {
  // get all visualizations
  Visualization.find(function(err, visualizations) {
    if (err) {
      return res.send(err);
    }

    res.send({ visualizations: visualizations });
  });
});

router.route('/visualizations').post(function(req, res) {
  // create new visualization
  var visualization = new Visualization(req.body.visualization);

  visualization.save(function(err) {
    if (err) {
      return res.send(err);
    }

    res.send({ visualization: visualization });
  });
});

router.route('/visualizations/:id').put(function(req, res) {
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

router.route('/visualizations/:id').get(function(req, res) {
  Visualization.findOne({ _id: req.params.id }, function(err, visualization) {
    if (err) {
      return res.send(err);
    }

    res.send({ visualization: visualization });
  });
});

router.route('/visualizations/:id').delete(function(req, res) {
  Visualization.remove({ _id: req.params.id }, function(err, visualization) {
    if (err) {
      return res.send(err);
    }

    res.send({ visualization: visualization });
  });
});

module.exports = router;
