const foodModel = require("./models/food");
const recipeModel = require("./models/recipe");
const exceptions = require("./exceptions");

async function getFoodById(id) {
    const foodCollection = await foodModel.getCollection();
    let food = await foodCollection.findOne({_id: id});
    return (food === null) ? null : formatFood(food);
}

function formatFood(food) {
    return {
        id: food._id,
        name: food.product_name,
        ingredients: food.ingredients,
        images: foodModel.getImagesData(food),
        nutriments: food.nutriments,
        score: food.score,
        price: food.price
    };
}

async function fetchFood(name, limit, criteria, order, page) {
    if (limit == null) {
        limit = 20;
    } else {
        limit = Number(limit);
    }
    if (order != null && order !== "asc" && order !== "desc") {
        throw new exceptions.InvalidOrderException(order);
    }
    let skip = 0;
    if (page != null) {
        skip = limit * (page - 1);
    }
    let options = {
        limit: limit,
        skip: skip
    };
    if (criteria != null) {
        options.sort = [[criteria, (order === null) ? 'asc' : order]];
    }
    let foodCollection = await foodModel.getCollection();
    let count = await foodCollection.count({
        product_name: {'$regex': name, '$ne': "", '$exists': true, '$options': 'i'}
    });
    let foods = await foodCollection.find({
        product_name: {'$regex': name, '$ne': "", '$exists': true, '$options': 'i'}
    }, options).toArray();
    let result = [];
    foods.forEach(food => {
        result.push(formatFood(food));
    });
    return {
        data: result,
        count: count
    };
}

async function fetchRecipe(name, page) {
    let foodCollection = await foodModel.getCollection();
    let count = await foodCollection.count({
        title: {'$regex': name, '$options': 'i'}
    });
    let data = await foodCollection.find({
        title: {'$regex': name, '$options': 'i'}
    }, {limit: 20, skip: 20 * (parseInt(page) - 1)}).toArray();
    return {
        data: data,
        count: count
    };
}

module.exports = {
    fetchFood,
    fetchRecipe,
    getFoodById
};
