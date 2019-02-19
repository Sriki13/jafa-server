// This file is from the tutorial :
//    http://jasonwatmore.com/post/2018/06/14/nodejs-mongodb-simple-api-for-authentication-registration-and-user-management


const userService = require('../domain/users.controller');
const HttpStatus = require("http-status-codes");


module.exports = {
    authenticate,
    register,
    update,
    _delete
};

/**
 * @api {post} jafa/api/users/authenticate Authenticate
 * @apiGroup user
 *
 * @apiParam (Body) {String} username The username of the user
 * @apiParam (Body) {String} password The password of the user
 *
 * @apiSuccess {String} token A token identifying the user for future requests
 * @apiSuccess {Number} _id The id of the user
 */
function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

/**
 * @api {post} jafa/api/users/register Add a user
 * @apiGroup user
 *
 * @apiParam (Body) {String} username The username of the user
 * @apiParam (Body) {String} password The password of the user
 */
function register(req, res, next) {
    if (req.body.username == null || req.body.password == null) {
        return res.status(HttpStatus.BAD_REQUEST).send("Missing username and/or password");
    }
    req.body.date = Date.now();
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

/**
 * @api {put} jafa/api/users/:id Update user info
 * @apiGroup user
 *
 * @apiParam (URL parameters) {String} id The id of the user
 *
 * @apiParam (Body) {String} username The new username of the user
 * @apiParam (Body) {String} password The new password of the user
 */
async function update(req, res, next) {
    try {
        await userService.update(req.params.id, req.body);
        return res.status(HttpStatus.OK).send();
    } catch (e) {
        next(e);
    }
}

/**
 * @api {delete} jafa/api/users/:id Delete user
 * @apiGroup user
 *
 * @apiParam (URL parameters) {String} id The id of the user
 */
function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}