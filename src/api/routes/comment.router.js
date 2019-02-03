const controller = require("../domain/comment.controller");
const HttpStatus = require("http-status-codes");


function sendNotFoodFoundIdResponse(res, id) {
    return res.status(HttpStatus.BAD_REQUEST).send("No food found for " + id + " id")
}

function sendOKResponse(res, food) {
    return res.status(HttpStatus.OK).send(food);
}

async function addComment(req, res) {
    if (req.body.message === undefined || req.body.message === null) {
        return res.status(HttpStatus.BAD_REQUEST).send("message undefined");
    }

    let food = await controller.createComment(req.params.id, req.body, req.decoded_user);
    return (food === null) ? sendNotFoodFoundIdResponse(res, req.params.id) : sendOKResponse(res, food);
}

module.exports = {
    addComment,
};