const mongoose = require('mongoose');
const ObjectId = require("mongoose").Schema.Types.ObjectId;

const recipeSchema = new mongoose.Schema({
    id: ObjectId,
    title: String,
    text: String,
    authorId: ObjectId,
    ingredients: [{
        name: String,
        quantity: Number,
        unit: String,
        foodId: ObjectId
    }],
    date: Date,
    comments: [String] // TODO: use comment model
});

const Recipe = mongoose.model('Recipe', recipeSchema, "recipe");

module.exports = {
    Recipe
};
