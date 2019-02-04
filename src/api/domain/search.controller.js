const foodModel = require("./models/food");
const recipeModel = require("./models/recipe");
const exceptions = require("./exceptions");

async function getFoodById(id) {
    return await foodModel.getCollection().findOne({_id: id});
}

async function fetchFood(name, limit, criteria, order, page) {
    console.log(name);
    if (limit == null) {
        limit = 20;
    }
    if (order != null && order !== "asc" && order !== "desc") {
        throw new exceptions.InvalidOrderException(order);
    }
    let skip = 0;
    if (page != null) {
        skip = limit * page;
    }
    let options = {
        limit: limit,
        skip: skip
    };
    if (criteria != null) {
        options.sort = [[criteria, order]];
    }
    let foods = await foodModel.getCollection().find({
        product_name: {'$regex': name, '$options': 'i'}
    }, options).toArray();
    let result = [];
    foods.forEach(food => {
        console.log(food.score);
        result.push({
            id: food._id,
            name: food.product_name,
            ingredients: food.ingredients,
            images: foodModel.getImagesData(food),
            nutriments: food.nutriments,
            score: food.score,
        });
    });
    return result;
}

async function fetchRecipe(name) {
    return await recipeModel.getCollection().find({
        title: {'$regex': name, '$options': 'i'}
    }, {limit: 20}).toArray();
}

module.exports = {
    fetchFood,
    fetchRecipe,
    getFoodById
};
