const Food             = require("./models/food").Food;
const SearchController = require("./search.controller");


async function createComment(foodId, comment, author) {
    let food = await Food.findOne({id: foodId});
    
    if (!food) {
        return null
    }

    comment.author = author;
    food.comments.push(comment);
    return await SearchController.updateFood(food);
}



module.exports = {
    createComment,
};
