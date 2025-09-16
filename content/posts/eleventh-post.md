+++
title = 'Cybersecurity and Secure Coding Practices'
date = '2025-09-16T09:26:00+05:30'
draft = false
categories = ["Security"]
tags = ["Cybersecurity", "Security", "OWASP", "Encryption", "Authentication"]
+++

# Cybersecurity and Secure Coding Practices

Security should be a fundamental part of software development. In this post, we'll explore essential security practices and common vulnerabilities.

## OWASP Top 10 Security Risks

### 1. Injection Attacks

**SQL Injection Prevention:**
```java
// Vulnerable code
String query = "SELECT * FROM users WHERE id = " + userId;

// Secure code using PreparedStatement
PreparedStatement stmt = connection.prepareStatement(
    "SELECT * FROM users WHERE id = ?"
);
stmt.setInt(1, userId);
ResultSet rs = stmt.executeQuery();
```

**Command Injection Prevention:**
```python
# Vulnerable
os.system(f"ls {user_input}")

# Secure
import subprocess
subprocess.run(["ls", user_input], shell=False)
```

### 2. Broken Authentication

**Secure Password Hashing:**
```javascript
const bcrypt = require('bcrypt');

// Hash password
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

**JWT Implementation:**
```javascript
const jwt = require('jsonwebtoken');

// Create token
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### 3. Sensitive Data Exposure

**Data Encryption:**
```python
from cryptography.fernet import Fernet

# Generate key
key = Fernet.generate_key()
cipher = Fernet(key)

# Encrypt data
encrypted_data = cipher.encrypt(b"Sensitive information")

# Decrypt data
decrypted_data = cipher.decrypt(encrypted_data)
```

### 4. XML External Entity (XXE) Attacks

**Prevention in Java:**
```xml
<!-- Vulnerable -->
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>

<!-- Secure -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
  <!ENTITY xxe "Safe content">
]>
```

```java
// Disable external entities
DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
dbf.setFeature("http://xml.org/sax/features/external-general-entities", false);
dbf.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
```

## Secure Coding Practices

### 1. Input Validation and Sanitization

```javascript
// Client-side validation (not sufficient alone)
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Server-side validation
const validator = require('validator');

if (!validator.isEmail(req.body.email)) {
  return res.status(400).json({ error: 'Invalid email format' });
}
```

### 2. HTTPS and SSL/TLS

**Force HTTPS in Express:**
```javascript
const express = require('express');
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Force HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

### 3. Cross-Site Scripting (XSS) Prevention

**React XSS Prevention:**
```jsx
// Vulnerable
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// Secure
<div>{userInput}</div> // React automatically escapes

// Or use DOMPurify for rich content
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

### 4. Cross-Site Request Forgery (CSRF) Protection

```javascript
const csrf = require('csurf');

// CSRF protection middleware
app.use(csrf({ cookie: true }));

// Include CSRF token in forms
app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});
```

## Security Headers

```javascript
// Express security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

## Authentication and Authorization

### Role-Based Access Control (RBAC)

```typescript
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

interface User {
  id: number;
  role: UserRole;
}

function hasPermission(user: User, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    [UserRole.GUEST]: 0,
    [UserRole.USER]: 1,
    [UserRole.ADMIN]: 2
  };

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

// Usage
if (!hasPermission(currentUser, UserRole.ADMIN)) {
  throw new Error('Insufficient permissions');
}
```

## Security Testing

### 1. Static Application Security Testing (SAST)

```bash
# Run security scan with ESLint
npx eslint --ext .js,.jsx,.ts,.tsx src/ --config .eslintrc.security.js

# Use tools like SonarQube
sonar-scanner
```

### 2. Dependency Vulnerability Scanning

```bash
# Check for vulnerable dependencies
npm audit
npm audit fix

# Use Snyk for comprehensive scanning
npx snyk test
npx snyk monitor
```

## Incident Response

1. **Detection**: Monitor logs and alerts
2. **Assessment**: Evaluate the scope and impact
3. **Containment**: Isolate affected systems
4. **Recovery**: Restore systems from backups
5. **Lessons Learned**: Document and improve processes

## Best Practices Summary

- **Defense in Depth**: Multiple layers of security
- **Principle of Least Privilege**: Minimum required permissions
- **Fail-Safe Defaults**: Secure by default configuration
- **Regular Updates**: Keep dependencies and systems updated
- **Security Training**: Educate development team
- **Continuous Monitoring**: Log and monitor everything

Security is an ongoing process that requires vigilance at every stage of development. Implementing these practices significantly reduces the risk of security breaches.