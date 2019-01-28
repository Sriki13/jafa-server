// This file is from the tutorial :
//    http://jasonwatmore.com/post/2018/06/14/nodejs-mongodb-simple-api-for-authentication-registration-and-user-management


const expressJwt = require('express-jwt');
const config = require('../config.json');
const userService = require('../api/domain/users.controller');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/jafa/api/users/authenticate',
            '/jafa/api/users/register',
            '/jafa/api/foods',
            '/foods/:id',
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};