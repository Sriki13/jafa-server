const Food             = require("./models/food").Food;
const SearchController = require("./search.controller")
const Exceptions       = require("./exceptions")



async function createComment(foodId, comment) {
    let food = await Food.findOne({id: foodId})
    
    if (!food) {
        return null
    }

    food.comments.push(comment)
    food = await SearchController.updateFood(food)
    return food
}



module.exports = {
    createComment,
};
