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
      var newUser = User({ username: config.admin.username, password: config.admin.password, adminLevel: 1});
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
