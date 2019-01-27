const Food = require("./models/food").Food;
const exceptions = require("./exceptions");

let logging = true;

function logs(val) {
    logging = val;
}

async function findFood(id) {
    let food = await Food.findById(id);
    if (food === undefined || food === null) {
        throw new exceptions.NoSuchFoodException(id);
    }
    return food;
}

async function checkIfScoreIsDefined(food) {
    if (food.scores === undefined || food.scores.length === 0) {
        food.assignInitialScore();
        await food.save();
    }
}

async function getScore(id) {
    try {
        let food = await findFood(id);
        await checkIfScoreIsDefined(food);
        let sum = 0;
        for (let i of food.scores) {
            sum += i;
        }
        return sum / food.scores.length;
    } catch (e) {
        throw e;
    }
}

async function addScore(id, score) {
    try {
        let food = await findFood(id);
        await checkIfScoreIsDefined(food);
        food.scores.push(score);
        await food.save();
    } catch (e) {
        throw e;
    }
}

module.exports = {
    getScore,
    addScore,
    logs
};