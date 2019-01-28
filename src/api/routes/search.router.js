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
    let search = "";
    if (req.query.name !== undefined) {
        search = req.query.name;
    }
    let items = await controller.fetchFood(search);
    return res.status(HttpStatus.OK).send(items);
}

async function updateFood(req, res) {
    try {
        let updatedFood = await controller.updateFood(req.body);
        return res.status(HttpStatus.OK).send(updatedFood)
    } catch (err) {
        return res.status(HttpStatus.BAD_REQUEST).send()
    }
}

async function searchRecipe(req, res) {
    // TODO: order by latest date by default
    let search = "";
    if (req.query.name !== undefined) {
        search = req.query.name;
    }
    let items = await controller.fetchRecipe(search);
    return res.status(HttpStatus.OK).send(items);
}

module.exports = {
    searchFood,
    updateFood,
    searchRecipe
};