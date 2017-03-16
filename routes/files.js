/**
 * File: files.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 25.01.2017
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

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
