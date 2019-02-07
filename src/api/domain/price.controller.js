const storeModel = require("./models/store");
const foodModel = require("./models/food");

// Use to generate random prices for the whole database
// noinspection JSUnusedLocalSymbols
async function generateAllPrices() {
    const collectionStore = await storeModel.getCollection();
    const collectionFood= await foodModel.getCollection();

    const allStores = await collectionStore.find({}).toArray();
    const allFoods = await collectionFood.find({});
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
    let sum = 0;
    for (let p of food.prices) {
        sum += p.price;
    }
    food.price = sum / food.prices.length;
    console.log("Generated prices for item " + food._id + " - " + food.product_name + " : " + food.price);
    const collection = await foodModel.getCollection();
    await collection.save(food);
}

function addRandomPrice(storeId, food) {
    food.prices.push({
        price: Math.random() * 20,
        storeId: storeId
    });
}

module.exports = {
    generateAllPrices
};