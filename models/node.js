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
var fs = require('fs');

var logger = require('../utils/logger');

var Schema = mongoose.Schema;

// node model
var nodeSchema = new Schema({
  name: { type: String, required: true, unique: true, set: function(name) { this._name = this.name; return name; } },
  endpoint: { type: String, required: true, unique: true },
  config: { type: Schema.Types.Mixed, default: {} },
  simulators: [{ type: Schema.Types.Mixed, default: [] }]
});

nodeSchema.pre('save', function(next) {
  // delete old configuration file
  if (this._name != null) {
    fs.stat('nodes/' + this._name + '.conf', function(err) {
      if (err) {
        logger.info('Old node configuration missing', err);
        return;
      }

      fs.unlink('nodes/' + this._name + '.conf', function(err) {
        if (err) {
          logger.warn('Unable to delete old node configuration', err);
        }
      });
    });
  }

  next();
});

nodeSchema.post('save', function() {
  // create configuration file
  var port = 12000;

  var nodes = this.simulators.map(simulator => {
    return "\t" + simulator.name + " = {\n\t\ttype = \"websocket\",\n\t\tvectorize = 1\n\t},\n" +
      "\t" + simulator.name + "_RECV = {\n\t\ttype = \"socket\",\n\t\tlayer = \"udp\",\n\t\tlocal = \"*:" + (port++) + "\",\n\t\tremote = \"127.0.0.1:" + (port++) + "\"\n\t}";
  });

  var paths = this.simulators.map(simulator => {
    return "\t{ in = \"" + simulator.name + "_RECV\", out = \"" + simulator.name + "\" }";
  });

  var content = "nodes = {\n" + nodes.join(",\n") + "\n};\n\npaths = (\n" + paths.join(",\n") + "\n);\n";

  fs.writeFile('nodes/' + this.name + '.conf', content, function(err) {
    if (err) {
      logger.error('Unable to write node configuration', err);
      return;
    }

    logger.log('info', 'Node configuration file written');
  });
});

module.exports = mongoose.model('Node', nodeSchema);
