// include
var mongoose = require('mongoose');

var Plot = require('./plot');

var Schema = mongoose.Schema;

// visualization model
var visualizationSchema = new Schema({
  name: { type: String, required: true },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  plots: [{ type: Schema.Types.ObjectId, ref: 'Plot' }]
});

// execute before the visualization is deleted
visualizationSchema.pre('remove', function(callback) {
  // delete all plots belonging to this visualization
  this.plots.forEach(function(plot) {
    Plot.findOne({ _id: id}, function(err, plot) {
      if (err) {
        return console.log(err);
      }

      plot.remove(function(err) {
        if (err) {
          return console.log(err);
        }
      });
    });
  });

  callback();
});

module.exports = mongoose.model('Visualization', visualizationSchema);
