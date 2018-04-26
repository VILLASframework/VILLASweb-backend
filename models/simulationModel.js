/**
 * File: simulationModel.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 20.04.2018
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

const mongoose = require('mongoose');

const simulationModelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    simulation: { type: mongoose.Schema.Types.ObjectId, ref: 'Simulation', required: true },
    simulator: { type: mongoose.Schema.Types.ObjectId, ref: 'Simulator', required: true },
    outputLength: { type: Number, default: 1 },
    inputLength: { type: Number, default: 1 },
    outputMapping: { type: mongoose.Schema.Types.Mixed, default: {} },
    inputMapping: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { versionKey: false });

module.exports = mongoose.model('SimulationModel', simulationModelSchema);
