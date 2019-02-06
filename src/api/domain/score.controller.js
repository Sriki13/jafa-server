const foodModel = require("./models/food");
const exceptions = require("./exceptions");

async function findFood(id) {
    let food = await foodModel.getCollection().findOne({_id: id});
    if (food == null) {
        throw new exceptions.NoSuchFoodException(id);
    }
    return food;
}

async function checkIfScoreIsDefined(food) {
    if (food.scores == null || food.scores.length === 0) {
        foodModel.assignInitialScore(food);
        await foodModel.getCollection().save(food);
    }
    if (food.score == null) {
        food.score = getAverageScore(food);
        await foodModel.getCollection().save(food);
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

async function addScore(id, score) {
    score = parseFloat(score);
    let food = await findFood(id);
    await checkIfScoreIsDefined(food);
    food.scores.push(score);
    food.score = getAverageScore(food);
    await foodModel.getCollection().save(food);
}

module.exports = {
    getScore,
    addScore
};