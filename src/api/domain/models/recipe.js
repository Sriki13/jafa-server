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

async function getCollection() {
    const db = await require("./../../../_helpers/database");
    return db.collection("recipes");
}


async function update(recipe) {
    if (recipe._id == null) {
        throw "Recipe object must have 'id' attribute";
    }

    const collection = await getCollection();
    return await collection.save(recipe);
}

module.exports = {
    getCollection,
    update
};
