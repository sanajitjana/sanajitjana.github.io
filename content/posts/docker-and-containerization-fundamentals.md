+++
title = 'Docker and Containerization Fundamentals'
date = '2025-09-13T09:22:00+05:30'
draft = false
categories = ["DevOps"]
tags = ["Docker", "Containers", "DevOps", "Deployment"]
+++

# Docker and Containerization Fundamentals

Docker has revolutionized how we develop, ship, and run applications. In this post, we'll explore the core concepts of containerization and Docker.

## What is Docker?

Docker is a platform for developing, shipping, and running applications in containers. Containers are lightweight, portable, and self-sufficient units that can run applications and their dependencies.

## Why Use Docker?

### 1. Consistency
- Same environment from development to production
- No more "works on my machine" issues

### 2. Isolation
- Applications run in their own containers
- Dependencies don't conflict with each other

### 3. Portability
- Run anywhere Docker runs
- Easy deployment across different platforms

## Basic Docker Commands

```bash
# Build an image
docker build -t my-app .

# Run a container
docker run -d -p 8080:8080 my-app

# List running containers
docker ps

# Stop a container
docker stop container_id

# Remove a container
docker rm container_id
```

## Dockerfile Example

```dockerfile
# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

## Docker Compose for Multi-Container Apps

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db

  db:
    image: postgres:13
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Best Practices

1. **Use Multi-Stage Builds**: Reduce image size by using multiple build stages
2. **Don't Run as Root**: Create non-root users for security
3. **Use .dockerignore**: Exclude unnecessary files from build context
4. **Tag Images Properly**: Use semantic versioning for image tags
5. **Keep Images Small**: Use alpine images and clean up cache

## Docker vs Virtual Machines

| Aspect | Docker Containers | Virtual Machines |
|--------|------------------|------------------|
| Startup Time | Seconds | Minutes |
| Resource Usage | Minimal overhead | Full OS overhead |
| Portability | Highly portable | Less portable |
| Isolation | Process-level | Hardware-level |

Docker containers provide a lightweight, efficient way to package and deploy applications, making them ideal for modern development workflows.