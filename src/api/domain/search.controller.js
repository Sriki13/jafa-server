const Food = require("./models/food").Food;
const Recipe = require("./models/recipe").Recipe;

let logging = true;

function logs(val) {
    logging = val;
}

async function fetchFood(name, limit) {
    if (limit === undefined) {
        limit = 20;
    }
    let foods = await Food.find({
        product_name: {'$regex': name, '$options': 'i'}
    }).limit(limit);
    let result = [];
    foods.forEach(food => {
        if (food.product_name !== undefined && food.product_name.length !== 0) {
            result.push({
                id: food._id,
                name: food.product_name,
                ingredients: food.ingredients,
                images: food.getImagesData(),
                nutriments: food.nutriments
            });
        }
    });
    return result;
}

async function updateFood(food) {
    if ('undefined' === typeof(food['_id'])) {
        throw "Food object must have 'id' attribute"
    }
    return await Food.findOneAndUpdate({id: food._id}, {$set: food}, {new: true})
}

async function fetchRecipe(name) {
    let recipes = await Recipe.find({
        title: {'$regex': name, '$options': 'i'}
    }).limit(20);
    let result = [];
    recipes.forEach(recipe => {
        result.push(recipe)
    });
    return result;
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
    fetchFood,
    updateFood,
    fetchRecipe,
    logs
};
