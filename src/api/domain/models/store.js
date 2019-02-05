// Kept here as reference
// noinspection JSUnusedLocalSymbols
const storeSchema = {
    id: Number, // MongoId
    name: String,
    address: String,
    lat: String,
    long: String,
    region: String
};

function getCollection() {
    const db = require("./../../../app").getDatabase();
    return db.collection("stores");
}

module.exports = {
    getCollection
};
