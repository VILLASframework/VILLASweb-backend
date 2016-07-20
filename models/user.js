/**
 * File: user.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 26.06.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

// include
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Project = require('./project');
var SimulationModel = require('./simulationModel');

var Schema = mongoose.Schema;

// user model
var userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  adminLevel: { type: Number, default: 0 },
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project', default: [] }],
  mail: { type: String, default: "" },
  simulationModel: [{ type: Schema.Types.ObjectId, ref: 'Model', default: [] }]
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

  // delete all models belonging to this user
  this.simulationModels.forEach(function(id) {
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

module.exports = mongoose.model('User', userSchema);
