/**
 * File: upload.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 05.12.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

// include
var express = require('express');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

var auth = require('../auth');

var User = require('../models/user');
var File = require('../models/file');

// create router
var router = express.Router();

// serve public files
router.use(express.static(path.join(__dirname, '../public')));

// routes
router.post('/upload', auth.validateToken, function(req, res) {
  // create form object
  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../public');

  // register events
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, req.decoded._doc._id + '_' + file.name));

    // find user
    User.findOne({ _id: req.decoded._doc._id }, function(err, user) {
      if (err) {
        console.log(err);
      }

      // create file object
      var fileObj = new File({ name: file.name, path: 'public/' + user._id + '_' + file.name, user: user._id });
      fileObj.save(function(err) {
        if (err) {
          console.log(err);
        }

        user.files.push(fileObj._id);

        user.save(function(err) {
          if (err) {
            console.log(err);
          }
        });
      });
    });
  });

  form.on('error', function(error) {
    console.log('Error uploading file: ' + error);
    res.status(403).send({ success: false, message: 'Error uploading file: ' + error });
  });

  form.on('end', function() {
    res.send({ success: true, message: 'File uploaded' });
  });

  // handle the request
  form.parse(req);
});

module.exports = router;
