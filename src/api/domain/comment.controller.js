const Food             = require("./models/food").Food;
const SearchController = require("./search.controller");


async function createComment(foodId, comment, author) {
    let food = await Food.findOne({_id: foodId});
    
    if (!food) {
        return null
    }

    comment.author = author;
    comment.timestamp = (new Date).getTime();
    console.log(comment);
    food.comments.push(comment);
    console.log(food);
    return await SearchController.updateFood(food);
}


async function getComments(foodId) {
    let food = await Food.findOne({_id: foodId});

    if (!food) {
        return null;
    }
    return food.comments;
}

module.exports = {
    createComment,
    getComments,
};
