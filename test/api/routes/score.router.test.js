const request = require('supertest');
const ObjectId = require('mongodb').ObjectID;
const assert = require('assert');

const Food = require('../../../src/api/domain/models/food');
const Recipe = require('../../../src/api/domain/models/recipe');
const User = require('../../../src/api/domain/models/user');
const app = require('../../../src/app');
const testUtils = require("./../testUtils");

describe('score.router.js', function () {

    this.timeout(10000);
    let token;

    before(async () => {
        await testUtils.setupApp();
        await testUtils.cleanCollections([User]);
        token = await testUtils.setupTestUser();
    });

    after(async () => {
        await app.stop();
    });

    beforeEach(async () => {
        await testUtils.cleanCollections([Food, Recipe]);
    });

    const testFoodId = "salut";
    const testFood = {_id: testFoodId, product_name: "whatever", scores: [5.5, 6.5], score: 6};

    describe("GET /foods/:id/score", () => {

        it("should 404 if the food does not exist", async () => {
            await request.agent(app.server)
                .get('/jafa/api/foods/nope/score')
                .expect(404);
        });

        it("should return the food score otherwise", async () => {
            await request.agent(app.server)
                .get('/jafa/api/foods/nope/score')
                .expect(404);
        });

    });

    describe("POST /foods/:id/score", () => {

        it("should 404 if the food does not exist", async () => {
            await request.agent(app.server)
                .post('/jafa/api/foods/nope/score')
                .set('Authorization', 'bearer ' + token)
                .send({score: 7})
                .expect(404);
        });

        it("should 401 without a token", async () => {
            await testUtils.insert(Food, testFood);
            await request.agent(app.server)
                .post("/jafa/api/foods/" + testFoodId + "/score")
                .send({score: 7})
                .expect(401);
        });

        it("should 400 without params", async () => {
            await testUtils.insert(Food, testFood);
            await request.agent(app.server)
                .post("/jafa/api/foods/" + testFoodId + "/score")
                .set('Authorization', 'bearer ' + token)
                .send({})
                .expect(400);
        });

        it("should 400 with a score < 0 or > 10", async () => {
            await testUtils.insert(Food, testFood);
            await request.agent(app.server)
                .post("/jafa/api/foods/" + testFoodId + "/score")
                .set('Authorization', 'bearer ' + token)
                .send({score: -1})
                .expect(400);
            await request.agent(app.server)
                .post("/jafa/api/foods/" + testFoodId + "/score")
                .set('Authorization', 'bearer ' + token)
                .send({score: 11})
                .expect(400);
        });

        it("should add a score", async () => {
            await testUtils.insert(Food, testFood);
            await request.agent(app.server)
                .post("/jafa/api/foods/" + testFoodId + "/score")
                .set('Authorization', 'bearer ' + token)
                .send({score: 7.5})
                .expect(200);
            let food = await testUtils.find(Food, testFoodId);
            assert.strictEqual(food.scores.length, 3);
            assert.strictEqual(food.score, 6.5);
        });

    });


});