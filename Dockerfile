## 
## Dockerfile for Data Mapping Tool.
## 

# https://hub.docker.com/_/node/
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the application source code to the container
COPY . .

# Install project dependencies
#RUN npm install -g yarn
RUN yarn install

# 
RUN yarn workspace backend prisma migrate dev --name init

# Build frontend module
RUN yarn workspace frontend build

# Expose the port your Nest.js application is listening on
EXPOSE 3000

# Command to start Nest.js application
CMD ["yarn", "workspace", "backend", "start"]
