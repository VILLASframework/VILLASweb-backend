// include modules
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');

// local include
var config = require('./config');

var users = require('./routes/users');

var User = require('./models/user');

// create application
var app = express();

// configure app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// connect to database
mongoose.connect(config.databaseURL + config.databaseName);

// register routes
app.use('/api/v1', users);

// start the app
app.listen(config.port, function() {
  console.log('Express server listening on port ' + config.port);
});

var newUser = User({ username: 'admin', password: 'test' });
newUser.save(function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Created default admin user from config file');
});
