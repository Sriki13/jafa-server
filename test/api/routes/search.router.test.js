const request = require('supertest');
const ObjectId = require('mongodb').ObjectID;

const Food = require('../../../src/api/domain/models/food');
const Store = require('../../../src/api/domain/models/store');
const Recipe = require('../../../src/api/domain/models/recipe');
const app = require('../../../src/app');
const testUtils = require("./../testUtils");

describe('search.router.js', function () {

    this.timeout(10000);

    before(async () => {
        await testUtils.setupApp();
    });

    after(async () => {
        await app.stop();
    });

    beforeEach(async () => {
        await testUtils.cleanCollections([Food, Store, Recipe]);
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


        it('should return 400 if page number is less than 1', async function () {
            await request.agent(app.server)
                .get('/jafa/api/foods')
                .query({page: 0})
                .expect(400);
            await request.agent(app.server)
                .get('/jafa/api/foods')
                .query({page: 1})
                .expect('Content-Type', /json/)
                .expect(200, {data: [], count: 0});
        });

        it('should return 400 if order is different from "asc" or "desc"', async function () {
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


        it('should return 400 if region is not known', async function () {
            await request.agent(app.server)
                .get('/jafa/api/foods')
                .query({region: "anything"})
                .expect(400);
        });

        const testStore = {
            name: "Carrefour Antibes",
            address: "Chemin de Saint-Claude, 06600 Antibes",
            lat: "43.60352179511596",
            long: "7.088536031822969",
            region: "PACA"
        };

        function createFoodWithPrice(storeId) {
            return {
                _id: 1, product_name: "tacos one meal", "prices": [
                    {
                        "price": 16.55,
                        "storeId": ObjectId(storeId)
                    }
                ]
            }
        }

        it("should return the correct foods if a region is known", async () => {
            let collectionStore = await Store.getCollection();
            let collectionFood = await Food.getCollection();
            await collectionStore.insert(testStore);
            let testFood = createFoodWithPrice(testStore._id);
            await collectionFood.insert(testFood);
            await request.agent(app.server)
                .get('/jafa/api/foods')
                .query({region: "PACA"})
                .expect(200, {
                    data: [{
                        "id": 1,
                        "images": [],
                        "name": "tacos one meal"
                    }],
                    count: 1
                });
        });

        it('should return 400 if store is not known', async function () {
            await request.agent(app.server)
                .get('/jafa/api/foods')
                .query({shop: "anything"})
                .expect(400);
        });

        it("should return the correct food if a store is known", async () => {
            let collectionStore = await Store.getCollection();
            let collectionFood = await Food.getCollection();
            await collectionStore.insert(testStore);
            let testFood = createFoodWithPrice(testStore._id);
            await collectionFood.insert(testFood);
            await request.agent(app.server)
                .get('/jafa/api/foods')
                .query({shop: testStore._id.toString()})
                .expect(200, {
                    data: [{
                        "id": 1,
                        "images": [],
                        "name": "tacos one meal",
                        price: 16.55
                    }],
                    count: 1
                });
        })

    });

    describe("PUT /foods", () => {
        it("should return 400 if trying to update food without id", async () => {
            await request.agent(app.server)
                .put("/jafa/api/foods")
                .send({product_name: "whatever"})
                .expect(400);
        });
        it("should return the edited food with 200", async () => {
            const foodCollection = await Food.getCollection();
            await foodCollection.insert({_id: "salut", product_name: "whatever"});
            await request.agent(app.server)
                .put("/jafa/api/foods")
                .send({_id: "salut", product_name: "new"})
                .expect({_id: "salut", product_name: "new"});
        });
    });

    describe("GET /recipes", () => {
        it("should return 400 with an invalid page", async () => {
            await request.agent(app.server)
                .get("/jafa/api/recipes")
                .query({page: -1})
                .expect(400);
            await request.agent(app.server)
                .get("/jafa/api/recipes")
                .query({page: "lol"})
                .expect(400);
        });

        it("should return available recipes", async () => {
            const recipeCollection = await Recipe.getCollection();
            let testRecipe = {
                _id: 1,
                title: "salut",
                authorId: 5,
                ingredients: [],
                comments: [],
            };
            await recipeCollection.insert(testRecipe);
            await request.agent(app.server)
                .get("/jafa/api/recipes")
                .expect({data: [testRecipe], count: 1});
        })
    });


});