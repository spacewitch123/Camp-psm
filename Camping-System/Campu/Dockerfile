# Use an official Node.js image as the base image
FROM node:14 AS build

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite application
RUN npm build

# Use a lightweight Node.js image for production
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy the built artifacts from the previous stage
COPY --from=build /app/dist ./dist

# Install serve to serve the application
RUN npm global add serve

# Expose the port on which the app will run
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]
