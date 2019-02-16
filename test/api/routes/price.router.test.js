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

    const testStoreId = ObjectId("5c59baab0a8ddf0016bfbb3d");
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
        price: 12
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
            assert.strictEqual(data[0].price, 12);
            assert.strictEqual(data[0].store.name, testStore.name);
        });

        it("should return an empty array without prices", async () => {
            await testUtils.insert(Food, foodWithoutPrice);
            await request.agent(app.server)
                .get("/jafa/api/foods/" + foodWithoutPriceId + "/price")
                .expect(200, []);
        });

    });

});