const foodModel = require("./models/food");

async function createComment(foodId, comment, author) {
    let food = await foodModel.getCollection().findOne({_id: foodId});
    if (!food) {
        return null;
    }
    comment.author = author;
    comment.timestamp = (new Date).getTime();
    if (food.comments == null) {
        food.comments = [];
    }
    food.comments.push(comment);
    return await foodModel.updateFood(food);
}

async function getComments(foodId) {
    let food = await foodModel.getCollection().findOne({_id: foodId});
    if (!food) {
        return null;
    }
    return food.comments;
}

module.exports = {
    createComment,
    getComments,
};
