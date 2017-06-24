/**
 * File: logger.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 24.05.2017
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
var winston = require('winston');

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      prettyPrint: false,
      colorize: true,
      timestamp: function() {
        return new Intl.DateTimeFormat('de-DE', {
          hour12: false,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }).format(Date.now());
      }
    }),
    new winston.transports.File({
      filename: 'log.txt',
      tailable: true,
      maxsize: 32768,
      maxFiles: 32,
      json: false,
      silent: true,
      timestamp: function() {
        return new Intl.DateTimeFormat('de-DE', {
          hour12: false,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }).format(Date.now());
      }
    })
  ]
});

module.exports = logger;
