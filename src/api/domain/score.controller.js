const foodModel = require("./models/food");
const exceptions = require("./exceptions");

async function findFood(id) {
    let food = await foodModel.findFoodByStringId(String(id));
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
    if (food.score == null || food.score === 0) {
        food.score = getAverageScore(food);
        await food.save();
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
    try {
        let food = await findFood(id);
        console.log(typeof food);
        await checkIfScoreIsDefined(food);
        return getAverageScore(food);
    } catch (e) {
        throw e;
    }
}

async function addScore(id, score) {
    try {
        let food = await findFood(id);
        await checkIfScoreIsDefined(food);
        food.scores.push(score);
        food.score = getAverageScore(food);
        await food.save();
    } catch (e) {
        throw e;
    }
}

module.exports = {
    getScore,
    addScore
};