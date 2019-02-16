const request = require('supertest');
const ObjectId = require('mongodb').ObjectID;

const Food = require('../../../src/api/domain/models/food');
const Recipe = require('../../../src/api/domain/models/recipe');
const app = require('../../../src/app');
const testUtils = require("./../testUtils");

describe('comment.router.js', function () {

    this.timeout(10000);
    let token;

    before(async () => {
        await testUtils.setupApp();
        token = await testUtils.setupTestUser();
    });

    after(async () => {
        await app.stop();
    });


    beforeEach(async () => {
        await testUtils.cleanCollections([Food, Recipe]);
    });

    describe("POST /foods/:id/comments", () => {

        const testFoodId = "testFoodId";

        async function addTestFood() {
            let foodCollection = await Food.getCollection();
            foodCollection.insert({
                _id: testFoodId,
                product_name: "whatever"
            });
        }

        it("should return 401 without a token", async () => {
            await request.agent(app.server)
                .post('/jafa/api/foods/' + testFoodId + "/comment")
                .send({})
                .expect(401);
        });

        it("should return 400 if the request has no message", async () => {
            await addTestFood();
            await request.agent(app.server)
                .post('/jafa/api/foods/' + testFoodId + "/comment")
                .set('Authorization', 'bearer ' + token)
                .send({})
                .expect(400);
        });

    });


});