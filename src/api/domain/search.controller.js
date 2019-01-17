const Food = require("./models/food").Food;

let logging = true;

function logs(val) {
    logging = val;
}

async function fetchAllFoods() {
    return await Food.find();
}

async function addFood(id) {
    const newItem = new Food({id: id});
    await newItem.save();
}

/**
 * KEPT AS EXAMPLE, DELETE LATER
 *
 * @api {post} message-bus NEW_ORDER
 * @apiGroup message-emission
 * @apiDescription Start cooking an order.
 *
 * @apiParam (Body) {String} id The id of the order.
 * @apiParam (Body) {Array} itemList An array of OrderItems corresponding to the items of the order.
 * @apiParam (Body) {Number} customerId The id of the customer.
 * @apiParam (Body) {String} address The address of the customer.
 * @apiParam (Body) {String} phone The phone number of the customer.
 * @apiParam (Body) {Date} createdAt The date of creation of the order.
 * @apiParam (Body) {Number} restaurantId The id of the restaurant of the order.
 *
 * @apiParam (OrderItem) {Number} id The id of the food item.
 * @apiParam (OrderItem) {Number} amount The quantity of item to prepare.
 */


module.exports = {
    fetchAllFoods,
    addFood,
    logs
};
