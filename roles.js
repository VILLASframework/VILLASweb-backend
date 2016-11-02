/**
 * File: roles.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 20.10.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

module.exports = {
  admin: {
    name: 'Admin',
    description: '',
    resource: {
      user: [ 'create', 'read', 'update', 'delete' ],
      simulator: [ 'create', 'read', 'update', 'delete' ],
      simulation: [ 'create', 'read', 'update', 'delete' ],
      simulationModel: [ 'create', 'read', 'update', 'delete' ],
      project: [ 'create', 'read', 'update', 'delete' ],
      visualization: [ 'create', 'read', 'update', 'delete' ]
    }
  },
  user: {
    name: 'User',
    description: '',
    resource: {
      project: [ 'create', 'read', 'update', 'delete' ],
      visualization: [ 'create', 'read', 'update', 'delete' ]
    }
  },
  guest: {
    name: 'Guest',
    description: '',
    resource: {
      project: [ 'read' ],
      visualization: [ 'read' ]
    }
  }
}
