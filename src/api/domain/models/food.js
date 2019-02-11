// Kept here as reference
// noinspection JSUnusedLocalSymbols
const foodSchema = {
    _id: String,
    product_name: String,
    ingredients: [{
        text: String, id: String, rank: Number
    }],

    images: Object,

    manufacturing_places_tags: [String],
    packaging: String,
    brands: String,

    rev: Number, // number of revisions

    quantity: String,
    serving_size: String,
    product_quantity: String,
    serving_quantity: Number,

    states_tags: [String],
    categories_tags: [String],
    allergens_tags: [String],
    traces_tags: [String],
    quality_tags: [String],
    vitamin_tags: [String],
    additives_tags: [String],
    nutrient_levels_tags: [String],

    nutrition_grades_tags: [String],
    nutrition_data_prepared_per: [String],
    nutrition_data_per: [String],

    nutriments: Object,
    with_sweeteners: Number, // 1 if true

    scores: [Number],
    score: Number, // average of scores
    comments: [{
        id: Number, // MongoId
        author: String,
        message: String,
        timestamp: Date
    }],

    prices: [{
        price: Number,
        storeId: Number // MongoId
    }],
    price: Number // average of prices
};


function checkArrayDefined(item) {
    return item !== undefined && item !== [];
}

function assignInitialScore(food) {
    console.log("Assigning new score to " + food._id + " with name " + food.product_name);
    if (food.product_name === undefined) {
        let result = [];
        result.push(0);
        food.scores = result;
        return;
    }
    let base = 0;
    if (checkArrayDefined(food.ingredients)) {
        base += 2;
    }
    for (let str in ["states_tags", "categories_tags"]) {
        if (checkArrayDefined(food[str])) {
            base += 1;
        }
    }
    if (food.quantity !== undefined) {
        base += 1;
    }
    if (food.nutriments !== undefined && food.nutriments !== {}) {
        base += 1;
    }
    base += Math.random() * 4;
    let result = [];
    result.push(base);
    food.scores = result;
}

function getImagesData(food) {
    let result = [];
    for (let prop in food.images) {
        if (isNaN(prop)) {
            result.push({
                name: prop,
                rev: food.images[prop].rev
            });
        }
    }
    return result;
}

async function update(food) {
    if (food._id == null) {
        throw "Food object must have 'id' attribute";
    }

    const collection = await getCollection();
    return await collection.findOneAndUpdate({id: food._id}, {$set: food}, {returnOriginal: false});
}

async function getCollection() {
    const db = await require('../../../_helpers/database');
    return db.collection("france");
}

module.exports = {
    getImagesData,
    assignInitialScore,
    getCollection,
    update,
};