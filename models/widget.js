/**
 * File: widget.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 28.06.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

// include
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// widget model
var widgetSchema = new Schema({
  name: { type: String },
  widgetData: { type: Schema.Types.Mixed, default: {} },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  type: { type: String, required: true },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  z: { type: Number, default: 0 },
  visualization: { type: Schema.Types.ObjectId, ref: 'Visualization' }
});

module.exports = mongoose.model('Widget', widgetSchema);
