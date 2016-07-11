// include
var mongoose = require('mongoose');

var Visualization = require('./visualization');

var Schema = mongoose.Schema;

// project model
var projectSchema = new Schema({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  visualizations: [{ type: Schema.Types.ObjectId, ref: 'Visualization' }]
});

projectSchema.pre('remove', function(callback) {
  // delete all visualizations belonging to this project
  this.visualizations.forEach(function(id) {
    Visualization.findOne({ _id: id}, function(err, visualization) {
      if (err) {
        return console.log(err);
      }

      visualization.remove(function(err) {
        if (err) {
          return console.log(err);
        }
      });
    });
  });

  callback();
});

module.exports = mongoose.model('Project', projectSchema);
