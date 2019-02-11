const controller = require("../domain/score.controller");
const HttpStatus = require("http-status-codes");
const exceptions = require("../domain/exceptions");

/**
 * @api {get} jafa/api/foods/:id/score Get food score
 * @apiGroup score
 *
 * @apiDescription A new score will be generated if none was found. It will be
 * determined by the amount of info found on the food.
 * If multiple scores exists for a food, the average score will be returned.
 *
 * @apiParam (URL parameters) {Number} id The id of the food
 *
 * @apiSuccess {Number} score The score given to the food
 */
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

/**
 * @api {post} jafa/api/foods/:id/score Add food score
 * @apiGroup score
 * @apiDescription User token required.
 *
 * @apiParam (URL parameters) {Number} id The id of the food
 *
 * @apiParam (Body) {Number} price The score to add to the food.
 */
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