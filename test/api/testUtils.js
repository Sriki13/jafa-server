const app = require('../../src/app');
const config = require('../../src/config.json');
const ObjectId = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');

const User = require('../../src/api/domain/models/user');
const Food = require('../../src/api/domain/models/food');

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

async function setupApp() {
    await app.start();
    await sleep(1000);
}

async function cleanCollections(models) {
    models.forEach(async function (model) {
        let collection = await model.getCollection();
        await collection.remove({});
    });
}

const testUser = {
    _id: ObjectId(0),
    username: "david",
    firstName: "david",
    lastName: "lang",
    date: 1549895037322,
    hash: "$2a$10$uAx0NLoVZDD24IugRqq5EOiLlZT541rLPllrfKF2UMg.h02MhG4U6"
};

async function setupTestUser(user) {
    if (user == null)
        user = testUser;
    let userCollection = await User.getCollection();
    await userCollection.save(user);
    return jwt.sign({sub: user._id}, config.secret);
}

async function insert(model, item) {
    let collection = await model.getCollection();
    return await collection.save(item);
}

async function find(model, id) {
    let collection = await model.getCollection();
    return await collection.findOne({"_id": id});
}

module.exports = {
    setupApp,
    cleanCollections,
    setupTestUser,
    insert,
    sleep,
    testUser,
    find,
};