/**
 * File: simulationModel.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 19.07.2016
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

var Schema = mongoose.Schema;

// simulation model model
var simulationModelSchema = new Schema({
  name: { type: String, required: true },
  simulator: { type: Schema.Types.ObjectId, ref: 'Simulator', required: true },
  length: { type: Number, default: 1 },
  mapping: [{ type: String, default: [] }],
  simulation: { type: Schema.Types.ObjectId, ref: 'Simulation', required: true }
});

module.exports = mongoose.model('SimulationModel', simulationModelSchema);
