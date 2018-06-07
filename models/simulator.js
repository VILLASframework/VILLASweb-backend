/**
 * File: simulator.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 03.03.2018
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

// simulator model
const simulatorSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  host: { type: String, default: "" },
  model: { type: String, default: "" },
  uptime: { type: Number, default: 0 },
  state: { type: String, default: "" },
  properties: { type: mongoose.Schema.Types.Mixed, default: {} },
  rawProperties: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('Simulator', simulatorSchema);
