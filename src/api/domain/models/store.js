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

async function getCollection() {
    const db = await require("./../../../_helpers/database");
    return db.collection("stores");
}

module.exports = {
    getCollection
};
