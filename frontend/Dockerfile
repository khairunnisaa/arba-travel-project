# Stage 1: Build React App
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code and build the React app
COPY . ./
RUN npm run build

# Stage 2: Serve React App with Nginx
FROM nginx:alpine

# Copy built React files to Nginx's default public directory
COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
