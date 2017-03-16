/**
 * File: widgets.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 28.06.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

// include
var express = require('express');

//var auth = require('../auth');

// models
var Widget = require('../models/widget');
var Visualization = require('../models/visualization');

// create router
var router = express.Router();

// all widget routes need authentication
//router.use('/widgets', auth.validateToken);

// routes
router.get('/widgets', /*auth.validateRole('visualization', 'read'),*/ function(req, res) {
  // get all widgets
  Widget.find(function(err, widgets) {
    if (err) {
      return res.send(err);
    }

    res.send({ widgets: widgets });
  });
});

router.post('/widgets', /*auth.validateRole('visualization', 'create'),*/ function(req, res) {
  // create new widget
  var widget = new Widget(req.body.widget);

  widget.save(function(err) {
    if (err) {
      return res.send(err);
    }

    res.send({ widget: widget });
  });

  // add widget to visualization
  Visualization.findOne({ _id: widget.visualization }, function(err, visualization) {
    if (err) {
      return console.log(err);
    }

    visualization.widgets.push(widget._id);

    visualization.save(function(err) {
      if (err) {
        return console.log(err);
      }
    });
  });
});

router.put('/widgets/:id', /*auth.validateRole('visualization', 'update'),*/ function(req, res) {
  // get widget
  Widget.findOne({ _id: req.params.id }, function(err, widget) {
    if (err) {
      return res.send(err);
    }

    // update all properties
    for (property in req.body.widget) {
      widget[property] = req.body.widget[property];
    }

    // save the changes
    widget.save(function(err) {
      if (err) {
        return res.send(err);
      }

      res.send({ widget: widget });
    });
  });
});

router.get('/widgets/:id', /*auth.validateRole('visualization', 'read'),*/ function(req, res) {
  Widget.findOne({ _id: req.params.id }, function(err, widget) {
    if (err) {
      return res.send(err);
    }

    res.send({ widget: widget });
  });
});

router.delete('/widgets/:id', /*auth.validateRole('visualization', 'delete'),*/ function(req, res) {
  Widget.findOne({ _id: req.params.id }, function(err, widget) {
    if (err) {
      return res.send(err);
    }

    // remove from visualization's list
    Visualization.findOne({ _id: widget.visualization }, function(err, visualization) {
      if (err) {
        return console.log(err);
      }

      for (var i = 0; i < visualization.widgets.length; i++) {
        var id = String(visualization.widgets[i]);
        if (id == widget._id) {
          visualization.widgets.splice(i, 1);
        }
      }

      visualization.save(function(err) {
        if (err) {
          return console.log(err);
        }
      });
    });

    widget.remove(function(err) {
      if (err) {
        return res.send(err);
      }

      res.send({});
    });
  });
});

module.exports = router;
