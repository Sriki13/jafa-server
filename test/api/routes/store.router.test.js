const request = require('supertest');
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;

const Store = require('../../../src/api/domain/models/store');
const app = require('../../../src/app');
const testUtils = require("./../testUtils");

describe('score.router.js', function () {

    this.timeout(10000);

    before(async () => {
        await testUtils.setupApp();
    });

    after(async () => {
        await app.stop();
    });

    beforeEach(async () => {
        await testUtils.cleanCollections([Store]);
    });

    const testStoreId = "5c59baab0a8ddf0016bfbb3d";
    const testStore = {
        _id: ObjectId(testStoreId),
        name: "Casino supermarché St Philippe",
        address: "Avenue Roumanille, 06410 Biot",
        lat: "43.61763",
        long: "7.075193",
        region: "PACA"
    };

    describe("GET /stores/:id", async () => {

        it("should 404 if the store does not exist", async () => {
            await request.agent(app.server)
                .get('/jafa/api/stores/nope')
                .expect(404);
        });

        it("should return the correct store", async () => {
            await testUtils.insert(Store, testStore);
            let res = await request.agent(app.server)
                .get('/jafa/api/stores/' + testStoreId)
                .expect(200);
            let data = JSON.parse(res.text);
            assert.strictEqual(data._id, testStoreId);
        });

    });

    describe("GET /stores", () => {

        it("should return existing stores", async () => {
            await testUtils.insert(Store, testStore);
            let res = await request.agent(app.server)
                .get('/jafa/api/stores')
                .expect(200);
            let data = JSON.parse(res.text);
            assert.strictEqual(data.count, 1);
            assert.strictEqual(data.data[0]._id, testStoreId);
            assert.strictEqual(data.data.length, 1);
        });

    });

    describe("POST /stores", () => {

        it("should 400 if missing parameters", async () => {
            await request.agent(app.server)
                .post('/jafa/api/stores')
                .send({})
                .expect(400);
            await request.agent(app.server)
                .post('/jafa/api/stores')
                .send({
                    name: "Casino supermarché St Philippe",
                    lat: "43.61763",
                    long: "7.075193",
                    region: "PACA"
                })
                .expect(400);
            await request.agent(app.server)
                .post('/jafa/api/stores')
                .send({
                    lat: "43.61763",
                    long: "7.075193",
                    region: "PACA"
                })
                .expect(400);
            await request.agent(app.server)
                .post('/jafa/api/stores')
                .send({
                    name: "Casino supermarché St Philippe",
                    address: "Avenue Roumanille, 06410 Biot",
                    lat: "43.61763",
                })
                .expect(400);
        });

        it("should add a new store", async () => {
            await request.agent(app.server)
                .post('/jafa/api/stores')
                .send(testStore)
                .expect(200);
            let storeCollection = await Store.getCollection();
            let store = await storeCollection.findOne({name: testStore.name});
            assert.strictEqual(store.address, testStore.address);
            assert.strictEqual(store.lat, testStore.lat);
            assert.strictEqual(store.long, testStore.long);
            assert.strictEqual(store.region, testStore.region);
        });

    });


    describe("GET /regions", () => {

        it("should return an empty array without any regions", async () => {
            await request.agent(app.server)
                .get('/jafa/api/regions')
                .expect(200, []);
        });

        it("should return an array of regions from all stores", async () => {
            await testUtils.insert(Store, testStore);
            await testUtils.insert(Store, {region: "salut"});
            await request.agent(app.server)
                .get('/jafa/api/regions')
                .expect(200, [testStore.region, "salut"]);
        });

    });


});