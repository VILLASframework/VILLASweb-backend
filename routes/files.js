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

//var auth = require('../auth');

// models
var File = require('../models/file');
//var User = require('../models/user');

// create router
var router = express.Router();

// all file routes need authentication
//router.use('/files', auth.validateToken);

// routes
router.get('/files', function(req, res) {
  File.find(function(err, files) {
    if (err) {
      return res.status(400).send(err);
    }

    res.send({ files: files });
  });
});

router.get('/files/:id', function(req, res) {
  File.findOne({ _id: req.params.id }, function(err, file) {
    if (err) {
      return res.status(400).send(err);
    }

    res.send({ file: file });
  });
});

router.delete('/files/:id', function(req, res) {
  File.findOne({ _id: req.params.id }, function(err, file) {
    if (err) {
      return res.status(400).send(err);
    }

    file.remove(function(err) {
      if (err) {
        return res.status(500).send(err);
      }

      res.send({});
    });
  });
});

module.exports = router;
