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
var sizeOf = require('image-size');

// load configuration
var config = require('../config');
var auth = require('../auth');
var logger = require('../utils/logger');

var User = require('../models/user');
var File = require('../models/file');

const fileTypes = [ 'image', 'result', 'model', 'configuration' ];

// create router
var router = express.Router();

// all user routes need authentication
router.use('/upload', auth.validateToken);

// serve public files
const publicDir = path.join(__dirname, config.publicDir);
//router.use(express.static(publicDir));

// routes
router.post('/upload/:type', function(req, res) {
  if (fileTypes.indexOf(req.params.type) === -1) {
    logger.log('verbose', 'POST Unknown file type ' + req.params.type);
    return res.status(400).send({ success: false, message: 'Unknown file type ' + req.params.type });
  }

  // find upload author
  User.findOne({ _id: req.decoded._id }, function(err, user) {
    if (err) {
      logger.log('verbose', 'POST Unable to find user for id: ' + req.decoded._id);
      return res.status(500).send({ success: false, message: 'File could not be uploaded.' });
    }

    // create form object with the upload dir corresponding to user's
    const form = new formidable.IncomingForm();
    const userFolder = path.join(publicDir, user._id + ''); // ensure is a string
    form.uploadDir = userFolder;
    form.keepExtensions = true;

    form.on('error', function(error) {
      logger.error('Unable to process incoming form', error);
      return res.status(400).send({ success: false, message: 'File could not be uploaded.' });
    });

    form.on('file', function(field, file) {
      // create file object, assigning path to userID + formidable's created name
      const filePath = path.join(user._id + '', path.basename(file.path));
      var fileObj = new File({ name: file.name, path: filePath, type: req.params.type, mimeType: file.type, size: file.size, user: user._id });

      // if file is an image, get the image size
      if (file.type.split("/")[0] === "image") {
        var dimensions = sizeOf(file.path);
        delete dimensions['type'];
        fileObj.dimensions = dimensions;
      }

      fileObj.save(function(err) {
        if (err) {
          logger.error('Unable to save reference file', err);
          return res.status(500).send({ success: false, message: 'File could not be uploaded.' });
        }

        user.files.push(fileObj._id);

        user.save(function(err) {
          if (err) {
            logger.error('Unable to save user', user);
            return res.status(500).send({ success: false, message: 'File could not be uploaded.' });
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
        logger.error('Unable to create directory', err);
        return res.status(500).send({ success: false, message: 'File could not be uploaded.'});
      }

      // handle the request
      form.parse(req);
    });
  });
});

module.exports = router;
