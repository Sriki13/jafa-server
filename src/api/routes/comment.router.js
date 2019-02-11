const controller = require("../domain/comment.controller");
const HttpStatus = require("http-status-codes");


function sendNotFoodFoundIdResponse(res, id) {
    return res.status(HttpStatus.BAD_REQUEST).send("No food found for " + id + " id")
}

function sendNotRecipeFoundIdResponse(res, id) {
    return res.status(HttpStatus.BAD_REQUEST).send("No recipe found for " + id + " id")
}

function sendOKResponse(res, object) {
    return res.status(HttpStatus.OK).send(object);
}

/**
 * @api {post} jafa/api/foods/:id/comment Add food comments
 * @apiGroup comment
 *
 * @apiParam (URL parameters) {Number} id The id of the food
 *
 * @apiParam (Comment) {Number} id The id of the comment
 * @apiParam (Comment) {String} author The name of the commenter
 * @apiParam (Comment) {String} message The content of the comment
 * @apiParam (Comment) {Date} timestamp The date of the comment
 */
async function addFoodComment(req, res) {
    if (req.body.message === undefined || req.body.message === null) {
        return res.status(HttpStatus.BAD_REQUEST).send("message undefined");
    }

    let food = await controller.createFoodComment(req.params.id, req.body, req.decoded_user);
    return (food === null) ? sendNotFoodFoundIdResponse(res, req.params.id) : sendOKResponse(res, food);
}

/**
 * @api {post} jafa/api/foods/:id/comment Add recipe comments
 * @apiGroup comment
 *
 * @apiParam (URL parameters) {Number} id The id of the recipe
 *
 * @apiParam (Comment) {Number} id The id of the comment
 * @apiParam (Comment) {String} author The name of the commenter
 * @apiParam (Comment) {String} message The content of the comment
 * @apiParam (Comment) {Date} timestamp The date of the comment
 */
async function addRecipeComment(req, res) {
    if (req.body.message === undefined || req.body.message === null) {
        return res.status(HttpStatus.BAD_REQUEST).send("message undefined");
    }

    let recipe = await controller.createRecipeComment(req.params.id, req.body, req.decoded_user);
    return (recipe === null) ? sendNotRecipeFoundIdResponse(res, req.params.id) : sendOKResponse(res, recipe);
}

/**
 * @api {get} jafa/api/foods/:id/comment Get food comments
 * @apiGroup comment
 *
 * @apiParam (URL parameters) {Number} id The id of the food
 *
 * @apiSuccess {Array} Result-array An array of comments
 *
 * @apiSuccess (Comment) {Number} id The id of the comment
 * @apiSuccess (Comment) {String} author The name of the commenter
 * @apiSuccess (Comment) {String} message The content of the comment
 * @apiSuccess (Comment) {Date} timestamp The date of the comment
 */
async function getFoodComments(req, res) {
    let comments = await controller.getFoodComments(req.params.id);
    return (comments === null) ? sendNotFoodFoundIdResponse(res, req.params.id) : sendOKResponse(res, comments);
}

/**
 * @api {get} jafa/api/recipes/:id/comment Get recipe comments
 * @apiGroup comment
 *
 * @apiParam (URL parameters) {Number} id The id of the recipe
 *
 * @apiSuccess {Array} Result-array An array of comments
 *
 * @apiSuccess (Comment) {Number} id The id of the comment
 * @apiSuccess (Comment) {String} author The name of the commenter
 * @apiSuccess (Comment) {String} message The content of the comment
 * @apiSuccess (Comment) {Date} timestamp The date of the comment
 */
async function getRecipeComments(req, res) {
    let comments = await controller.getRecipeComments(req.params.id);
    return (comments === null) ? sendNotRecipeFoundIdResponse(res, req.params.id) : sendOKResponse(res, comments);
}


module.exports = {
    addFoodComment,
    addRecipeComment,
    getFoodComments,
    getRecipeComments,
};