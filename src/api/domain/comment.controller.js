const foodModel = require("./models/food");
const recipeModel = require('./models/recipe');
const ObjectId = require('mongodb').ObjectID;

async function createFoodComment(foodId, comment, author) {
    return await createComment(foodId, comment, author, foodModel);
}

async function createRecipeComment(recipeId, comment, author) {
    return await createComment(ObjectId(recipeId), comment, author, recipeModel)
}

async function createComment(id, comment, author, model) {
    const collection = await model.getCollection();
    let objectToComment = await collection.findOne({_id: id});
    if (!objectToComment) {
        return null;
    }
    comment.author = author;
    comment.timestamp = (new Date).getTime();
    if (objectToComment.comments == null) {
        objectToComment.comments = [];
    }
    objectToComment.comments.push(comment);
    let response = await model.update(objectToComment);
    return response;
}

async function getFoodComments(foodId) {
   const collection = await foodModel.getCollection();
   return await getComments(foodId, collection);
}


async function getRecipeComments(recipeId) {
    const collection = await recipeModel.getCollection();
    return await getComments(ObjectId(recipeId), collection);
}

async function getComments(id, collection) {
    let item = await collection.findOne({_id: id});
    if (!item) {
        return null;
    }
    return (item.comments === null || item.comments === undefined) ? [] : item.comments;
}

module.exports = {
    createFoodComment,
    createRecipeComment,
    getFoodComments,
    getRecipeComments,
};
