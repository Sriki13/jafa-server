const controller = require("../domain/search.controller");
const HttpStatus = require("http-status-codes");
const ObjectId = require('mongodb').ObjectID;

/**
 * @api {get} jafa/api/foods Search foods
 * @apiGroup search
 *
 * @apiDescription  One cannot filter by region and by store at the same time.
 * - Food items with no names will be ignored.
 * - More information than shown here may be sent for the ingredients, but its presence is unreliable.
 * - A food may have images that can be fetched by building the following url:
 * - https://static.openfoodfacts.org/images/products/[id]/[image.name].[image.rev].[size].jpg
 * - Name and rev will be provided by the request, while the sizes available are always "200", "400", or "full".
 * - The id must be separated by "/" differently depending on its size (example: 000/000/0000).
 * - If the id length is not 9 or 13, then no "/" are required.
 * - Otherwise, it must be formatted in the following manner:
 * - 9  -> 000/000/000
 * - 13 -> 000/000/000/0000
 *
 * @apiParam (Query parameters) {String} name A string contained in the name of the item, defaults to an empty string
 * @apiParam (Query parameters) {Number} limit The maximum amount of items to return, defaults to 20
 * @apiParam (Query parameters) {Number} page The page of results to return (depends on the limit), defaults to 1
 * @apiParam (Query parameters) {String} criteria The criteria used to order the results: either "score' or "price", defaults to no order
 * @apiParam (Query parameters) {String} order How to order the items: ascending ("asc") or descending ("desc"), defaults to ascending
 * @apiParam (Query parameters) {String} shop Used to filter by items having a price in a shop: the id of the shop to filter, defaults to none
 * @apiParam (Query parameters) {String} region Used to filter items having a price in a store in a region: the region name, defaults to none
 *
 * @apiSuccess {Number} count How many items match the given search in total (not only the given page)
 * @apiSuccess {Array} data An array of Food matching the given filters
 *
 * @apiSuccess (Food) {Number} id The id of the food
 * @apiSuccess (Food) {String} name The name of the food
 * @apiSuccess (Food) {Array} ingredients The array of Ingredient contained in the food. Can be empty
 * @apiSuccess (Food) {Array} images An array of ImageData to build the url of the images. Can be empty
 * @apiSuccess (Food) {Object} nutriments The nutriments contained within the food. Each item in the object corresponds to a nutriment, and the values may be Strings or Numbers.
 * @apiSuccess (Food) {Number} price The average price of the food
 * @apiSuccess (Food) {Number} score The average score of the food
 *
 * @apiSuccess (Ingredient) {String} id An id or a text describing the ingredient
 * @apiSuccess (Ingredient) {String} text A text describing the ingredient
 *
 * @apiSuccess (ImageData) {String} name The name of the picture. See description for how to use it.
 * @apiSuccess (ImageData) {String} rev The revision of the picture. See description for how to use it.
 */
