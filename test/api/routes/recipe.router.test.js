const request = require('supertest');
const ObjectId = require('mongodb').ObjectID;
const assert = require('assert');

const Food = require('../../../src/api/domain/models/food');
const Recipe = require('../../../src/api/domain/models/recipe');
const User = require('../../../src/api/domain/models/user');
const app = require('../../../src/app');
const testUtils = require("./../testUtils");

describe('recipe.router.js', function () {

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
    const testFoodName = " whatever";
    const testFood = {_id: testFoodId, product_name: testFoodName};

    describe("POST /recipes", () => {

        const testRecipeText = "titre\n- " + testFoodName + " / 100\nsteps lol";

        it("should 401 without a token", async () => {
            await request.agent(app.server)
                .post('/jafa/api/recipes')
                .send({recipeText: testRecipeText})
                .expect(401);
        });

        it("should 400 with no params", async () => {
            await request.agent(app.server)
                .post('/jafa/api/recipes')
                .set('Authorization', 'bearer ' + token)
                .send()
                .expect(400);
        });

        it("should return the parsed recipe and suggestions", async () => {
            await testUtils.insert(Food, testFood);
            let res = await request.agent(app.server)
                .post('/jafa/api/recipes')
                .set('Authorization', 'bearer ' + token)
                .send({recipeText: testRecipeText})
                .expect(200);
            let data = JSON.parse(res.text);
            assert.strictEqual(data.recipe.title, "titre");
            assert.strictEqual(data.suggestions[0][0].id, testFoodId);
        });

    });

    describe("POST /recipes/:id", async () => {

        const testRecipeId = "5c68532a2d01e7252c4b3fa5";
        const testRecipe = {
            _id: ObjectId(testRecipeId),
            title: "titre",
            authorId: testUtils.testUser._id,
            ingredients: [{name: "whatever", quantity: "100", unit: ""}],
            comments: [],
            date: "2019-02-16T18:15:06.386Z",
            text: "steps lol"
        };

        const otherUser = {
            _id: ObjectId("5c685327dd01e7252c4b3fa5"),
            username: "ja",
            firstName: "ja",
            lastName: "puskaric",
            date: 1549895037322,
            hash: "$2a$10$uAx0NLoVZDD24IugRqq5EOiLlZT541rLPllrfKF2UMg.h02MhG4U6"
        };

        it("should 401 without a token", async () => {
            await testUtils.insert(Recipe, testRecipe);
            await request.agent(app.server)
                .post("/jafa/api/recipes/" + testRecipe._id)
                .send({position: 0, foodId: testFoodId})
                .expect(401);
        });

        it("should 400 when not the author of the recipe", async () => {
            await testUtils.insert(Recipe, testRecipe);
            let otherToken = await testUtils.setupTestUser(otherUser);
            await request.agent(app.server)
                .post("/jafa/api/recipes/" + testRecipeId + "/ingredients")
                .set('Authorization', 'bearer ' + otherToken)
                .send({position: 0, foodId: testFoodId})
                .expect(400);
        });

        it("should 400 if the food does not exist", async () => {
            await testUtils.insert(Recipe, testRecipe);
            await request.agent(app.server)
                .post("/jafa/api/recipes/" + testRecipeId + "/ingredients")
                .set('Authorization', 'bearer ' + token)
                .send({position: 0, foodId: "lol"})
                .expect(400);
        });

        it("should 200 and update the ingredient", async () => {
            await testUtils.insert(Recipe, testRecipe);
            await testUtils.insert(Food, testFood);
            await request.agent(app.server)
                .post("/jafa/api/recipes/" + testRecipeId + "/ingredients")
                .set('Authorization', 'bearer ' + token)
                .send({position: 0, foodId: testFoodId})
                .expect(200, "");
            let recipe = await testUtils.find(Recipe, testRecipe._id);
            assert.strictEqual(recipe.ingredients[0].foodId, testFoodId);
        })

    });

});