/**
 * File: get.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 27.06.2017
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

process.env.NODE_ENV = 'test';

// include
var mongoose = require('mongoose');
var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../../../server');
var Simulator = require('../../../models/simulator');

// prepare dependencies
var should = chai.should();

chai.use(chaiHttp);

const NAMESPACE = '/api/v1';

// test block
describe('Simulators GET', () => {
  beforeEach((done) => {
    Simulator.remove({}, (err) => {
      done();
    });
  });

  describe('/simulators', () => {
    it('it should GET no simulators', (done) => {
      chai.request(server).get(NAMESPACE + '/simulators').end((err, res) => {
        res.should.have.status(200);
        res.body.simulators.should.be.a('array');
        res.body.simulators.length.should.be.eql(0);
        done();
      });
    });

    it('it should GET one simulator', (done) => {
      var simulator = new Simulator({ name: 'Test Simulator', endpoint: 'localhost:5000' });
      simulator.save((err, simulator) => {
        chai.request(server).get(NAMESPACE + '/simulators').end((err, res) => {
          res.should.have.status(200);
          res.body.simulators.should.be.a('array');
          res.body.simulators.length.should.be.eql(1);
          res.body.simulators[0].should.have.property('name', 'Test Simulator');
          res.body.simulators[0].should.have.property('endpoint', 'localhost:5000');
          res.body.simulators[0].should.have.property('running', false);
          res.body.simulators[0].should.have.property('_id');
          done();
        });
      });
    });

    it('it should GET two simulators', (done) => {
      var simulator = new Simulator({ name: 'Test Simulator One', endpoint: 'localhost:5000' });
      simulator.save((err, simulator) => {
        simulator = new Simulator({ name: 'Test Simulator Two', endpoint: 'localhost:5001' });
        simulator.save((err, simulator) => {
          chai.request(server).get(NAMESPACE + '/simulators').end((err, res) => {
            res.should.have.status(200);
            res.body.simulators.should.be.a('array');
            res.body.simulators.length.should.be.eql(2);
            res.body.simulators[0].should.have.property('name', 'Test Simulator One');
            res.body.simulators[0].should.have.property('endpoint', 'localhost:5000');
            res.body.simulators[0].should.have.property('running', false);
            res.body.simulators[0].should.have.property('_id');
            res.body.simulators[1].should.have.property('name', 'Test Simulator Two');
            res.body.simulators[1].should.have.property('endpoint', 'localhost:5001');
            res.body.simulators[1].should.have.property('running', false);
            res.body.simulators[1].should.have.property('_id');
            done();
          });
        });
      });
    });
  });

  describe('/simulators/:id', () => {
    it('it should GET no simulator', (done) => {
      chai.request(server).get(NAMESPACE + '/simulators/123').end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.eql({});
        done();
      });
    });

    it('it should GET one simulator', (done) => {
      var simulator = new Simulator({ name: 'Test Simulator', endpoint: 'localhost:5000' });
      simulator.save((err, simulator) => {
        chai.request(server).get(NAMESPACE + '/simulators/' + simulator._id).end((err, res) => {
          res.should.have.status(200);
          res.body.simulator.should.not.be.null;
          res.body.simulator.should.have.property('name', 'Test Simulator');
          res.body.simulator.should.have.property('endpoint', 'localhost:5000');
          res.body.simulator.should.have.property('running', false);
          res.body.simulator.should.have.property('_id');
          done();
        });
      });
    });
  });
});
