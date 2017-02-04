/**
 * File: file.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 25.01.2017
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

// include
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// file model
var fileSchema = new Schema({
  name: { type: String },
  path: { type: String, required: true },
  type: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
