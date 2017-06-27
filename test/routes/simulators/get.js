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
const NAMESPACE = '/api/v1';

chai.use(chaiHttp);

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
  });

  describe('/simulators', () => {
    it('it should GET one simulator', (done) => {
      var simulator = new Simulator({ name: 'Test Simulator', endpoint: 'localhost:5000' });
      simulator.save((err, simulator) => {
        chai.request(server).get(NAMESPACE + '/simulators').end((err, res) => {
          res.should.have.status(200);
          res.body.simulators.should.be.a('array');
          res.body.simulators.length.should.be.eql(1);
          done();
        });
      });
    });
  });

  describe('/simulators', () => {
    it('it should GET two simulators', (done) => {
      var simulator = new Simulator({ name: 'Test Simulator One', endpoint: 'localhost:5000' });
      simulator.save((err, simulator) => {
        simulator = new Simulator({ name: 'Test Simulator Two', endpoint: 'localhost:5001' });
        simulator.save((err, simulator) => {
          chai.request(server).get(NAMESPACE + '/simulators').end((err, res) => {
            res.should.have.status(200);
            res.body.simulators.should.be.a('array');
            res.body.simulators.length.should.be.eql(2);
            done();
          });
        });
      });
    });
  });
});
