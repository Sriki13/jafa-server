const controller = require("../domain/search.controller");
const HttpStatus = require("http-status-codes");

/**
 * KEPT AS EXAMPLE
 *
 * @api {post} api/uberoo/restaurants/:id/orders Place an order
 * @apiGroup order
 *
 * @apiParam (URL Parameters) {Number} id The id of the restaurant to place the order in.
 *
 * @apiParam (Body) {Number} userToken The token(id) of the customer.
 * @apiParam (Body) {String} code The promotional code used (optional)
 * @apiParam (Body) {Array} items An array of food items to order.
 *
 * @apiParam (OrderItem) {Number} id The id of the food item.
 * @apiParam (OrderItem) {Number} amount The quantity of item to prepare.
 */

async function searchFood(req, res) {
    let items = await controller.fetchAllFoods();
    return res.status(HttpStatus.OK).send(items);
}

async function createFood(req, res) {
    await controller.addFood(req.params.id);
    return res.status(HttpStatus.OK).send();
}

module.exports = {
    searchFood,
    createFood
};