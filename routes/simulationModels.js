/**
 * File: simulationModel.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 20.04.2018
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

const express = require('express');

const auth = require('../auth');
const logger = require('../utils/logger');

const SimulationModel = require('../models/simulationModel');
const Simulation = require('../models/simulation');

// create router
const router = express.Router();

router.use('/models', auth.validateToken);

// add routes
router.get('/models', (req, res) => {
    SimulationModel.find((err, models) => {
        if (err) {
            logger.error('Unable to find simulation models', err);
            return res.status(400).send(err);
        }

        res.send({ simulationModels: models });
    });
});

router.post('/models', (req, res) => {
    if (req.body.simulationModel._id == null) {
        delete req.body.simulationModel._id;
    }

    const model = new SimulationModel(req.body.simulationModel);

    Simulation.findById(model.simulation, (err, simulation) => {
        if (err) {
            logger.error('Unable to find simulation ' + model.simulation, err);
            return res.status(400).send(err);
        }

        simulation.models.push(model._id);

        simulation.save(err => {
            if (err) {
                logger.error('Unable to save simulation ' + model.simulation);
                return res.status(500).send(err);
            }

            model.save(err => {
                if (err) {
                    logger.error('Unable to create simulation model', err);
                    return res.status(500).send(err);
                }
        
                res.send({ simulationModel: model });
            });
        });
    });
});

router.put('/models/:id', (req, res) => {
    SimulationModel.findById(req.params.id, (err, model) => {
        if (err) {
            logger.log('verbose', 'PUT Unable to find simulation model ' + req.params.id);
            return res.status(400).send(err);
        }

        for (property in req.body.simulationModel) {
            model[property] = req.body.simulationModel[property];
          }

        model.save(err => {
            if (err) {
                logger.error('Unable to save simulation model', model);
                return res.status(500).send(err);
            }

            res.send({ simulationModel: model });
        });
    });
});

router.get('/models/:id', (req, res) => {
    SimulationModel.findById(req.params.id, (req, model) => {
        if (err) {
            logger.log('verbose', 'GET Unknown simulation model for id ' + req.params.id);
            return res.status(400).send(err);
        }

        res.send({ simulationModel: model });
    });
});

router.delete('/models/:id', (req, res) => {
    SimulationModel.findById(req.params.id, (err, model) => {
        if (err) {
            logger.log('verbose', 'DELETE Unknonwn simulation model for id ' + req.params.id);
            return res.status(400).send(err);
        }

        // remove from simulation list
        Simulation.findById(model.simulation, (err, simulation) => {
            if (err) {
                logger.warn('Unable to find simulation ' + model.simulation + ' for simulation model ' + req.params.id);
                return res.status(500).send(err);
            }

            const index = simulation.models.indexOf(model._id);
            if (index > -1) {
                simulation.models.splice(index, 1);
            }

            simulation.save(err => {
                if (err) {
                    logger.error('Unable to save changed simulation ' + simulation._id);
                    return res.status(500).send(err);
                }

                model.remove(err => {
                    if (err) {
                        logger.error('Unable to remove simlation model', err);
                        return res.status(500).send(err);
                    }
        
                    res.send({});
                });
            });
        });
    });
});

module.exports = router;
