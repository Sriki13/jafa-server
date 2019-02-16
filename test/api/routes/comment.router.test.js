const request = require('supertest');
const ObjectId = require('mongodb').ObjectID;
const assert = require('assert');

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

    const testFoodId = "testFoodId";

    describe("POST /foods/:id/comment", () => {

        const testFood = {_id: testFoodId, product_name: "whatever"};

        it("should return 401 without a token", async () => {
            await request.agent(app.server)
                .post('/jafa/api/foods/' + testFoodId + "/comment")
                .send({})
                .expect(401);
        });

        it("should return 400 if the request has no message", async () => {
            await testUtils.insert(Food, testFood);
            await request.agent(app.server)
                .post('/jafa/api/foods/' + testFoodId + "/comment")
                .set('Authorization', 'bearer ' + token)
                .send({})
                .expect(400);
        });

        it("should return 400 if the food does not exist", async () => {
            await request.agent(app.server)
                .post("/jafa/api/foods/nope/comment")
                .set("Authorization", "bearer " + token)
                .send({message: "lache ton com"})
                .expect(400);
        });

        it("should add the comment if everything is OK", async () => {
            await testUtils.insert(Food, testFood);
            await request.agent(app.server)
                .post('/jafa/api/foods/' + testFoodId + "/comment")
                .set("Authorization", "bearer " + token)
                .send({message: "lache ton com"})
                .expect(200);
            let foodCollection = await Food.getCollection();
            let food = await foodCollection.findOne({_id: testFoodId});
            assert.strictEqual(food.comments.length, 1);
        });

    });

    describe("GET /foods/:id/comment", () => {

        it("should return 400 if the food does not exist", async () => {
            await request.agent(app.server)
                .get("/jafa/api/foods/nope/comment")
                .expect(400);
        });

        it("should return the comments of a food", async () => {
            const comments = ["un com"];
            await testUtils.insert(Food, {_id: testFoodId, product_name: "salut", comments: comments});
            await request.agent(app.server)
                .get("/jafa/api/foods/" + testFoodId + "/comment")
                .expect(200, comments);
        });

        it("should return an empty array if there are no comments", async () => {
            await testUtils.insert(Food, {_id: testFoodId, product_name: "salut"});
            await request.agent(app.server)
                .get("/jafa/api/foods/" + testFoodId + "/comment")
                .expect(200, []);
        });

    });

    const testRecipeId = "5c4f1db68211a061c64a6995";

    describe("POST /recipes/:id/comment", () => {

        const testRecipe = {_id: ObjectId(testRecipeId), title: "grattons"};

        it("should return 401 without a token", async () => {
            await request.agent(app.server)
                .post('/jafa/api/recipes/' + testRecipeId + "/comment")
                .send({})
                .expect(401);
        });

        it("should return 400 if the request has no message", async () => {
            await testUtils.insert(Recipe, testRecipe);
            await request.agent(app.server)
                .post('/jafa/api/recipes/' + testRecipeId + "/comment")
                .set('Authorization', 'bearer ' + token)
                .send({})
                .expect(400);
        });

        it("should return 400 if the recipe does not exist", async () => {
            await request.agent(app.server)
                .post("/jafa/api/recipes/nope/comment")
                .set("Authorization", "bearer " + token)
                .send({message: "lache ton com"})
                .expect(400);
        });

        it("should add the comment if everything is OK", async () => {
            await testUtils.insert(Recipe, testRecipe);
            await request.agent(app.server)
                .post('/jafa/api/recipes/' + testRecipeId + "/comment")
                .set("Authorization", "bearer " + token)
                .send({message: "lache ton com"})
                .expect(200);
            let recipeCollection = await Recipe.getCollection();
            let recipe = await recipeCollection.findOne({_id: ObjectId(testRecipeId)});
            assert.strictEqual(recipe.comments.length, 1);
        });

    });

    describe("GET /recipes/:id/comments", () => {

        it("should return 400 if the recipe does not exist", async () => {
            await request.agent(app.server)
                .get("/jafa/api/recipes/nope/comment")
                .expect(400);
        });

        it("should return the comments of a recipe", async () => {
            const comments = ["un com", "deux coms"];
            await testUtils.insert(Recipe, {_id: ObjectId(testRecipeId), title: "salut", comments: comments});
            await request.agent(app.server)
                .get("/jafa/api/recipes/" + testRecipeId + "/comment")
                .expect(200, comments);
        });

        it("should return an empty array if there are no comments", async () => {
            await testUtils.insert(Recipe, {_id: ObjectId(testRecipeId), title: "salut", comments: []});
            await request.agent(app.server)
                .get("/jafa/api/recipes/" + testRecipeId + "/comment")
                .expect(200, []);
        });

    });


});