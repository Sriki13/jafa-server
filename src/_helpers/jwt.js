// This file is from the tutorial :
//    http://jasonwatmore.com/post/2018/06/14/nodejs-mongodb-simple-api-for-authentication-registration-and-user-management


const expressJwt = require('express-jwt');
const config = require('../config.json');
const userService = require('../api/domain/users.controller');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({secret, isRevoked}).unless({
        path: [
            // public routes that don't require authentication
            '/jafa/api/users/authenticate',
            '/jafa/api/users/register',
            '/jafa/api/foods',
            "/jafa/api/stores",
            "/jafa/api/regions",
            "/apidoc",
            {url: /apidoc\/.*/, methods: ['GET']},
            {url: "/jafa/api/recipes", methods: ["GET"]},
            {url: "/jafa/api/recipes", methods: ['OPTIONS']},

            {url: /\/jafa\/api\/foods\/.*/, methods: ['GET']},
            {url: /\/jafa\/api\/foods\/.*\/comment/, methods: ['GET']},
            {url: /\/jafa\/api\/recipes\/.*\/comment/, methods: ['GET']},
            {url: /\/jafa\/api\/foods\/.*\/score/, methods: ['GET']},
            {url: /\/jafa\/api\/foods\/.*\/price/, methods: ['GET']},
            {url: /\/jafa\/api\/recipes\/.*\/price/, methods: ['GET']},

            {url: "/jafa/api/foods/:id/score", methods: ['OPTIONS']},
            {url: '/jafa/api/foods/:id/comment', methods: ['OPTIONS']},
            {url: "/jafa/api/recipes/:id/ingredients", methods: ['OPTIONS']},

            // Users routes
            {url: '/jafa/api/users/', methods: ['OPTIONS']},
            {url: '/jafa/api/users/current', methods: ['OPTIONS']},
            {url: '/jafa/api/users/:id', methods: ['OPTIONS']},
            {url: '/jafa/api/users/:id', methods: ['OPTIONS']},
            {url: '/jafa/api/users/:id', methods: ['OPTIONS']},

            {url: /\/jafa\/api\/stores\/.*/, methods: ['GET']},
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);
    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }
    req.decoded_user = user;
    done();
}