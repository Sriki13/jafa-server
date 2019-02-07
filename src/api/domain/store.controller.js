const storeModel = require("./models/store");

async function getStore(id) {
    const collection = await storeModel.getCollection();
    return await collection.findOne({_id: id});
}

async function searchStore(search) {
    const collection = await storeModel.getCollection();
    if (search == null) {
        search = "";
    }
    let count = await collection.count({
        name: {'$regex': search, '$options': 'i'}
    });
    let data = await collection.find({
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
    const collection = await storeModel.getCollection();
    await collection.save(store);
    return store;
}

module.exports = {
    getStore,
    searchStore,
    addStore
};