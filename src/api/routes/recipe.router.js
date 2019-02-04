const controller = require("../domain/recipe.controller");
const HttpStatus = require("http-status-codes");
const exceptions = require("../domain/exceptions");

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

module.exports = {
    createRecipe,
    setRecipeIngredient
};