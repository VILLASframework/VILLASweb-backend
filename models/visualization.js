/**
 * File: visualization.js
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
