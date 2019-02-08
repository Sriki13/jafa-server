const foodModel = require("./models/food");
const recipeModel = require("./models/recipe");
const storeModel = require("./models/store");
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

async function fetchFood(name, limit, criteria, order, page, store, region) {
    if (store != null && region != null) {
        throw new exceptions.InvalidLocationSearch();
    }
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
    let query = {
        product_name: {'$regex': name, '$ne': "", '$exists': true, '$options': 'i'}
    };
    if (store != null) {
        let store = await storeModel.getCollection().findOne({_id: store});
        if (store == null) {
            throw new exceptions.NoSuchStore(store);
        }
        query.prices = {storeId: store}
    }
    if (region != null) {
        let stores = await storeModel.getCollection().find({region: region}).toArray();
        let ids = stores.map(store => store.id);
        query.prices = {storeId: {"$in": ids}}
    }
    let count = await foodCollection.count(query);
    let foods = await foodCollection.find(query, options).toArray();
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
    let recipeCollection = await recipeModel.getCollection();
    let count = await recipeCollection.count({
        title: {'$regex': name, '$options': 'i'}
    });
    let data = await recipeCollection.find({
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
