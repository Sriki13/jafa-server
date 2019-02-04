const storeModel = require("./models/store");

async function getStore(id) {
    return await storeModel.getCollection().findById(String(id));
}

async function getStores(search) {
    if (search == null) {
        search = "";
    }
    return await storeModel.getCollection().find({
        name: {'$regex': search, '$options': 'i'}
    }, {limit: 10});
}

async function addStore(name, address, lat, long) {
    let store = {
        name: name,
        address: address,
        lat: lat,
        long: long
    };
    await storeModel.getCollection().save(store);
    return store;
}

module.exports = {
    getStore,
    getStores,
    addStore
};