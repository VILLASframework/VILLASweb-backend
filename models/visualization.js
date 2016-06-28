// include
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// visualization model
var visualizationSchema = new Schema({
  name: { type: String, required: true },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  plots: [{ type: Schema.Types.ObjectId, ref: 'Plot' }]
});

module.exports = mongoose.model('Visualization', visualizationSchema);
