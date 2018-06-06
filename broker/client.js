/**
 * File: client.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 03.03.2018
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

// include modules
const amqp = require('amqplib/callback_api');

// local include
const logger = require('../utils/logger');
const Simulator = require('../models/simulator');

const VILLAS_EXCHANGE = 'villas';

// amqp client class
class AMQPClient {
  constructor() {
    this._channel = null;
    this._connection = null;
  }

  connect(endpoint, callback) {
    // try to connect
    amqp.connect(endpoint, (err, connection) => {
      if (err) {
        if (callback != null) {
          callback(err);
        }

        return;
      }

      this._connection = connection;

      // create channel
      this._channel = this._connection.createChannel();
      this._channel.assertExchange(VILLAS_EXCHANGE, 'headers');

      // add message queue
      const simulatorQueue = this._channel.assertQueue();
      this._channel.bindQueue(simulatorQueue.queue, VILLAS_EXCHANGE, '', { category: 'simulator' });
      this._channel.consume(simulatorQueue.queue, msg => {
        // only handle status responses
        // TODO: Check if content is in wrong format, docu says "status" wrapped content
        const content = JSON.parse(msg.content.toString());
        if ('action' in content) {
          return;
        }
        
        // update model for this simulator
        Simulator.findOne({ uuid: content.properties.uuid }, (err, simulator) => {
          if (err) {
            logger.error('Unable to find simulator: ' + err);
            return;
          }

          if (simulator == null) {
            logger.info('Simulator with uuid "' + content.properties.uuid + '" not found, creating one');

            // model not found
            simulator = new Simulator({ uuid: content.properties.uuid });
          }

          // update existing model
          simulator.host = content.host;
          simulator.model = content.model;
          simulator.uptime = content.uptime;
          simulator.state = content.state;
          simulator.rawProperties = content.properties;

          simulator.save(err => {
            if (err) {
              logger.error('Unable to save simulator update: ' + err);
              return;
            }

            logger.debug('Simulator with uuid "' + simulator.uuid + '" updated');
          });
        });
      });

      if (callback != null) {
        callback();
      }
    });
  }

  ping() {
    this._sendAction({ action: 'ping' });
  }

  resetSimulator(uuid, when) {
    const data = { 
      action: 'reset', 
      when
    };

    this._sendAction(data, uuid);
  }

  shutdownSimulator(uuid, when) {
    const data = { 
      action: 'shutdown', 
      when
    };

    this._sendAction(data, uuid);
  }

  startSimulator(uuid, when) {
    const data = { 
      action: 'start', 
      when
    };

    this._sendAction(data, uuid);
  }

  stopSimulator(uuid, when) {
    const data = { 
      action: 'stop', 
      when
    };

    this._sendAction(data, uuid);
  }

  pauseSimulator(uuid, when) {
    const data = { 
      action: 'pause', 
      when
    };

    this._sendAction(data, uuid);
  }

  resumeSimulator(uuid, when) {
    const data = { 
      action: 'resume', 
      when
    };

    this._sendAction(data, uuid);
  }

  _sendAction(data, uuid = null) {
    const opts = { headers: { category: 'simulator' }, priority: 0, deliveryMode: 2, contentType: 'application/json', contentEncoding: 'utf-8' }; 

    if (uuid != null) {
      opts.headers.uuid = uuid;
    }

    this._channel.publish(VILLAS_EXCHANGE, '', new Buffer(JSON.stringify(data)), opts);
  }
};

module.exports = new AMQPClient();
