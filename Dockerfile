# Use the official Node.js image from the Docker Hub
FROM node:alpine

# Install dependencies
RUN apk add --no-cache python3 py3-pip python3-dev build-base

# Create and set the working directory
WORKDIR /usr/src/node-app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install application dependencies
RUN yarn install --pure-lockfile

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["yarn", "start"]
