const controller = require("../domain/recipe.controller");
const HttpStatus = require("http-status-codes");

async function createRecipe(req, res) {
    if (req.body.recipeText === undefined) {
        return res.status(HttpStatus.BAD_REQUEST).send("recipeText required");
    }
    let userId = 0; // TODO: find userId in req
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
    let userId = 0; // TODO: find userId in req
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
        return res.status(HttpStatus.BAD_REQUEST).send(e.message);
    }
}

module.exports = {
    createRecipe,
    setRecipeIngredient
};