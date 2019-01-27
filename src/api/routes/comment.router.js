const controller = require("../domain/comment.controller");
const HttpStatus = require("http-status-codes");
const Exceptions = require("../domain/exceptions");

async function addComment(req, res) {
    if (req.body.message === undefined) {
        return res.status(HttpStatus.BAD_REQUEST).send("message undefined");
    }
    if (req.body.author === undefined) {
        return res.status(HttpStatus.BAD_REQUEST).send("author undefined");
    }

    let food = await controller.createComment(req.params.id, req.body);
    if (food === null) {
        return res.status(HttpStatus.BAD_REQUEST).send("No food found for " + req.params.id + " id")
    }
    return res.status(HttpStatus.OK).send(food);
}

module.exports = {
    addComment,
};