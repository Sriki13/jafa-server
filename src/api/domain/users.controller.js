const config = require('../../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('./models/user');
const ObjectId = require('mongodb').ObjectID;

module.exports = {
    authenticate,
    create,
    update,
    getById,
    delete: _delete
};

async function authenticate({username, password}) {
    const collection = await userModel.getCollection();
    const user = await collection.findOne({username});
    if (user && bcrypt.compareSync(password, user.hash)) {
        const {hash, ...userWithoutHash} = user;
        const token = jwt.sign({sub: user._id}, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getById(id) {
    const collection = await userModel.getCollection();
    return await collection.findOne({_id: ObjectId(id)});
}

async function create(userParam) {
    // validate
    const collection = await userModel.getCollection();
    if (await collection.findOne({username: userParam.username})) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = userParam;

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await collection.save(user);
}

async function update(id, userParam) {
    const collection = await userModel.getCollection();
    const user = await collection.findOne({_id: ObjectId(id)});

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username
        && await collection.findOne({username: userParam.username})) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    const collection = await userModel.getCollection();
    await collection.findOneAndDelete({_id: ObjectId(id)});
}