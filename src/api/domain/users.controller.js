const config = require('../../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('./models/user');
const ObjectId = require('mongodb').ObjectID;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({username, password}) {
    const user = await userModel.getCollection().findOne({username});
    if (user && bcrypt.compareSync(password, user.hash)) {
        const {hash, ...userWithoutHash} = user;
        const token = jwt.sign({sub: user._id}, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getAll() {
    return await userModel.getCollection().find().project({hash: 0}).toArray();
}

async function getById(id) {
    return await userModel.getCollection().findOne({_id: ObjectId(id)});
}

async function create(userParam) {
    // validate
    if (await userModel.getCollection().findOne({username: userParam.username})) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = userParam;

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await userModel.getCollection().save(user);
}

async function update(id, userParam) {
    const user = await userModel.getCollection().findOne({_id: ObjectId(id)});

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username
        && await userModel.getCollection().findOne({username: userParam.username})) {
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
    await userModel.getCollection().findOneAndDelete({_id: ObjectId(id)});
}