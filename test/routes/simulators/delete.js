/**
 * File: delete.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 28.06.2017
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

  describe('/simulators/:id', () => {
    it('it should DELETE no simulator', (done) => {
      chai.request(server).delete(NAMESPACE + '/simulators/xyz').end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.eql({});
        done();
      });
    });

    it('it should DELETE a simulator', (done) => {
      var simulator = new Simulator({ name: 'Test Simulator', endpoint: 'localhost:5000' });
      simulator.save((err, simulator) => {
        chai.request(server).delete(NAMESPACE + '/simulators/' + simulator._id).end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.eql({});
          done();
        });
      });
    });

    it('it should not DELETE any simulator', (done) => {
      var simulator = new Simulator({ name: 'Test Simulator', endpoint: 'localhost:5000' });
      simulator.save((err, simulator) => {
        chai.request(server).delete(NAMESPACE + '/simulators/xyz').end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.eql({});
          done();
        });
      });
    });
  });
});
