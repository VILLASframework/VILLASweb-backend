/**
 * File: visualization.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 28.06.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

// include
var mongoose = require('mongoose');

//var Widget = require('./widget');

var Schema = mongoose.Schema;

// visualization model
var visualizationSchema = new Schema({
  name: { type: String, required: true },
  project: { type: Schema.Types.ObjectId, ref: 'Project'/*, required: true*/ },
  widgets: { type: Array, default: [] }
  /*widgets: [{ type: Schema.Types.ObjectId, ref: 'Widget' }],
  rows: { type: Number, default: 1 }*/
});

// execute before the visualization is deleted
visualizationSchema.pre('remove', function(callback) {
  // delete all widgets belonging to this visualization
  /*this.widgets.forEach(function(id) {
    Widget.findOne({ _id: id }, function(err, widget) {
      if (err) {
        return console.log(err);
      }

      widget.remove(function(err) {
        if (err) {
          return console.log(err);
        }
      });
    });
  });*/

  callback();
});

module.exports = mongoose.model('Visualization', visualizationSchema);
