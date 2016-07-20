/**
 * File: simulationModel.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 19.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

// include
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// simulation model model
var simulationModelSchema = new Schema({
  name: { type: String, required: true },
  running: { type: Boolean, default: false },
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('SimulationModel', simulationModelSchema);
