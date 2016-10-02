/**
 * File: simulation.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 26.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

 // include
 var mongoose = require('mongoose');

 var SimulationModel = require('./simulationModel');

 var Schema = mongoose.Schema;

 // simulation model
 var simulationSchema = new Schema({
   name: { type: String, required: true },
   running: { type: Boolean, default: false },
   owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
   models: [{ type: Schema.Types.ObjectId, ref: 'SimulationModel', default: [] }],
   projects: [{ type: Schema.Types.ObjectId, ref: 'Project', default: [] }]
 });

 simulationSchema.pre('remove', function(callback) {
   // delete all models belonging to this project
   this.models.forEach(function(id) {
     SimulationModel.findOne({ _id: id }, function(err, model) {
       if (err) {
         return console.log(err);
       }

       model.remove(function(err) {
         if (err) {
           return console.log(err);
         }
       });
     });
   });

   callback();
 });

 module.exports = mongoose.model('Simulation', simulationSchema);
