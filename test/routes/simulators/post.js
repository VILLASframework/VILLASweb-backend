/**
 * File: post.js
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
describe('Simulators POST', () => {
  beforeEach((done) => {
    Simulator.remove({}, (err) => {
      done();
    });
  });

  describe('/simulators', () => {
    it('it should ADD a simulator', (done) => {
      chai.request(server).post(NAMESPACE + '/simulators').send({
        simulator: {
          name: 'Test Simulator',
          endpoint: 'localhost:5000'
        }
      }).end((err, res) => {
        res.should.have.status(200);
        res.body.simulator.should.not.be.null;
        res.body.simulator.should.have.property('name', 'Test Simulator');
        res.body.simulator.should.have.property('endpoint', 'localhost:5000');
        res.body.simulator.should.have.property('running', false);
        res.body.simulator.should.have.property('_id');
        done();
      });
    });

    it('it should not ADD a simulator with wrong body', (done) => {
      chai.request(server).post(NAMESPACE + '/simulators').send({
        name: 'Test Simulator',
        endpoint: 'localhost:5000'
      }).end((err, res) => {
        res.should.have.status(400);
        done();
      });
    });

    it('it should not ADD a simulator with missing property', (done) => {
      chai.request(server).post(NAMESPACE + '/simulators').send({
        simulator: {
          name: 'Test Simulator'
        }
      }).end((err, res) => {
        res.should.have.status(400);
        done();
      });
    });

    it('it should ADD a simulator with ignored unknown property', (done) => {
      chai.request(server).post(NAMESPACE + '/simulators').send({
        simulator: {
          name: 'Test Simulator',
          endpoint: 'localhost:5000',
          prop: 'value'
        }
      }).end((err, res) => {
        res.should.have.status(200);
        res.body.simulator.should.have.property('name', 'Test Simulator');
        res.body.simulator.should.have.property('endpoint', 'localhost:5000');
        res.body.simulator.should.have.property('running', false);
        res.body.simulator.should.have.property('_id');
        done();
      });
    });
  });
});
