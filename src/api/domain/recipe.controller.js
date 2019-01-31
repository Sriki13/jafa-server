const Recipe = require("./models/recipe").Recipe;
const Food = require("./models/food").Food;
const exceptions = require("./exceptions");
const search = require("./search.controller");

async function parseRecipe(recipeText, authorId) {
    recipeText = recipeText.trim();
    const spLines = recipeText.split("\n");
    if (spLines === null || spLines.length < 3) {
        throw new exceptions.NoRecipeTitle();
    }
    let ingredientLines = spLines.filter(line => line.startsWith("-"));
    if (ingredientLines.length === 0) {
        throw new exceptions.InvalidRecipeFormat();
    }
    let recipe = new Recipe({
        title: spLines[0],
        authorId: authorId,
        ingredients: [],
        comments: [],
        date: new Date()
    });
    for (let line of ingredientLines) {
        let ingredient = {};
        const sp = line.split("/");
        ingredient.name = sp[0].trim();
        let quantityMatches = sp[1].match("[0-9]+")[0];
        if (quantityMatches === null) {
            continue;
        }
        ingredient.quantity = quantityMatches[0];
        const spUnit = sp[1].split("[0-9]+");
        if (spUnit.length > 1) {
            ingredient.unit = spUnit[1].trim();
        } else {
            ingredient.unit = "";
        }
        recipe.ingredients.push(ingredient);
    }
    if (recipe.ingredients.length === 0) {
        throw new exceptions.InvalidRecipeFormat();
    }
    let text = recipeText.substring(recipeText.search("-[^\\n]+"));
    text.replace("-[^\\n]+", "");
    recipe.text = text;
    await recipe.save();
    return recipe;
}

async function suggestFoods(ingredients) {
    let result = [];
    for (let ingredient of ingredients) {
        result.push(await search.fetchFood(ingredient.name));
    }
    return result;
}

async function updateRecipeIngredient(userId, recipeId, position, foodId) {
    let recipe = await Recipe.findById(recipeId);
    if (position > recipe.ingredients.length - 1) {
        throw new exceptions.InvalidRecipeIngredient(position);
    }
    if (recipe.userId !== userId) {
        throw new exceptions.InvalidUserException("User is not the author of the recipe");
    }
    let food = await Food.find({id: foodId});
    if (food === undefined) {
        throw new exceptions.NoSuchFoodException(foodId);
    }
    recipe.ingredients[position].foodId = foodId;
    await recipe.save();
}

module.exports = {
    parseRecipe,
    suggestFoods,
    updateRecipeIngredient
};



