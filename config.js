/**
 * File: config.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 23.06.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

module.exports = {
  databaseName: 'VILLAS',
  databaseURL: 'mongodb://mongo:27017/',
  port: 3000,
  secret: 'longsecretislong',
  admin: {
    username: 'admin',
    password: 'admin'
  }
}
