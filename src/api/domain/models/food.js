const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const foodSchema = new mongoose.Schema({
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
    comments: [{
        id: ObjectId, author: String, message: String, timestamp: Date
    }]
}, {id: false});


function checkArrayDefined(item) {
    return item !== undefined && item !== [];
}

foodSchema.methods.assignInitialScore = function () {
    console.log("Assigning new score");
    if (this.product_name === undefined) {
        let result = [];
        result.push(0);
        this.scores = result;
        return;
    }
    let base = 0;
    if (checkArrayDefined(this.ingredients)) {
        base += 2;
    }
    for (let str in ["states_tags", "categories_tags"]) {
        if (checkArrayDefined(this[str])) {
            base += 1;
        }
    }
    if (this.quantity !== undefined) {
        base += 1;
    }
    if (this.nutriments !== undefined && this.nutriments !== {}) {
        base += 1;
    }
    base += Math.random() * 4;
    let result = [];
    result.push(base);
    this.scores = result;
};

foodSchema.methods.getImagesData = function () {
    let result = [];
    for (let prop in this.images) {
        if (isNaN(prop)) {
            result.push({
                name: prop,
                rev: this.images[prop].rev
            });
        }
    }
    return result;
};

const Food = mongoose.model('Food', foodSchema, "france");

module.exports = {
    Food
};