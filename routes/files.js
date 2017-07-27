/**
 * File: files.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 25.01.2017
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

var auth = require('../auth');
var logger = require('../utils/logger');

// models
var File = require('../models/file');
var User = require('../models/user');

// create router
var router = express.Router();

// all file routes need authentication
router.use('/files', auth.validateToken);

// routes
router.get('/files', auth.validateToken, function(req, res) {
  // find request author
  User.findOne({ _id: req.decoded._doc._id }, function(err, user) {
    if (err) {
      logger.error('Could find user requesting files', err);
    }

    File.find({ _id: { $in : user.files } }, function(err, files) {
      if (err) {
        logger.error('Error while querying files from user', { err, user });
        return res.status(500).send({ success: false, message: 'Could not retrieve user\'s files.' });
      }

      res.send({ files: files });
    });
  });
});

router.get('/files/:id', function(req, res) {
  File.findOne({ _id: req.params.id }, function(err, file) {
    if (err) {
      logger.log('verbose', 'GET Unknown file for id: ' + req.params.id);
      return res.status(400).send(err);
    }

    res.send({ file: file });
  });
});

router.delete('/files/:id', function(req, res) {
  File.findOne({ _id: req.params.id }, function(err, file) {
    if (err) {
      logger.log('verbose', 'DELETE Unknown file for id: ' + req.params.id);
      return res.status(400).send(err);
    }

    file.remove(function(err) {
      if (err) {
        logger.error('Unable to remove file', file);
        return res.status(500).send(err);
      }

      res.send({});
    });
  });
});

module.exports = router;
