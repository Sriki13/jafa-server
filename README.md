# Server side of JAFA for the Programmable Web course

Secure requests require authentication via JSON Web token. 

Tokens can be acquired with valid credentials with the [user API](https://jafa-server.herokuapp.com/apidoc/#api-user-PostJafaApiUsersAuthenticate).


## Server deployment address and documentation on Heroku

https://jafa-server.herokuapp.com/apidoc/
(can also take up to 30 seconds to start)

## Client deployment address on Heroku

https://jafa-polytech.herokuapp.com
(can take up to 30 seconds to start)

## Client code base address

https://github.com/fitzzzz/jafa-client

# Libraries used :

## Main

* [Express](https://expressjs.com/fr/) for Heroku Deployment
* [MongoDB node driver](https://www.npmjs.com/package/mongodb/) for database access
* [Apidoc](http://apidocjs.com/) for documentation
* [JSON Web Tokens](https://jwt.io/) for authentication

## Testing

* [Mocha](https://mochajs.org/) as our main testing framework
* [Supertest](https://www.npmjs.com/package/supertest) for high level API testing
* [http-status-codes](https://www.npmjs.com/package/http-status-codes) for convenience