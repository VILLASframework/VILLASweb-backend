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

//var auth = require('../auth');

//var User = require('../models/user');
var File = require('../models/file');

// create router
var router = express.Router();

// serve public files
router.use(express.static(path.join(__dirname, '../public')));

// routes
router.post('/upload', /*auth.validateToken,*/ function(req, res) {
  // create form object
  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../public');

  // register events
  form.on('file', function(field, file) {
    console.log(file);

    //fs.rename(file.path, path.join(form.uploadDir, /*req.decoded._doc._id + '_' +*/ file.name));

    // find user
    /*User.findOne({ _id: req.decoded._doc._id }, function(err, user) {
      if (err) {
        console.log(err);
      }*/

      // create file object
      var fileObj = new File({ name: file.name, path: 'public/' + /*user._id + '_' +*/ file.name/*, user: user._id*/ });
      fileObj.save(function(err) {
        if (err) {
          console.log(err);
        }

        /*user.files.push(fileObj._id);

        user.save(function(err) {
          if (err) {
            console.log(err);
          }
        });
      });*/
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
