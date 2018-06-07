/**
 * File: simulation.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 26.07.2016
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
const mongoose = require('mongoose');

const logger = require('../utils/logger');

// simulation model
const simulationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  running: { type: Boolean, default: false },
  models: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SimulationModel', default: [] }],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: [] }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startParameters: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { versionKey: false });

module.exports = mongoose.model('Simulation', simulationSchema);
