// include
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// model model
var modelSchema = new Schema({
  name: { type: String, required: true, unique: true },
  running: { type: Boolean, default: false },
  projects: { type: Schema.Types.ObjectId, ref: 'Project' },
  owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Model', modelSchema);
