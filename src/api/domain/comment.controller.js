const foodModel = require("./models/food");

async function createComment(foodId, comment, author) {
    const collection = await foodModel.getCollection();
    let food = await collection.findOne({_id: foodId});
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
    const collection = await foodModel.getCollection();
    let food = await collection.findOne({_id: foodId});
    if (!food) {
        return null;
    }
    return food.comments;
}

module.exports = {
    createComment,
    getComments,
};
