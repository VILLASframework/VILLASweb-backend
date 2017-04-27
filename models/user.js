/**
 * File: user.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 26.06.2016
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
var bcrypt = require('bcrypt-nodejs');

var Project = require('./project');
var Simulation = require('./simulation');

var Schema = mongoose.Schema;

// user model
var userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'user' },
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project', default: [] }],
  mail: { type: String, default: "" },
  simulations: [{ type: Schema.Types.ObjectId, ref: 'Simulation', default: [] }],
  files: [{type: Schema.Types.ObjectId, ref: 'File', default: [] }]
});

userSchema.methods.verifyPassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }

    callback(null, isMatch);
  });
};

// execute before each user.save() call
userSchema.pre('save', function(callback) {
  // save user to use in callback
  var user = this;

  // stop if password hasn't changed
  if (!user.isModified('password')) {
    return callback();
  }

  // hash the password
  bcrypt.genSalt(5, function(err, salt) {
    if (err) {
      callback(err);
    }

    // generate hash from password and salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return callback(err);
      }

      // save the hashed password
      user.password = hash;

      callback();
    });
  });
});

// execute before the user is deleted
userSchema.pre('remove', function(callback) {
  // delete all projects belonging to this user
  this.projects.forEach(function(id) {
    Project.findOne({ _id: id }, function(err, project) {
      if (err) {
        return console.log(err);
      }

      project.remove(function(err) {
        if (err) {
          return console.log(err);
        }
      });
    });
  });

  // delete all simulations belonging to this user
  this.simulations.forEach(function(id) {
    Simulation.findOne({ _id: id }, function(err, simulation) {
      if (err) {
        return console.log(err);
      }

      simulation.remove(function(err) {
        if (err) {
          return console.log(err);
        }
      });
    });
  });

  callback();
});

module.exports = mongoose.model('User', userSchema);
