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
  type: { type: String, required: true }
});

module.exports = mongoose.model('Plot', plotSchema);
