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