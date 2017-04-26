# <img src="doc/pictures/villas_web.png" width=40 /> VILLASweb-backend

## Description
This is the server for the VILLASweb website. The term __frontend__ refers to this project, the server the website (frontend) is talking to.
The backend serves the database content to the website, handles authentication and persistent storage of content. It does __not__ handle simulation data. For this have a look at VILLASnode.

To work properly the backend needs to connect to a [MongoDB](https://www.mongodb.com) database instance.

## Frameworks
The backend is build upon [NodeJS](https://nodejs.org/en/), [Express](https://expressjs.com) and [Mongoose](http://mongoosejs.com).

## Quick start

First ensure a MongoDB instance is running and properly configured in config.json. The easiest way to start a local MongoDB is `docker run -d -it -p 27017:27017 mongo`.

Before the first start all required packages need to be installed with `npm install`.

To start the backend execute `npm start`.

## Copyright

2017, Institute for Automation of Complex Power Systems, EONERC  

## License

This project is released under the terms of the [GPL version 3](COPYING.md).

```
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
```

For other licensing options please consult [Prof. Antonello Monti](mailto:amonti@eonerc.rwth-aachen.de).

## Contact

[![EONERC ACS Logo](doc/pictures/eonerc_logo.png)](http://www.acs.eonerc.rwth-aachen.de)

 - Markus Grigull <mgrigull@eonerc.rwth-aachen.de>

[Institute for Automation of Complex Power Systems (ACS)](http://www.acs.eonerc.rwth-aachen.de)  
[EON Energy Research Center (EONERC)](http://www.eonerc.rwth-aachen.de)  
[RWTH University Aachen, Germany](http://www.rwth-aachen.de)  