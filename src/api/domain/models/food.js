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
});

const Food = mongoose.model('Food', foodSchema, "france");

module.exports = {
    Food,
};