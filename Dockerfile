FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Create public directory
RUN mkdir -p /usr/src/app/public

# Bundle app source
COPY . /usr/src/app

# Run the app
EXPOSE 4000
CMD [ "npm", "start" ]
