/**
 * File: nodes.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 21.06.2017
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

var logger = require('../utils/logger');

// models
var Node = require('../models/node');

// create router
var router = express.Router();

// routes
router.get('/nodes', function(req, res) {
  // get all nodes
  Node.find(function(err, nodes) {
    if (err) {
      logger.error('Unable to receive nodes', err);
      return res.status(400).send(err);
    }

    res.send({ nodes: nodes });
  });
});

router.post('/nodes', function(req, res) {
  // create new node
  var node = new Node(req.body.node);

  node.save(function(err) {
    if (err) {
      logger.error('Unable to create node', err);
      return res.status(400).send(err);
    }

    res.send({ node: node });
  });
});

router.put('/nodes/:id', function(req, res) {
  // get node
  Node.findOne({ _id: req.params.id }, function(err, node) {
    if (err) {
      logger.log('verbose', 'PUT Unknown node for id: ' + req.params.id);
      return res.status(400).send(err);
    }

    // update all properties
    for (property in req.body.node) {
      node[property] = req.body.node[property];
    }

    // save the changes
    node.save(function(err) {
      if (err) {
        logger.error('Unable to save node', node);
        return res.status(500).send(err);
      }

      res.send({ node: node });
    });
  });
});

router.get('/nodes/:id', function(req, res) {
  Node.findOne({ _id: req.params.id }, function(err, node) {
    if (err) {
      logger.log('verbose', 'GET Unknown node for id: ' + req.params.id);
      return res.status(400).send(err);
    }

    res.send({ node: node });
  });
});

router.delete('/nodes/:id', function(req, res) {
  Node.findOne({ _id: req.params.id }, function(err, node) {
    if (err) {
      logger.log('verbose', 'DELETE Unknown node for id: ' + req.params.id);
      return res.status(400).send(err);
    }

    node.remove(function(err) {
      if (err) {
        logger.error('Unable to remove node', node);
        return res.status(500).send(err);
      }

      res.send({});
    });
  });
});

module.exports = router;
