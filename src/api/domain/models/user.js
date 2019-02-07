// Kept here as reference
// noinspection JSUnusedLocalSymbols
const schema = {
    username: String,
    hash: String,
    firstName: String,
    lastName: String,
    date: Date
};

async function getCollection() {
    const db = await require("./../../../_helpers/database");
    return db.collection("users");
}

module.exports = {
    getCollection
};