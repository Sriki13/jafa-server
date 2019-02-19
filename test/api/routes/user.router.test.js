const request = require('supertest');
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;

const User = require('../../../src/api/domain/models/user');
const app = require('../../../src/app');
const testUtils = require("./../testUtils");

describe('user.router.js', function () {

    this.timeout(10000);

    before(async () => {
        await testUtils.setupApp();
    });

    after(async () => {
        await app.stop();
    });

    beforeEach(async () => {
        await testUtils.cleanCollections([User]);
    });

    let testUserId = "5c4f175a2176a25ef65af109";
    let testUser = {
        _id: ObjectId(testUserId),
        username: "david",
        firstName: "davidF",
        lastName: "lang",
        date: 1549895037322,
        hash: "$2a$10$uAx0NLoVZDD24IugRqq5EOiLlZT541rLPllrfKF2UMg.h02MhG4U6"
    };

    describe("POST /users/authenticate", () => {

        it("should 400 with the wrong password", async () => {
            await testUtils.insert(User, testUser);
            await request.agent(app.server)
                .post("/jafa/api/users/authenticate")
                .send({username: "david", password: "nope"})
                .expect(400);
        });

        it("should 400 if the user does not exist", async () => {
            await request.agent(app.server)
                .post("/jafa/api/users/authenticate")
                .send({username: "david", password: "demo"})
                .expect(400);
        });

        it("should 400 without params", async () => {
            await request.agent(app.server)
                .post("/jafa/api/users/authenticate")
                .send({})
                .expect(400);
        });

        it("should return a token", async () => {
            await testUtils.insert(User, testUser);
            let res = await request.agent(app.server)
                .post("/jafa/api/users/authenticate")
                .send({username: "david", password: "demo"})
                .expect(200);
            assert(JSON.parse(res.text) != null);
        });

    });

    describe("POST /users/register", async () => {

        it("should 400 when missing username or password or both", async () => {
            await request.agent(app.server)
                .post("/jafa/api/users/register")
                .send({username: "david"})
                .expect(400);
            await request.agent(app.server)
                .post("/jafa/api/users/register")
                .send({password: "nope"})
                .expect(400);
            await request.agent(app.server)
                .post("/jafa/api/users/register")
                .send({})
                .expect(400);
        });

        it("should create an user", async () => {
            await request.agent(app.server)
                .post("/jafa/api/users/register")
                .send({username: "david", password: "demo"})
                .expect(200);
            let userCollection = await User.getCollection();
            let user = await userCollection.findOne({username: "david"});
            assert(user != null);
        });

    });

    describe("PUT /users/:id", async () => {

        it("should 401 without a token", async () => {
            await testUtils.insert(User, testUser);
            await request.agent(app.server)
                .put("/jafa/api/users/" + testUserId)
                .send({username: "salut", password: "demo"})
                .expect(401);
        });

        it("should update user info", async () => {
            const token = await testUtils.setupTestUser(testUser);
            await request.agent(app.server)
                .put("/jafa/api/users/" + testUserId)
                .set('Authorization', 'bearer ' + token)
                .send({username: "salut", password: "demo"})
                .expect(200);
            let userCollection = await User.getCollection();
            let user = await userCollection.findOne({username: "salut"});
            assert(user != null);
        });

    });

    describe("DELETE /users/:id", () => {

        it("should 401 without a token", async () => {
            await testUtils.insert(User, testUser);
            await request.agent(app.server)
                .delete("/jafa/api/users/" + testUserId)
                .expect(401);
        });

        it("should remove the user", async () => {
            const token = await testUtils.setupTestUser(testUser);
            await request.agent(app.server)
                .delete("/jafa/api/users/" + testUserId)
                .set('Authorization', 'bearer ' + token)
                .expect(200);
            let user = await testUtils.find(User, testUserId);
            assert(user == null);
        });

    });

});