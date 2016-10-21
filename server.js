/**
 * File: server.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 04.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

// include modules
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');

// local include
var config = require('./config');

var users = require('./routes/users');
var projects = require('./routes/projects');
var visualizations = require('./routes/visualizations');
var plots = require('./routes/plots');
var simulations = require('./routes/simulations');
var simulationModels = require('./routes/simulationModels');
var simulators = require('./routes/simulators');

var User = require('./models/user');

// create application
var app = express();

// configure app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());

// connect to database
mongoose.connect(config.databaseURL + config.databaseName);

// register routes
app.use('/api/v1', users);
app.use('/api/v1', projects);
app.use('/api/v1', visualizations);
app.use('/api/v1', plots);
app.use('/api/v1', simulations);
app.use('/api/v1', simulationModels);
app.use('/api/v1', simulators);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({ error: err, message: err.message });
  });
}

// production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({ error: {}, message: err.message });
});

// start the app
app.listen(config.port, function() {
  console.log('Express server listening on port ' + config.port);
});

// add admin account
if (config.admin) {
  // check if admin account exists
  User.findOne({ username: config.admin.username }, function(err, user) {
    if (err) {
      console.log(err);
      return;
    }

    if (!user) {
      // create new admin user
      var newUser = User({ username: config.admin.username, password: config.admin.password, role: 'admin' });
      newUser.save(function(err) {
        if (err) {
          console.log(err);
          return;
        }

        console.log('Created default admin user from config file');
      });
    }
  });
}
