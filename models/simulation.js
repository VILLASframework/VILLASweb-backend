/**
 * File: simulation.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 26.07.2016
 *
 * This file is part of VILLASweb-backend.
 *
 * VILLASweb-backend is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * VILLASweb-backend is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with VILLASweb-backend. If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/

 // include
 var mongoose = require('mongoose');

 var SimulationModel = require('./simulationModel');
 var Project = require('./project');
 var logger = require('../utils/logger');

 var Schema = mongoose.Schema;

 // simulation model
 var simulationSchema = new Schema({
   name: { type: String, required: true },
   running: { type: Boolean, default: false },
   /*owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },*/
   /*models: [{ type: Schema.Types.ObjectId, ref: 'SimulationModel', default: [] }],*/
   models: { type: Array, default: [] },
   projects: [{ type: Schema.Types.ObjectId, ref: 'Project', default: [] }]
 });

 simulationSchema.pre('remove', function(callback) {
   // delete all models belonging to this simulation
   this.models.forEach(function(id) {
     SimulationModel.findOne({ _id: id }, function(err, model) {
       if (err) {
         logger.error('Unable to find simulation model for id: ' + id, err);
         return;
       }

       model.remove(function(err) {
         if (err) {
           logger.error('Unable to remove simulation model', { err, model });
           return;
         }
       });
     });
   });

   // delete all projects belonging to this simulation
   this.projects.forEach(function(id) {
     Project.findOne({ _id: id }, function(err, project) {
       if (err) {
         logger.error('Unable to find project for id: ' + id, err);
         return;
       }

       project.remove(function(err) {
         if (err) {
           logger.error('Unable to remove project', { err, project });
           return;
         }
       });
     });
   });

   callback();
 });

 module.exports = mongoose.model('Simulation', simulationSchema);
