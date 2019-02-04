const mongoose = require('mongoose');
const ObjectId = require("mongoose").Schema.Types.ObjectId;

const recipeSchema = new mongoose.Schema({
    id: ObjectId,
    title: String,
    text: String,
    authorId: ObjectId,
    ingredients: [new mongoose.Schema({
        name: String,
        quantity: Number,
        unit: String,
        foodId: String
    }, {_id: false})],
    date: Date,
    comments: [{
        id: ObjectId, author: String, message: String
    }]
});

const Recipe = mongoose.model('Recipe', recipeSchema, "recipe");

module.exports = {
    Recipe
};
