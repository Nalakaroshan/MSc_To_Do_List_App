# Use the official Node.js image as the base
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (for production)
RUN npm run build

# Use a lightweight web server to serve the built files
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose the default port for NGINX
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
