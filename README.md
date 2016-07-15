# VILLASweb-backend

## Description
This is the backend for the VILLASweb frontend. It is build upon NodeJS, Express and MongoDB.

## To-Do
 - Don't send user password (select: false)
 - Only get projects which are accessible by the user
 - Add support for config.js with docker volumes
 - Add support for key-secret for bcrypt
 - Let user change own properties if not admin
 - Add local console log to res.send(err) calls
 - Add proper 404 to all routes
 - Add proper error messages to all routes
 - Handle missing objects (e.g. visualization is removed and belonging project does not exist anymore)
 - Save model creation date
