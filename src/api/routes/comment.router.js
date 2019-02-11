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

async function addFoodComment(req, res) {
    if (req.body.message === undefined || req.body.message === null) {
        return res.status(HttpStatus.BAD_REQUEST).send("message undefined");
    }

    let food = await controller.createFoodComment(req.params.id, req.body, req.decoded_user);
    return (food === null) ? sendNotFoodFoundIdResponse(res, req.params.id) : sendOKResponse(res, food);
}

async function addRecipeComment(req, res) {
    if (req.body.message === undefined || req.body.message === null) {
        return res.status(HttpStatus.BAD_REQUEST).send("message undefined");
    }

    let recipe = await controller.createRecipeComment(req.params.id, req.body, req.decoded_user);
    return (recipe === null) ? sendNotRecipeFoundIdResponse(res, req.params.id) : sendOKResponse(res, recipe);
}


async function getFoodComments(req, res) {
    let comments = await controller.getFoodComments(req.params.id);
    return (comments === null) ? sendNotFoodFoundIdResponse(res, req.params.id) : sendOKResponse(res, comments);
}

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