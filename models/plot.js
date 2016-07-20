/**
 * File: plot.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 28.06.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

// include
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// plot model
var plotSchema = new Schema({
  name: { type: String, required: true },
  signal: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  title: { type: String },
  type: { type: String, required: true },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  visualization: { type: Schema.Types.ObjectId, ref: 'Visualization' }
});

module.exports = mongoose.model('Plot', plotSchema);
