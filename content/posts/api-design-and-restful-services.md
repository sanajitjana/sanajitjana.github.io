+++
title = 'API Design and RESTful Services'
date = '2025-09-16T09:30:00+05:30'
draft = false
categories = ["API"]
tags = ["API Design", "REST", "GraphQL", "OpenAPI", "Microservices"]
+++

# API Design and RESTful Services

Well-designed APIs are the backbone of modern applications. In this post, we'll explore RESTful API design principles and best practices.

## REST Principles

### 1. Stateless
Each request contains all information needed to process it. No server-side session state.

### 2. Client-Server Architecture
Clear separation between client and server concerns.

### 3. Cacheable
Responses must define themselves as cacheable or not.

### 4. Uniform Interface
Consistent resource identification and manipulation.

### 5. Layered System
Client cannot tell if it's connected directly to server or through intermediaries.

## Resource Design

### RESTful Resource Naming

```
GET    /users          # List all users
GET    /users/123      # Get user with ID 123
POST   /users          # Create new user
PUT    /users/123      # Update user 123
DELETE /users/123      # Delete user 123

GET    /users/123/posts    # Get posts by user 123
POST   /users/123/posts    # Create post for user 123
GET    /posts/456/comments # Get comments for post 456
```

### HTTP Status Codes

```javascript
// Success responses
200 OK                    // Request succeeded
201 Created              // Resource created
204 No Content           // Request succeeded, no content returned

// Client error responses
400 Bad Request          // Invalid request syntax
401 Unauthorized         // Authentication required
403 Forbidden           // Access denied
404 Not Found           // Resource not found
409 Conflict            // Request conflicts with current state
422 Unprocessable Entity // Validation errors

// Server error responses
500 Internal Server Error
502 Bad Gateway
503 Service Unavailable
```

## Express.js REST API Example

```javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data store (replace with database in production)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// GET /users - List all users
app.get('/users', (req, res) => {
  const { page = 1, limit = 10, search } = req.query;

  let filteredUsers = users;

  if (search) {
    filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: paginatedUsers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredUsers.length,
      pages: Math.ceil(filteredUsers.length / limit)
    }
  });
});

// GET /users/:id - Get single user
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  res.json({
    success: true,
    data: user
  });
});

// POST /users - Create new user
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  // Validation
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: 'Name and email are required'
    });
  }

  // Check if email already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      error: 'Email already exists'
    });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    data: newUser
  });
});

// PUT /users/:id - Update user
app.put('/users/:id', (req, res) => {
  const { name, email } = req.body;
  const userId = parseInt(req.params.id);

  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // Check if email conflicts with another user
  if (email && email !== users[userIndex].email) {
    const emailExists = users.find(u => u.email === email && u.id !== userId);
    if (emailExists) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }
  }

  users[userIndex] = {
    ...users[userIndex],
    ...(name && { name }),
    ...(email && { email })
  };

  res.json({
    success: true,
    data: users[userIndex]
  });
});

// DELETE /users/:id - Delete user
app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  users.splice(userIndex, 1);

  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
```

## API Documentation with OpenAPI

```yaml
openapi: 3.0.0
info:
  title: User Management API
  version: 1.0.0
  description: A simple user management API

servers:
  - url: http://localhost:3000
    description: Development server

paths:
  /users:
    get:
      summary: Get all users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 10
        - name: search
          in: query
          schema:
            type: string
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
                  pagination:
                    $ref: '#/components/schemas/Pagination'

    post:
      summary: Create a new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - name
                - email
              properties:
                name:
                  type: string
                email:
                  type: string
                  format: email
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    $ref: '#/components/schemas/User'

  /users/{id}:
    get:
      summary: Get a user by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    $ref: '#/components/schemas/User'
        '404':
          description: User not found

    put:
      summary: Update a user
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                email:
                  type: string
                  format: email
      responses:
        '200':
          description: User updated successfully
        '404':
          description: User not found

    delete:
      summary: Delete a user
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '204':
          description: User deleted successfully
        '404':
          description: User not found

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        email:
          type: string
          format: email
      required:
        - id
        - name
        - email

    Pagination:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer
        pages:
          type: integer
```

## GraphQL vs REST

### REST Advantages
- Simple and familiar
- Good caching support
- Stateless by design
- Easy to understand and debug

### REST Disadvantages
- Over-fetching or under-fetching data
- Multiple round trips for complex data requirements
- Versioning challenges
- Fixed response structure

### GraphQL Advantages
- Single endpoint for all data needs
- Client specifies exactly what data it needs
- Strongly typed schema
- Real-time capabilities with subscriptions

### GraphQL Disadvantages
- More complex to implement
- Caching is more challenging
- Learning curve for developers
- Potential for complex queries (N+1 problem)

## API Security Best Practices

### 1. Authentication and Authorization

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Authorization middleware
const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Usage
app.get('/admin/users', authenticateToken, authorizeRole('admin'), (req, res) => {
  // Admin-only endpoint
});
```

### 2. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
```

### 3. Input Validation and Sanitization

```javascript
const Joi = require('joi');

// Validation schema
const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(18).max(120)
});

// Validation middleware
const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    });
  }
  next();
};

app.post('/users', validateUser, (req, res) => {
  // Create user logic
});
```

## API Versioning Strategies

### 1. URL Versioning
```
GET /v1/users
GET /v2/users
```

### 2. Header Versioning
```
GET /users
Headers: Accept: application/vnd.api.v1+json
```

### 3. Query Parameter Versioning
```
GET /users?version=1
```

## Testing APIs

### Unit Testing with Jest

```javascript
const request = require('supertest');
const app = require('../app');

describe('Users API', () => {
  beforeEach(() => {
    // Reset test data
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      const response = await request(app)
        .get('/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/users?page=1&limit=5')
        .expect(200);

      expect(response.body.data).toHaveLength(5);
      expect(response.body.pagination).toBeDefined();
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/users')
        .send(newUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(newUser.name);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/users')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
});
```

## Best Practices Summary

1. **Use Consistent Naming**: Follow REST conventions for resource naming
2. **Implement Proper HTTP Status Codes**: Use appropriate status codes for different scenarios
3. **Version Your APIs**: Plan for future changes with proper versioning
4. **Document Thoroughly**: Use OpenAPI/Swagger for comprehensive documentation
5. **Implement Security**: Authentication, authorization, input validation, rate limiting
6. **Handle Errors Gracefully**: Provide meaningful error messages
7. **Cache Appropriately**: Use HTTP caching headers and implement caching strategies
8. **Monitor and Log**: Track API usage, performance, and errors
9. **Test Extensively**: Unit tests, integration tests, and end-to-end tests
10. **Consider GraphQL**: For complex data requirements and mobile applications

Well-designed APIs are essential for building scalable, maintainable applications. Following these principles and best practices will help you create robust, secure, and developer-friendly APIs.