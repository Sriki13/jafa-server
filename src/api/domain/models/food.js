const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    id: String,
    product_name: String,
    product_name_vi: String,
});

const Food = mongoose.model('Food', foodSchema, "vietnam");

module.exports = {
    Food,
};