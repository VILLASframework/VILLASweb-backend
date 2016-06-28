// include
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// project model
var projectSchema = new Schema({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  visualizations: [{ type: Schema.Types.ObjectId, ref: 'Visualization' }]
});

module.exports = mongoose.model('Project', projectSchema);
