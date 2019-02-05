const storeModel = require("./models/store");
const foodModel = require("./models/food");

// Use to generate random prices for the whole database
// noinspection JSUnusedLocalSymbols
async function generateAllPrices() {
    const allStores = storeModel.getCollection().find({}).toArray();
    const allFoods = foodModel.getCollection().find({});
    allFoods.forEach(food => generateRandomPrice(allStores, food));
}

async function generateRandomPrice(allStores, food) {
    const baseStoreIndex = Math.round(Math.random() * allStores.length);
    food.prices = [];
    addRandomPrice(allStores[baseStoreIndex]._id, food);
    for (let i = 0; i < allStores.length; i++) {
        if (i === baseStoreIndex) continue;
        if (Math.random() < 0.4) {
            addRandomPrice(allStores[i]._id, food);
        }
    }
    console.log("Generated prices for item " + food._id + " - " + food.product_name + " : " + food.prices);
}

function addRandomPrice(storeId, food) {
    food.prices.push({
        price: Math.random() * 20,
        storeId: storeId
    });
}