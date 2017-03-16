# VILLASweb-backend

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

