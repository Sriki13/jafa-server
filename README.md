# Server side of JAFA for the Programmable Web course

Secure requests require authentication via JSON Web token. 

Tokens can be acquired with valid credentials with the [user API](https://jafa-server.herokuapp.com/apidoc/#api-user-PostJafaApiUsersAuthenticate).


## Server deployment address and documentation on Heroku

https://jafa-server.herokuapp.com/apidoc/
(can take up to 30 seconds to start)

## Client deployment address on Heroku

https://jafa-polytech.herokuapp.com
(can also take up to 30 seconds to start)

## Client code base address

https://github.com/fitzzzz/jafa-client

# Libraries used

## Main

* [Express](https://expressjs.com/fr/) for standard api setup
* [MongoDB node driver](https://www.npmjs.com/package/mongodb/) for database access
* [Apidoc](http://apidocjs.com/) for documentation
* We follow this tutorial to implements authentication : http://jasonwatmore.com/post/2018/06/14/nodejs-mongodb-simple-api-for-authentication-registration-and-user-management
  * [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
  * [express-jwt](https://github.com/auth0/express-jwt)

## Testing

* [Mocha](https://mochajs.org/) as our main testing framework
* [Supertest](https://www.npmjs.com/package/supertest) for high level API testing
* [http-status-codes](https://www.npmjs.com/package/http-status-codes) for convenience
