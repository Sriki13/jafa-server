const storeModel = require("./models/store");
const foodModel = require("./models/food");
const exceptions = require("./exceptions");
const ObjectId = require('mongodb').ObjectID;

// Use to generate random prices for the whole database
// noinspection JSUnusedLocalSymbols
async function generateAllPrices() {
    const allStores = await storeModel.getCollection().find({}).toArray();
    const allFoods = await foodModel.getCollection().find({});
    allFoods.forEach(food => generateRandomPrice(allStores, food));
}

async function generateRandomPrice(allStores, food) {
    const baseStoreIndex = Math.floor(Math.random() * allStores.length);
    food.prices = [];
    addRandomPrice(allStores[baseStoreIndex]._id, food);
    for (let i = 0; i < allStores.length; i++) {
        if (i === baseStoreIndex) continue;
        if (Math.random() < 0.4) {
            addRandomPrice(allStores[i]._id, food);
        }
    }
    food.price = getFoodAveragePrice(food);
    console.log("Generated prices for item " + food._id + " - " + food.product_name + " : " + food.price);
    await foodModel.getCollection().save(food);
}

function getFoodAveragePrice(food) {
    let sum = 0;
    for (let p of food.prices) {
        sum += p.price;
    }
    return sum / food.prices.length;
}

function addRandomPrice(storeId, food) {
    food.prices.push({
        price: Math.random() * 20,
        storeId: storeId
    });
}

async function getFoodById(foodId) {
    let food = await foodModel.getCollection().findOne({_id: foodId});
    if (food == null) {
        throw exceptions.NoSuchFoodException(foodId);
    }
    return food;
}

async function getPrices(foodId) {
    let food = await getFoodById(foodId);
    let result = [];
    for (let item of food.prices) {
        let store = await storeModel.getCollection().findOne({_id: item.storeId});
        result.push({
            price: item.price,
            store: store
        });
    }
    return result;
}

async function addPrice(foodId, storeId, price) {
    let food = await getFoodById(foodId);
    let store = storeModel.getCollection().findOne({_id: storeId});
    if (store == null) {
        throw exceptions.NoSuchStore(storeId);
    }
    for (let i = 0; i < food.prices.length; i++) {
        let item = food.prices[i];
        if (item.storeId.toString() === storeId) {
            food.prices.splice(i, 1);
            break;
        }
    }
    food.prices.push({
        price: price,
        storeId: ObjectId(storeId)
    });
    food.price = getFoodAveragePrice(food);
    await foodModel.getCollection().save(food);
}

module.exports = {
    generateAllPrices,
    getPrices,
    addPrice
};