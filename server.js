// include modules
var express = require('express');
var mongoose = require('mongoose');

// local include
var config = require('./config');

// create application
var app = express();

// connect to database
mongoose.connect(config.databaseURL + config.databaseName);

// start the app
app.listen(config.port, function() {
  console.log('Express server listening on port ' + config.port);
});
