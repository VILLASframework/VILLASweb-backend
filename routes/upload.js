/**
 * File: upload.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 05.12.2016
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
var express = require('express');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

// load configuration
var config = require('../config');
var auth = require('../auth');

var User = require('../models/user');
var File = require('../models/file');

// create router
var router = express.Router();

// all user routes need authentication
router.use('/upload', auth.validateToken);

// serve public files
let publicDir = path.join(__dirname, config.publicDir);
router.use(express.static(publicDir));

// routes
router.post('/upload', auth.validateRole('visualization', 'update'), function(req, res) {
  
  // find upload author
  User.findOne({ _id: req.decoded._doc._id }, function(err, user) {
    if (err) {
      console.error('Could find author while uploading', err);
      res.status(500).send({ success: false, message: 'File could not be uploaded.' });
    }

    // create form object with the upload dir corresponding to user's
    var form = new formidable.IncomingForm();
    let userFolder = path.join(publicDir,user._id + ''); // ensure is a string
    form.uploadDir = userFolder;

    form.on('error', function(error) {
      console.error('Error while processing incoming form',error);
      res.status(400).send({ success: false, message: 'File could not be uploaded.' });
    });

    form.on('file', function(field, file) {

      // create file object, assigning path to userID + formidable's created name
      let filePath = path.join(user._id + '', path.basename(file.path));
      var fileObj = new File({ name: file.name, path: filePath });
      fileObj.save(function(err) {
        if (err) {
          console.error('Error while storing reference to uploaded file', err);
          res.status(500).send({ success: false, message: 'File could not be uploaded.' });
        }

        user.files.push(fileObj._id);

        user.save(function(err) {
          if (err) {
            console.error('Error while updating user\'s files references', err);
            res.status(500).send({ success: false, message: 'File could not be uploaded.' });
          }
        });
      });
    });

    form.on('end', function() {
      res.send({ success: true, message: 'File uploaded' });
    });

    // Make sure user's folder exists
    fs.mkdir(userFolder, function(err) {
      // error occurred (ignore already existing) 
      if (err && err.code != 'EEXIST') {
        res.status(500).send({ success: false, message: 'File could not be uploaded.'});
        return;
      }
      
      // handle the request
      form.parse(req);

    });
  });
});

module.exports = router;
