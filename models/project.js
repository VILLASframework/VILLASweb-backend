/**
 * File: project.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

// include
var mongoose = require('mongoose');

var Visualization = require('./visualization');

var Schema = mongoose.Schema;

// project model
var projectSchema = new Schema({
  name: { type: String, required: true },
  /*owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },*/
  visualizations: [{ type: Schema.Types.ObjectId, ref: 'Visualization', default: [] }],
  simulation: { type: Schema.Types.ObjectId, ref: 'Simulation', required: true }
});

projectSchema.pre('remove', function(callback) {
  // delete all visualizations belonging to this project
  this.visualizations.forEach(function(id) {
    Visualization.findOne({ _id: id }, function(err, visualization) {
      if (err) {
        return console.log(err);
      }

      visualization.remove(function(err) {
        if (err) {
          return console.log(err);
        }
      });
    });
  });

  callback();
});

module.exports = mongoose.model('Project', projectSchema);
