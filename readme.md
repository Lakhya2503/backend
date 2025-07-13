# BACKEND SERIES
## part I
- [video link](https://youtu.be/7fjOw8ApZ1I?si=cwaXR16T2kElFWCK&t)

- javascript Backend Roadmap | chai aur backend  00:00:00
- How to deploy backend code in production   00:29:19
- Connect Backend with frontend   01:19:32
- Data Modelling for backend with mongoose  02:10:17
- E-commerce and Hospital management data modelling  03:06:27
- Taking backend to next level  03:56:16
- How to setup a professional backend project  04:06:17
- How to connect database in MERN with debugging  04:47:51
- Custom API response and error handling 05:28:43
- User and video model with hooks and JWT 06:15:38
- How to upload file in backend | Multer 07:05:38 
- HTTP crash course 07:43:59
- Complete guide for router and controller 08:08:17
- Logic building - Register controller 08:37:51
- How to use postman for backend 09:30:39

## part II

- [video link](https://youtu.be/8k-kK3tsJFY?si=r00BQ8DJvjAgffQ4)

- Access token and refresh token  00:00:00
- Writing update controller for user  01::32:52
- Understand the subscription schema  02:16:06
- Learn mongoDB aggregation pipelines 02:36:17
- How to write sub pipelines and routes 03:13:01
- Summary so far  03:43:15

## 

# HTTP
- Hyper Text Transfer Protocol

### What are HTTP headers
- metadata -> key-value sent along with request & response

- caching , authentication, manage state
-- x-prefix -> 2012 (x-deprecated)

- Request Headers -> from client
- Response Header -> from server
- Representation Headers -> encoding / compression
- Payload Headers -> data



## Most Common Headers
- Accept: application/json
- User - Agent
- Authentication
- Content- Type
- Cookie
- Cache - Control

## CORS
- Access - Control - Allow - Origin
- Access - Contol - Allow - Credentials
- Access - Control - Allow- Method

## Security
- Cross - Origin - Embedders - Policy
- Cross - Origin - Opener - Policy
- Content - Security - Policy
- X -XSS - Protection


## HTTP methods

- Basic set of operations that can be used to interact with server

- GET : retrive a resource
- HEAD : No message body ( response headers only )
- OPTIONS : what operations are available
- TRACE : loopback test ( get some data )
- DELETE : remove a resource
- PUT : replace a resurce
- POST : interact with resource ( mostly add )
- PATCH : change part of a resource

## HTTP status code
- 1** :  Informational
- 2** : Success
- 3** : Redirection
- 4** : Client error
- 5** : Server error

### some points
##


- 100 : Continue
- 102 : Processing
- 200 : Ok
- 201 : Created
- 202 : Accepted
- 307 : temprory redirect
- 308 : permant redirect
- 400 : Bad request
- 401 : Uauthorised
- 402 : Payment required
- 404 : Not Found
- 500 : Internal Server Error
- 504 : Gatway time out

##

## Access Tokens & Refresh Tokens

## Core Concepts

- 🔐 **Access Token**: Short-lived key for API access (typically 1 hour)
- 🔄 **Refresh Token**: Long-lived key to get new access tokens (days/months)
- 🔗 **Flow**: User auth → both tokens issued → access token used until expiry → refresh token gets new access token


```
/**
 * COMPLETE TOKEN AUTH WORKFLOW FOR MARKDOWN FILES
 * 
 * This file demonstrates:
 * 1. Authentication server that issues tokens
 * 2. Protected API server for markdown files
 * 3. Client implementation with token refresh logic
 * 
 * Run with: node thisfile.js
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const axios = require('axios');

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
  SECRET: 'your-secret-key-here',
  ACCESS_TOKEN_LIFE: '15m',  // Short-lived (15 minutes)
  REFRESH_TOKEN_LIFE: '7d',  // Long-lived (7 days)
  PORT: {
    AUTH: 3000,
    API: 4000
  }
};

// Mock database
const users = [{ id: 1, username: 'md_user', password: 'md_pass' }];
const markdownFiles = {
  'example': '# Hello Markdown\n\nThis is protected content!',
  'notes': '## Secure Notes\n\n- Never store tokens in MD files'
};

// ============================================================================
// AUTHENTICATION SERVER (Issues tokens)
// ============================================================================
function startAuthServer() {
  const app = express();
  app.use(express.json());

  // Login endpoint - issues both tokens
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) return res.sendStatus(401);

    const accessToken = jwt.sign({ userId: user.id }, CONFIG.SECRET, { 
      expiresIn: CONFIG.ACCESS_TOKEN_LIFE 
    });
    
    const refreshToken = jwt.sign({ userId: user.id }, CONFIG.SECRET, { 
      expiresIn: CONFIG.REFRESH_TOKEN_LIFE 
    });
    
    res.json({ accessToken, refreshToken });
  });

  // Refresh endpoint - issues new access token
  app.post('/refresh', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(401);

    try {
      const decoded = jwt.verify(refreshToken, CONFIG.SECRET);
      const newAccessToken = jwt.sign(
        { userId: decoded.userId }, 
        CONFIG.SECRET, 
        { expiresIn: CONFIG.ACCESS_TOKEN_LIFE }
      );
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      res.sendStatus(403); // Invalid/expired refresh token
    }
  });

  app.listen(CONFIG.PORT.AUTH, () => 
    console.log(`Auth server running on port ${CONFIG.PORT.AUTH}`));
}

// ============================================================================
// API SERVER (Protected markdown files)
// ============================================================================
function startApiServer() {
  const app = express();

  // Authentication middleware
  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // Bearer <token>
    
    if (!token) return res.sendStatus(401);

    jwt.verify(token, CONFIG.SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Invalid/expired token
      req.user = user;
      next();
    });
  };

  // Protected markdown file endpoint
  app.get('/markdown/:filename', authenticateToken, (req, res) => {
    const filename = req.params.filename;
    
    if (!markdownFiles[filename]) {
      return res.status(404).send('Markdown file not found');
    }
    
    res.type('text/markdown').send(markdownFiles[filename]);
  });

  app.listen(CONFIG.PORT.API, () => 
    console.log(`API server running on port ${CONFIG.PORT.API}`));
}

// ============================================================================
// CLIENT IMPLEMENTATION (Demonstrates workflow)
// ============================================================================
async function demonstrateClientFlow() {
  let accessToken = '';
  let refreshToken = '';

  // Helper function to make authenticated requests
  async function fetchMarkdown(filename) {
    try {
      const response = await axios.get(
        `http://localhost:${CONFIG.PORT.API}/markdown/${filename}`, 
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      console.log(`✅ [${filename}.md] Success:\n${response.data}\n`);
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('🔄 Access token expired, refreshing...');
        await refreshTokens();
        await fetchMarkdown(filename); // Retry with new token
      } else {
        console.error(`❌ Error: ${error.message}`);
      }
    }
  }

  // Refresh token logic
  async function refreshTokens() {
    const response = await axios.post(`http://localhost:${CONFIG.PORT.AUTH}/refresh`, {
      refreshToken
    });
    accessToken = response.data.accessToken;
  }

  // 1. First login to get tokens
  console.log('🔐 Logging in to get tokens...');
  const loginRes = await axios.post(`http://localhost:${CONFIG.PORT.AUTH}/login`, {
    username: 'md_user',
    password: 'md_pass'
  });
  
  accessToken = loginRes.data.accessToken;
  refreshToken = loginRes.data.refreshToken;
  console.log('🔑 Received tokens:\n- Access Token:', accessToken.slice(0, 20) + '...\n');

  // 2. Access protected markdown files
  console.log('📄 Requesting markdown files...');
  await fetchMarkdown('example');
  await fetchMarkdown('notes');

  // 3. Simulate token expiration (after ACCESS_TOKEN_LIFE)
  console.log(`⏳ Waiting for token expiration (${CONFIG.ACCESS_TOKEN_LIFE})...`);
  setTimeout(async () => {
    console.log('\n🕒 Token should be expired now...');
    await fetchMarkdown('example'); // Will trigger refresh flow
  }, 16 * 60 * 1000); // 16 minutes (longer than 15m token life)
}

// ============================================================================
// START ALL SERVERS AND DEMONSTRATE FLOW
// ============================================================================
startAuthServer();
startApiServer();

// Give servers a second to start
setTimeout(demonstrateClientFlow, 1000);
```

## Agregation Pipeline
- Aggregation pipeline is a framework for data aggregation in MongoDB
- It allows you to process data records and return computed results
- It is similar to SQL GROUP BY but more powerful
- It consists of multiple stages, each performing an operation on the data
- Each stage transforms the data and passes it to the next stage
- Stages are defined using the `$` operator
- Common stages include `$match`, `$group`, `$sort`, `$project`, and `$lookup`
- Aggregation pipelines can be used for complex queries, data transformations, and analytics
- They can handle large datasets efficiently


# Access Tokens & Refresh Tokens
- Access tokens are short-lived credentials used to access protected resources.
- Refresh tokens are long-lived credentials used to obtain new access tokens.
- Access tokens are typically valid for a few minutes to an hour.
- Refresh tokens can be valid for days or months.
- The flow involves the user authenticating, receiving both tokens, using the access token until it expires, and then using the refresh token to obtain a new access token.
