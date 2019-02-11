const controller = require("../domain/recipe.controller");
const HttpStatus = require("http-status-codes");
const exceptions = require("../domain/exceptions");

/**
 * @api {post} jafa/api/recipes Add a recipe
 * @apiGroup recipe
 *
 * @apiDescription User token required.
 * - Creates a recipe by parsing the given multiline String.
 * - The first line will be taken as the title of the recipe.
 * - Each ingredient must be on its own line starting with "-" with the quantity separated by "/".
 * - The following below is an example of a valid ingredient:
 * "- Sugar / 100g"
 * - The unit of the ingredient is optional.
 * - The text following the last ingredient line will be added as the instructions of the recipe.
 * - The server will provide suggestions for the ingredients with food that match the ingredient name
 * (limited to 3 maximum per ingredient), and return the recipe created.
 *
 * @apiParam {String} recipeText The text of the recipe
 *
 * @apiSuccess {Recipe} recipe The recipe that was created
 * @apiSuccess {Array} suggestions An array of FoodItem matching the ingredients
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
async function createRecipe(req, res) {
    if (req.body.recipeText === undefined) {
        return res.status(HttpStatus.BAD_REQUEST).send("recipeText required");
    }
    let userId = req.decoded_user._id;
    try {
        let recipe = await controller.parseRecipe(req.body.recipeText, userId);
        let suggestions = await controller.suggestFoods(recipe.ingredients);
        return res.status(HttpStatus.OK).send({
            recipe: recipe,
            suggestions: suggestions
        });
    } catch (e) {
        return res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
}

/**
 * @api {post} jafa/api/recipes/:id Edit recipe ingredient
 * @apiGroup recipe
 *
 * @apiParam (URL parameters) {String} id The id of the recipe
 *
 * @apiParam (Body) {Number} position The index of the ingredient to edit in the recipe array
 * @apiParam (Body) {String} foodId The id of the food to associate to this ingredient
 */
async function setRecipeIngredient(req, res) {
    let userId = String(req.decoded_user._id);
    for (let str of ["position", "foodId"]) {
        if (req.body[str] === undefined) {
            return res.status(HttpStatus.BAD_REQUEST).send(str + "required");
        }
    }
    try {
        const body = req.body;
        await controller.updateRecipeIngredient(userId, req.params.id, body.position, body.foodId);
        return res.status(HttpStatus.OK).send();
    } catch (e) {
        if (e instanceof exceptions.InvalidRecipe) {
            return res.status(HttpStatus.NOT_FOUND).send(e.message);
        }
        return res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
}

/**
 * @api {get} jafa/api/recipes/:id/price Get recipe price
 * @apiGroup recipe
 *
 * @apiDescription Processes the price of the sum of ingredients required
 * for a given recipe. Takes the lowest price for each ingredient.
 *
 * @apiParam (URL parameters) {String} id The id of the recipe
 *
 * @apiSuccess {Number} price The price of the recipe
 */
async function getRecipePrice(req, res) {
    try {
        let result = await controller.getRecipePrice(req.params.id);
        return res.status(HttpStatus.OK).send(result);
    } catch (e) {
        if (e instanceof exceptions.InvalidRecipe) {
            return res.status(HttpStatus.NOT_FOUND).send(e.message);
        }
        console.error(e);
        return res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
}

module.exports = {
    createRecipe,
    setRecipeIngredient,
    getRecipePrice
};