async function searchFood(req, res) {
    let search = "";
    if (req.query.name !== undefined) {
        search = req.query.name;
    }
    if (req.query.page != null && !isNaN(req.query.page) && req.query.page < 1) {
        return res.status(HttpStatus.BAD_REQUEST).send("Page must be a number greater or equal to 1");
    }
    if (req.query.page == null) {
        req.query.page = 1;
    }
    try {
        let items = await controller.fetchFood(search, req.query.limit, req.query.criteria,
            req.query.order, req.query.page, req.query.shop, req.query.region);
        return res.status(HttpStatus.OK).send(items);
    } catch (e) {
        return res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
}

/**
 * @api {put} jafa/api/foods Update food
 * @apiGroup search
 *
 * @apiDescription Adds a new food to the database.
 * If a food with the given id already exists, it will be overwritten and its data will be lost.
 *
 * @apiParam (Body) {Number} id The id of the food
 * @apiParam (Body) {Anything} ___ Any field to add to the food in the database.
 *
 * @apiSuccess {Number} id The id of the food
 * @apiSuccess {Anything} ___ Any field present in the food.
 */
async function updateFood(req, res) {
    try {
        if (req.body._id == null) {
            return res.status(HttpStatus.BAD_REQUEST).send("id must be defined");
        }
        let updatedFood = await controller.updateFood(req.body);
        return res.status(HttpStatus.OK).send(updatedFood)
    } catch (err) {
        return res.status(HttpStatus.BAD_REQUEST).send(err)
    }
}

/**
 * @api {get} jafa/api/recipes Browse recipe
 * @apiGroup search
 *
 * @apiParam (Query parameters) {String} name A string contained in the name of the item, defaults to an empty string
 * @apiParam (Query parameters) {Number} limit The maximum amount of items to return, defaults to 20
 * @apiParam (Query parameters) {Number} page The page of results to return (depends on the limit), defaults to 1
 *
 * @apiSuccess {Number} count How many items match the given search in total (not only the given page)
 * @apiSuccess {Array} data An array of Recipe matching the given filters
 *
 * @apiSuccess (Recipe) {String} id The id of the recipe
 * @apiSuccess (Recipe) {String} title The title of the recipe
 * @apiSuccess (Recipe) {String} text The instructions of the recipe
 * @apiSuccess (Recipe) {String} authorId The id of the author of the recipe
 * @apiSuccess (Recipe) {Date} date The date of creation of the recipe
 * @apiSuccess (Recipe) {Array} ingredients An array of Ingredient of the recipe
 *
 * @apiSuccess (Ingredient) {String} name The name of the ingredient
 * @apiSuccess (Ingredient) {Number} quantity The amount required in the recipe
 * @apiSuccess (Ingredient) {String} unit The unit of the ingredient quantity, can be undefined
 */
async function searchRecipe(req, res) {
    let search = "";
    if (req.query.name !== undefined) {
        search = req.query.name;
    }
    if ((req.query.page != null && !isNaN(req.query.page) && req.query.page < 1)
        || req.query.page != null && isNaN(req.query.page)) {
        return res.status(HttpStatus.BAD_REQUEST).send("Page must be a number greater or equal to 1");
    }
    if (req.query.page == null) {
        req.query.page = 1;
    }
    let items = await controller.fetchRecipe(search, req.query.page);
    return res.status(HttpStatus.OK).send(items);
}

/**
 * @api {get} jafa/api/foods/:id Get food
 * @apiGroup search
 *
 * @apiParam (URL parameters) {Number} id The id of the food
 *
 * @apiSuccess (Food) {Number} id The id of the food
 * @apiSuccess (Food) {String} name The name of the food
 * @apiSuccess (Food) {Array} ingredients The array of Ingredient contained in the food. Can be empty
 * @apiSuccess (Food) {Array} images An array of ImageData to build the url of the images. Can be empty
 * @apiSuccess (Food) {Object} nutriments The nutriments contained within the food. Each item in the object corresponds to a nutriment, and the values may be Strings or Numbers.
 * @apiSuccess (Food) {Number} price The average price of the food
 * @apiSuccess (Food) {Number} score The average score of the food
 *
 * @apiSuccess (Ingredient) {String} id An id or a text describing the ingredient
 * @apiSuccess (Ingredient) {String} text A text describing the ingredient
 *
 * @apiSuccess (ImageData) {String} name The name of the picture. See description for how to use it.
 * @apiSuccess (ImageData) {String} rev The revision of the picture. See description for how to use it.
 */
async function getFood(req, res) {
    let food = await controller.getFoodById(req.params.id);
    if (food == null) {
        return res.status(HttpStatus.BAD_REQUEST).send("No food with id " + req.params.id);
    }
    return res.status(HttpStatus.OK).send(food);
}

module.exports = {
    searchFood,
    updateFood,
    searchRecipe,
    getFood
};