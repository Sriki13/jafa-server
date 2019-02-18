const foodModel = require("./models/food");
const recipeModel = require("./models/recipe");
const storeModel = require("./models/store");
const exceptions = require("./exceptions");
const ObjectId = require('mongodb').ObjectID;

async function getFoodById(id) {
    const foodCollection = await foodModel.getCollection();
    let food = await foodCollection.findOne({_id: id});
    return (food === null) ? null : formatFood(food);
}

function formatFood(food, shop) {
    return {
        id: food._id,
        name: food.product_name,
        ingredients: food.ingredients,
        images: foodModel.getImagesData(food),
        nutriments: food.nutriments,
        score: food.score,
        price: formatPrice(food, shop)
    };
}

function formatPrice(food, shop) {
    if (shop == null) {
        return food.price;
    }
    for (let price of food.prices) {
        if (price.storeId.toString() === shop.toString()) {
            return price.price;
        }
    }
}

async function updateFood(food) {
    if ('undefined' === typeof(food['_id'])) {
        throw "Food object must have '_id' attribute"
    }
    const collection = await foodModel.getCollection();
    let result = await collection.findOneAndUpdate({_id: food._id}, {$set: food}, {returnOriginal: false});
    return result.value;
}

async function fetchFood(name, limit, criteria, order, page, shop, region) {
    if (shop != null && region != null) {
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
    const foodCollection = await foodModel.getCollection();
    const storeCollection = await storeModel.getCollection();
    let query = {
        product_name: {$regex: name, $ne: "", $exists: true, $options: 'i'}
    };
    if (shop != null) {
        let store = storeCollection.findOne({_id: ObjectId(shop)});
        if (store == null) {
            throw new exceptions.NoSuchStore(store);
        }
        query.prices = {$elemMatch: {storeId: ObjectId(shop)}};
    }
    if (region != null && region !== "") {
        let stores = await storeCollection.find({region: region}).toArray();
        if (stores.length === 0) {
            throw new exceptions.InvalidRegion(region);
        }
        let ids = stores.map(store => ObjectId(store._id));
        query.prices = {$elemMatch: {storeId: {$in: ids}}};
    }
    let count = await foodCollection.count(query);
    let foods = await foodCollection.find(query, options).toArray();
    let result = [];
    foods.forEach(food => {
        result.push(formatFood(food, shop));
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
    getFoodById,
    updateFood,
};
