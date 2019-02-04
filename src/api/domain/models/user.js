// Kept here as reference
// noinspection JSUnusedLocalSymbols
const schema = {
    username: String,
    hash: String,
    firstName: String,
    lastName: String,
    date: Date
};

function getCollection() {
    const db = require("./../../../app").getDatabase();
    return db.collection("users");
}

module.exports = {
    getCollection
};