const recipeModel = require("./models/recipe");
const foodModel = require("./models/food");
const exceptions = require("./exceptions");
const search = require("./search.controller");
const ObjectId = require('mongodb').ObjectID;

async function parseRecipe(recipeText, authorId, authorName) {
    recipeText = recipeText.trim();
    const spLines = recipeText.split("\n");
    if (spLines === null || spLines.length < 3) {
        throw new exceptions.NoRecipeTitle();
    }
    let ingredientLines = spLines.filter(line => line.startsWith("-"));
    if (ingredientLines.length === 0) {
        throw new exceptions.InvalidRecipeFormat();
    }
    let recipe = {
        title: spLines[0],
        authorId: authorId,
        authorName: authorName,
        ingredients: [],
        comments: [],
        date: new Date()
    };
    for (let line of ingredientLines) {
        let ingredient = {};
        const sp = line.split("/");
        ingredient.name = sp[0].trim().substring(1).trim();
        let quantityMatches = sp[1].match("[0-9]+");
        if (quantityMatches === null) {
            continue;
        }
        ingredient.quantity = quantityMatches[0];
        const spUnit = sp[1].split(ingredient.quantity);
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
    recipe.text = text.replace(new RegExp("-[^\\n]+", "g"), "").trim();
    const collection = await recipeModel.getCollection();
    await collection.save(recipe);
    return recipe;
}

async function suggestFoods(ingredients) {
    let result = [];
    for (let ingredient of ingredients) {
        let suggestions = await search.fetchFood(ingredient.name, 5, "score", "desc", 1);
        result.push(suggestions.data);
    }
    return result;
}

async function findRecipe(id) {
    const collection = await recipeModel.getCollection();
    if (!ObjectId.isValid(id)) {
        throw new exceptions.InvalidRecipe(id);
    }
    let recipe = await collection.findOne({_id: ObjectId(id)});
    if (recipe == null) {
        throw new exceptions.InvalidRecipe(id);
    }
    return recipe;
}

async function updateRecipeIngredient(userId, recipeId, position, foodId) {
    let recipe = await findRecipe(recipeId);
    if (position > recipe.ingredients.length - 1) {
        throw new exceptions.InvalidRecipeIngredient(position);
    }
    if (recipe.authorId.toString() !== userId) {
        throw new exceptions.InvalidUserException("User is not the author of the recipe");
    }
    let foodCollection = await foodModel.getCollection();
    let food = await foodCollection.findOne({_id: foodId});
    if (food == null) {
        throw new exceptions.NoSuchFoodException(foodId);
    }
    recipe.ingredients[position].foodId = foodId;
    let recipeCollection = await recipeModel.getCollection();
    await recipeCollection.save(recipe);
}

async function getRecipePrice(recipeId) {
    let recipe = await findRecipe(recipeId);
    let sum = 0;
    let unknown = [];
    for (let ingredient of recipe.ingredients) {
        if (ingredient.foodId == null) {
            unknown.push(ingredient.name);
        } else {
            const collection = await foodModel.getCollection();
            let food = await collection.findOne({_id: ingredient.foodId});
            let min;
            for (let priceItem of food.prices) {
                if (min === undefined || priceItem.price < min) {
                    min = priceItem.price;
                }
            }
            sum += min;
        }
    }
    return {
        sum: sum,
        unknown: unknown
    }
}

module.exports = {
    parseRecipe,
    suggestFoods,
    updateRecipeIngredient,
    getRecipePrice
};



