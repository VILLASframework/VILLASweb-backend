/**
 * File: node.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 21.06.2017
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

var Simulator = require('./simulator');
var logger = require('../utils/logger');

var Schema = mongoose.Schema;

// node model
var nodeSchema = new Schema({
  name: { type: String, required: true, unique: true },
  endpoint: { type: String, required: true, unique: true },
  config: { type: Schema.Types.Mixed, default: {} },
  simulators: [{ type: Schema.Types.ObjectId, ref: 'Simulator', default: [] }]
});

nodeSchema.pre('remove', function(callback) {
  // delete all simulators belonging to this node
  this.simulators.forEach(function(id) {
    Simulator.findOne({ _id: id }, function(err, simulator) {
      if (err) {
        logger.error('Unable to find simulator for id: ' + id, err);
        return;
      }

      simulator.remove(function(err) {
        if (err) {
          logger.error('Unable to remove simulator', { err, simulator });
          return;
        }
      });
    });
  });

  callback();
});

module.exports = mongoose.model('Node', nodeSchema);
