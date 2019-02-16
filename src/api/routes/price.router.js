const controller = require("../domain/price.controller");
const HttpStatus = require("http-status-codes");
const exceptions = require("../domain/exceptions");

/**
 * @api {get} jafa/api/foods/:id/price Get food price
 * @apiGroup price
 *
 * @apiParam (URL parameters) {Number} id The id of the food
 *
 * @apiSuccess {Array} Result-array An array of price items
 * @apiSuccess (PriceItem) {Number} price The price of the food
 * @apiSuccess (PriceItem) {String} storeId The id of the store selling this item
 */
async function fetchFoodPrice(req, res) {
    try {
        let prices = await controller.getPrices(req.params.id);
        return res.status(HttpStatus.OK).send(prices);
    } catch (e) {
        if (e instanceof exceptions.NoSuchFoodException) {
            return res.status(HttpStatus.NOT_FOUND).send(e.message);
        }
        console.error(e);
        return res.status(HttpStatus.BAD_REQUEST).send(e);
    }
}

/**
 * @api {post} jafa/api/foods/:id/price Add food price
 * @apiGroup price
 *
 * @apiDescription User token required.
 *
 * @apiParam (URL parameters) {Number} id The id of the food
 *
 * @apiParam (Body) {Number} price The price of the food
 * @apiParam (Body) {String} storeId The id of the store selling this item
 */
async function addNewPrice(req, res) {
    try {
        if (req.body.price == null || req.body.storeId == null) {
            return res.status(HttpStatus.BAD_REQUEST).send("Price and storeId required");
        }
        await controller.addPrice(req.params.id, req.body.storeId, req.body.price);
        return res.status(HttpStatus.OK).send();
    } catch (e) {
        if (e instanceof exceptions.NoSuchFoodException) {
            return res.status(HttpStatus.NOT_FOUND).send(e.message);
        }
        console.error(e);
        return res.status(HttpStatus.BAD_REQUEST).send(e);
    }
}

module.exports = {
    fetchFoodPrice,
    addNewPrice
};