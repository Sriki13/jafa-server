const Store = require("./models/store").Store;

async function getStore(id) {
    return await Store.findById(String(id));
}

async function getStores(search) {
    if (search == null) {
        search = "";
    }
    return await Store.find({
        name: {'$regex': search, '$options': 'i'}
    }).limit(10);
}

async function addStore(name, address, lat, long) {
    let store = new Store({
        name: name,
        address: address,
        lat: lat,
        long: long
    });
    await store.save();
    return store;
}

module.exports = {
    getStore,
    getStores,
    addStore
};