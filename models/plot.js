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
  row: { type: Number, default: 0 },
  column: { type: Number, default: 0 },
  visualization: { type: Schema.Types.ObjectId, ref: 'Visualization' }
});

module.exports = mongoose.model('Plot', plotSchema);
