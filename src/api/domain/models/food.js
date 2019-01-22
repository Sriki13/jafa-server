const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    id: String,
    product_name: String,
    product_name_vi: String,
    ingredients: [{
        text: String, id: String, rank: Number
    }]
});

foodSchema.methods.getName = function () {
    if (this.product_name !== undefined) {
        return this.product_name;
    } else return this.product_name_vi;
};

const Food = mongoose.model('Food', foodSchema, "france");

module.exports = {
    Food,
};