const request = require('supertest');
const ObjectId = require('mongodb').ObjectID;
const assert = require('assert');

const Food = require('../../../src/api/domain/models/food');
const Store = require('../../../src/api/domain/models/store');
const app = require('../../../src/app');
const testUtils = require("./../testUtils");

describe('price.router.js', function () {

    this.timeout(10000);
    let token;

    before(async () => {
        await testUtils.setupApp();
        token = await testUtils.setupTestUser();
        await testUtils.cleanCollections([Store]);
        await testUtils.insert(Store, testStore);
    });

    after(async () => {
        await testUtils.cleanCollections([Store]);
        await app.stop();
    });

    beforeEach(async () => {
        await testUtils.cleanCollections([Food]);
    });

    const testStoreStringId = "5c59baab0a8ddf0016bfbb3d";
    const testStoreId = ObjectId(testStoreStringId);
    const testStore = {
        _id: testStoreId,
        name: "Casino supermarché St Philippe",
        address: "Avenue Roumanille, 06410 Biot",
        lat: "43.61763",
        long: "7.075193",
        region: "PACA"
    };

    const foodWithPriceId = "testFoodId";
    const foodWithoutPriceId = "testFoodNoPriceId";
    const foodWithPrice = {
        _id: foodWithPriceId,
        product_name: "whatever",
        prices: [{price: 12, storeId: testStoreId}],
        price: 19
    };
    const foodWithoutPrice = {_id: foodWithoutPriceId, product_name: "whatever", prices: []};

    describe("GET jafa/api/foods/:id/price", () => {

        it("should 404 if the food does not exist", async () => {
            await request.agent(app.server)
                .get("/jafa/api/foods/nope/price")
                .expect(404);
        });

        it("should return the price of a food if it already exists", async () => {
            await testUtils.insert(Food, foodWithPrice);
            let res = await request.agent(app.server)
                .get("/jafa/api/foods/" + foodWithPriceId + "/price")
                .expect(200);
            let data = JSON.parse(res.text);
            assert.strictEqual(data[0].price, foodWithPrice.price);
            assert.strictEqual(data[0].store.name, testStore.name);
        });

        it("should return an empty array without prices", async () => {
            await testUtils.insert(Food, foodWithoutPrice);
            await request.agent(app.server)
                .get("/jafa/api/foods/" + foodWithoutPriceId + "/price")
                .expect(200, []);
        });

    });

    describe("POST jafa/api/foods/:id/price", () => {

        it("should 401 without a token", async () => {
            await request.agent(app.server)
                .post("/jafa/api/foods/nope/price")
                .send({price: 15, storeId: testStoreStringId})
                .expect(401);
        });

        it("should 404 if the food does not exist", async () => {
            await request.agent(app.server)
                .post("/jafa/api/foods/nope/price")
                .set("Authorization", "bearer " + token)
                .send({price: 15, storeId: testStoreStringId})
                .expect(404);
        });

        it("should 400 if the store does not exist", async () => {
            await testUtils.insert(Food, foodWithoutPrice);
            await request.agent(app.server)
                .post("/jafa/api/foods/" + foodWithoutPriceId + "/price")
                .set("Authorization", "bearer " + token)
                .send({price: 15, storeId: "salut"})
                .expect(400);
        });

        it("should 400 if missing params", async () => {
            await testUtils.insert(Food, foodWithoutPrice);
            await request.agent(app.server)
                .post("/jafa/api/foods/" + foodWithoutPriceId + "/price")
                .set("Authorization", "bearer " + token)
                .send({})
                .expect(400);
            await request.agent(app.server)
                .post("/jafa/api/foods/" + foodWithoutPriceId + "/price")
                .set("Authorization", "bearer " + token)
                .send({price: 15})
                .expect(400);
            await request.agent(app.server)
                .post("/jafa/api/foods/" + foodWithoutPriceId + "/price")
                .set("Authorization", "bearer " + token)
                .send({storeId: testStoreStringId})
                .expect(400);
        });

        it("should add the new price", async () => {
            await testUtils.insert(Food, foodWithoutPrice);
            await request.agent(app.server)
                .post("/jafa/api/foods/" + foodWithoutPriceId + "/price")
                .set("Authorization", "bearer " + token)
                .send({price: 15, storeId: testStoreStringId})
                .expect(200);
            let foodCollection = await Food.getCollection();
            let food = await foodCollection.findOne({_id: foodWithoutPriceId});
            assert.strictEqual(food.prices.length, 1);
        });


    });

});