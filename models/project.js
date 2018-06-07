/**
 * File: project.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.07.2016
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
var mongoose = require('mongoose');

var Visualization = require('./visualization');
var logger = require('../utils/logger');

var Schema = mongoose.Schema;

// project model
var projectSchema = new Schema({
  name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  visualizations: [{ type: Schema.Types.ObjectId, ref: 'Visualization', default: [] }],
  simulation: { type: Schema.Types.ObjectId, ref: 'Simulation', required: true }
}, { versionKey: false, timestamps: true });

projectSchema.pre('remove', function(callback) {
  // delete all visualizations belonging to this project
  this.visualizations.forEach(function(id) {
    Visualization.findOne({ _id: id }, function(err, visualization) {
      if (err) {
        logger.error('Unable to find visualization for id: ' + id, err);
        return;
      }

      visualization.remove(function(err) {
        if (err) {
          logger.error('Unable to remove visualization', { err, visualization });
          return;
        }
      });
    });
  });

  callback();
});

module.exports = mongoose.model('Project', projectSchema);
