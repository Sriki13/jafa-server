var assert = require('assert');
const Food = require('../../../src/api/domain/models/food');
const Store = require('../../../src/api/domain/models/store');
const app = require('../../../src/app');
const request = require('supertest');


describe('search.controller.js', function () {

    this.timeout(10000);

    function sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms)
        })
    }

    before(async () => {
        await app.start();
        await sleep(1000);
    });

    after(async () => {
        await app.stop();
    });


    beforeEach(async () => {
        let models = [Food, Store];
        models.forEach(async function(model) {
            let collection = await model.getCollection();
            await collection.remove({});
        });
    });


    describe('GET /foods', function () {

        it('should return 200 and an array of foods if request is correct', async function () {
            let collection = await Food.getCollection();
            await collection.insert({_id: 1, product_name: "tacos one meal"});
            await request.agent(app.server)
                .get('/jafa/api/foods')
                .expect('Content-Type', /json/)
                .expect(200, {
                        data: [{id: 1, images: [], name: "tacos one meal"}],
                        count: 1,
                    }
                );
        });


        it('should return 400 (bad request) if page number is less than 1', async function() {
            await request.agent(app.server)
                .get('/jafa/api/foods')
                .query({ page: 0 })
                .expect(400);
            await request.agent(app.server)
                .get('/jafa/api/foods')
                .query({ page: 1 })
                .expect('Content-Type', /json/)
                .expect(200, {data: [], count: 0});
        });

        it('should return 400 (bad request) if order is different from "asc" or "desc"', async function() {
           await request.agent(app.server)
               .get('/jafa/api/foods')
               .query({order: "anything"})
               .expect(400);
            await request.agent(app.server)
                .get('/jafa/api/foods')
                .query({order: "asc"})
                .expect(200, {data: [], count: 0});
            await request.agent(app.server)
                .get('/jafa/api/foods')
                .query({order: "desc"})
                .expect(200, {data: [], count: 0});
        });

        it('should return 400 (bad request) if region is not known', async function() {
            await request.agent(app.server)
                .get('/jafa/api/foods')
                .query({region: "anything"})
                .expect(400);
            let collectionStore = await Store.getCollection();
            let collectionFood = await Store.getCollection();
            let store = {
                name: "Carrefour Antibes",
                address: "Chemin de Saint-Claude, 06600 Antibes",
                lat: "43.60352179511596",
                long: "7.088536031822969",
                region: "PACA"
            };
            await collectionStore.insert(store);
            await collectionFood.insert({_id: 1, product_name: "tacos one meal", "prices": [
                    {
                        "price": 16.55602801531245,
                        "storeId": {
                            "oid": store._id
                        }
                    }
                ]});
            await request.agent(app.server)
                .get('/jafa/api/foods')
                .query({region: "PACA"})
                .expect(200, {data: [], count: 0});
        });

        it('should return 400 (bad request) if store is not known', async function() {
            await request.agent(app.server)
                .get('/jafa/api/foods')
                .query({shop: "anything"})
                .expect(400);
            let collectionStore = await Store.getCollection();
            let collectionFood = await Store.getCollection();
            let store = {
                name: "Carrefour Antibes",
                address: "Chemin de Saint-Claude, 06600 Antibes",
                lat: "43.60352179511596",
                long: "7.088536031822969",
                region: "PACA"
            };
            await collectionStore.insert(store);
            await collectionFood.insert({_id: 1, product_name: "tacos one meal", "prices": [
                    {
                        "price": 16.55602801531245,
                        "storeId": {
                            "oid": store._id
                        }
                    }
                ]});
            await request.agent(app.server)
                .get('/jafa/api/foods')
                .query({shop: store._id.toString()})
                .expect(200, {data: [], count: 0});
        });

    });


});