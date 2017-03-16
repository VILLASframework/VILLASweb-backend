/**
 * File: simulation.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 28.09.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

 // include
 var mongoose = require('mongoose');

 var Schema = mongoose.Schema;

 // simulator model
 var simulatorSchema = new Schema({
   name: { type: String, required: true },
   running: { type: Boolean, default: false },
   endpoint: { type: String, required: true }
 });

 module.exports = mongoose.model('Simulator', simulatorSchema);
