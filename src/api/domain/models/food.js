const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    id: String,
    product_name: String,
    ingredients: [{
        text: String, id: String, rank: Number
    }],

    manufacturing_places_tags: Array,
    packaging: String,
    brands: String,

    rev: Number, // number of revisions

    quantity: String,
    serving_size: String,
    product_quantity: String,
    serving_quantity: Number,

    states_tags: Array,
    categories_tags: Array,
    allergens_tags: Array,
    traces_tags: Array,
    quality_tags: Array,
    vitamin_tags: Array,
    additives_tags: String,
    nutrient_levels_tags: Array,

    nutrition_grades_tags: Array,
    nutrition_data_prepared_per: String,
    nutrition_data_per: String,

    nutriments: Object,
    with_sweeteners: Number, // 1 if true
    comments: Array,
    scores: Array
});

function checkArrayDefined(item) {
    return item !== undefined && item !== [];
}

foodSchema.methods.assignInitialScore = () => {
    if (this.product_name === undefined) {
        this.scores = [0];
        return;
    }
    let base = 0;
    if (checkArrayDefined(this.ingredients)) {
        base += 2;
    }
    for (let str in ["states_tags", "categories_tags", "allergens_tags", "additives_tags", "vitamin_tags"]) {
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
    base += Math.random();
    this.scores = [base];
};


const Food = mongoose.model('Food', foodSchema, "france");

module.exports = {
    Food,
};