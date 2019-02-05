const storeModel = require("./models/store");

async function getStore(id) {
    return await storeModel.getCollection().findOne({_id: id});
}

async function searchStore(search) {
    if (search == null) {
        search = "";
    }
    let count = await storeModel.getCollection().count({
        name: {'$regex': search, '$options': 'i'}
    });
    let data = await storeModel.getCollection().find({
        name: {'$regex': search, '$options': 'i'}
    }, {limit: 20}).toArray();
    return {
        data: data,
        count: count
    };
}

async function addStore(name, address, lat, long, region) {
    let store = {
        name: name,
        address: address,
        lat: lat,
        long: long,
        region: region
    };
    await storeModel.getCollection().save(store);
    return store;
}

module.exports = {
    getStore,
    searchStore,
    addStore
};