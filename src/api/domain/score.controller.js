const foodModel = require("./models/food");
const exceptions = require("./exceptions");

async function findFood(id) {
    const collection = await foodModel.getCollection();
    let food = await collection.findOne({_id: id});
    if (food == null) {
        throw new exceptions.NoSuchFoodException(id);
    }
    return food;
}

async function checkIfScoreIsDefined(food) {
    const collection = await foodModel.getCollection();
    if (food.scores == null || food.scores.length === 0) {
        foodModel.assignInitialScore(food);
        await collection.save(food);
    }
    if (food.score == null) {
        food.score = getAverageScore(food);
        await collection.save(food);
    }
}

function getAverageScore(food) {
    if (food.scores.length === 0) {
        return 0;
    }
    let sum = 0;
    for (let i of food.scores) {
        sum += i;
    }
    return sum / food.scores.length;
}

async function getScore(id) {
    let food = await findFood(id);
    await checkIfScoreIsDefined(food);
    return getAverageScore(food);
}

async function setAllSCore() {
    const collection = await foodModel.getCollection();
    let allFoods = await collection.find({});
    await allFoods.forEach(async food => await checkIfScoreIsDefined(food));
}

async function addScore(id, score) {
    const collection = await foodModel.getCollection();
    score = parseFloat(score);
    let food = await findFood(id);
    await checkIfScoreIsDefined(food);
    food.scores.push(score);
    food.score = getAverageScore(food);
    await collection.save(food);
}

module.exports = {
    getScore,
    addScore,
    setAllSCore,
};