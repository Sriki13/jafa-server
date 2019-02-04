const controller = require("../domain/score.controller");
const HttpStatus = require("http-status-codes");
const exceptions = require("../domain/exceptions");

async function fetchScore(req, res) {
    try {
        let score = await controller.getScore(req.params.id);
        return res.status(HttpStatus.OK).send({score: score});
    } catch (e) {
        if (e instanceof exceptions.NoSuchFoodException) {
            return res.status(HttpStatus.BAD_REQUEST).send(e.message);
        }
        return res.status(HttpStatus.BAD_REQUEST).send(e);
    }
}

async function createScore(req, res) {
    if (req.body.score === undefined) {
        return res.status(HttpStatus.BAD_REQUEST).send("Score undefined");
    }
    if (req.body.score < 0 || req.body.score > 10) {
        return res.status(HttpStatus.BAD_REQUEST).send("Score must be between 0 and 10");
    }
    try {
        await controller.addScore(req.params.id, req.body.score);
        return res.status(HttpStatus.OK).send();
    } catch (e) {
        if (e instanceof exceptions.NoSuchFoodException) {
            return res.status(HttpStatus.BAD_REQUEST).send(e.message);
        }
        return res.status(HttpStatus.BAD_REQUEST).send(e);
    }
}

module.exports = {
    fetchScore,
    createScore
};