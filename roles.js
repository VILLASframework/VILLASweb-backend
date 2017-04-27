/**
 * File: roles.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 20.10.2016
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
