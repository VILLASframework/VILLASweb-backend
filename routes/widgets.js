/**
 * File: widgets.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 28.06.2016
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

//var auth = require('../auth');
var logger = require('../utils/logger');

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
      logger.error('Unable to receive widgets', err);
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
      logger.error('Unable to create widget', err);
      return res.send(err);
    }

    res.send({ widget: widget });
  });

  // add widget to visualization
  Visualization.findOne({ _id: widget.visualization }, function(err, visualization) {
    if (err) {
      logger.log('verbose', 'Unknown visualization for id: ' + widget.visualization);
      return;
    }

    visualization.widgets.push(widget._id);

    visualization.save(function(err) {
      if (err) {
        logger.error('Unable to save visualization', visualization);
        return;
      }
    });
  });
});

router.put('/widgets/:id', /*auth.validateRole('visualization', 'update'),*/ function(req, res) {
  // get widget
  Widget.findOne({ _id: req.params.id }, function(err, widget) {
    if (err) {
      logger.log('verbose', 'PUT Unknown widget for id: ' + req.params.id);
      return res.send(err);
    }

    // update all properties
    for (property in req.body.widget) {
      widget[property] = req.body.widget[property];
    }

    // save the changes
    widget.save(function(err) {
      if (err) {
        logger.error('Unable to save widget', widget);
        return res.send(err);
      }

      res.send({ widget: widget });
    });
  });
});

router.get('/widgets/:id', /*auth.validateRole('visualization', 'read'),*/ function(req, res) {
  Widget.findOne({ _id: req.params.id }, function(err, widget) {
    if (err) {
      logger.log('verbose', 'GET Unknown widget for id: ' + req.params.id);
      return res.send(err);
    }

    res.send({ widget: widget });
  });
});

router.delete('/widgets/:id', /*auth.validateRole('visualization', 'delete'),*/ function(req, res) {
  Widget.findOne({ _id: req.params.id }, function(err, widget) {
    if (err) {
      logger.log('verbose', 'DELETE Unknown widget for id: ' + req.params.id);
      return res.send(err);
    }

    // remove from visualization's list
    Visualization.findOne({ _id: widget.visualization }, function(err, visualization) {
      if (err) {
        logger.log('verbose', 'Unknown visualization for id: ' + widget.visualization);
        return;
      }

      for (var i = 0; i < visualization.widgets.length; i++) {
        var id = String(visualization.widgets[i]);
        if (id == widget._id) {
          visualization.widgets.splice(i, 1);
        }
      }

      visualization.save(function(err) {
        if (err) {
          logger.error('Unable to save visualization', visualization);
          return;
        }
      });
    });

    widget.remove(function(err) {
      if (err) {
        logger.error('Unable to remove widget', widget);
        return res.send(err);
      }

      res.send({});
    });
  });
});

module.exports = router;
