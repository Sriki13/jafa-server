const mongoose = require('mongoose');
const ObjectId = require("mongoose").Schema.Types.ObjectId;

const storeSchema = new mongoose.Schema({
    id: ObjectId,
    name: String,
    address: String,
    lat: String,
    long: String
});

const Store = mongoose.model('Store', storeSchema, "store");

module.exports = {
    Store
};
