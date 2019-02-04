// Kept here as reference
// noinspection JSUnusedLocalSymbols
const recipeSchema = {
    id: Number, // MongoId
    title: String,
    text: String,
    authorId: Number, // MongoId
    ingredients: [{
        name: String,
        quantity: Number,
        unit: String,
        foodId: String // optional
    }],
    date: Date,
    comments: [{
        id: Number, // MongoId
        author: String,
        message: String
    }]
};

function getCollection() {
    const db = require("./../../../app").getDatabase();
    return db.collection("recipes");
}

module.exports = {
    getCollection
};
