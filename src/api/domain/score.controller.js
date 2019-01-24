const Food = require("./models/food").Food;
const exceptions = require("./exceptions");

let logging = true;

function logs(val) {
    logging = val;
}

async function findFood(id) {
    let food = await Food.findById(id);
    if (food === undefined) {
        throw new exceptions.NoSuchFoodException(id);
    }
    return food;
}

async function checkIfScoreIsDefined(food) {
    if (food.scores === undefined) {
        food.assignInitialScore();
        await food.save();
    }
}

async function getScore(id) {
    let food = findFood(id);
    await checkIfScoreIsDefined(food);
    let sum = 0;
    food.scores.forEach(i => sum += i);
    return sum / food.scores.length;
}

async function addScore(id, score) {
    let food = findFood(id);
    await checkIfScoreIsDefined(food);
    food.scores.push(score);
    await food.save();
}

module.exports = {
    getScore,
    addScore,
    logs
};