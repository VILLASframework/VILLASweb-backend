FROM node:argon

# Bundle app source
COPY . .

# Install dependencies
RUN npm install

# Run the app
EXPOSE 4000
CMD [ "npm", "start" ]
