const assert = require('assert');
const Food = require('../../../src/api/domain/models/food');
const Recipe = require('../../../src/api/domain/models/recipe');
const CommentController = require('../../../src/api/domain/comment.controller');
const TestUtils = require('../testUtils');
const ObjectId = require('mongodb').ObjectID;



describe('comment.controller.js', function () {

    this.timeout(20000);

    beforeEach(async () => {
        await TestUtils.cleanCollections([Food, Recipe]);
    });



    describe('comment.controller.createRecipeComment', function () {

        it('should insert a comment in the recipe object and persist it', async function () {
            let recipe = {title: "tacos"};
            await TestUtils.insert(Recipe, recipe);
            await CommentController.createRecipeComment(recipe._id, {message: "super test !"}, "test master");
            recipe = await TestUtils.find(Recipe, recipe._id);
            assert.strictEqual(recipe.comments.length, 1);
            assert.strictEqual(recipe.comments[0].message, 'super test !');
            assert.strictEqual(recipe.comments[0].author, 'test master');
            assert.notStrictEqual(recipe.comments[0].timestamp, null);
        });
    });



    describe('comment.controller.createFoodComment', function () {

        it('should insert a comment in the food object and persist it', async function () {
            let food = {_id: 42, product_name: "tacos"};
            await TestUtils.insert(Food, food);
            await CommentController.createFoodComment(42, {message: "super test !"}, "test master");
            food = await TestUtils.find(Food, 42);
            assert.strictEqual(food.comments.length, 1);
            assert.strictEqual(food.comments[0].message, 'super test !');
            assert.strictEqual(food.comments[0].author, 'test master');
            assert.notStrictEqual(food.comments[0].timestamp, null);
        });

    });

    describe('comment.controller.getRecipeComments', function () {

        it('should return list of comments for a specific recipe id', async function() {
            let recipe = {title: "tacos"};
            await TestUtils.insert(Recipe, recipe);
            await CommentController.createRecipeComment(recipe._id, {message: "super test !"}, "test master");
            await CommentController.createRecipeComment(recipe._id, {message: "super test !"}, "test master");
            let comments = await CommentController.getRecipeComments(recipe._id);
            assert.strictEqual(comments.length, 2);
        });


        it('should return an empty list of comments if the specified recipe have no comments', async function() {
            let recipe = {title: "tacos"};
            await TestUtils.insert(Recipe, recipe);
            let comments = await CommentController.getRecipeComments(recipe._id);
            assert.notStrictEqual(comments, undefined);
            assert.notStrictEqual(comments, null);
            assert.strictEqual(comments.length, 0);
        });

    });

    describe('comment.controller.getFoodComments', function () {

        it('should return list of comments for a specific recipe id', async function() {
            let food = {_id: 42, product_name: "tacos"};
            await TestUtils.insert(Food, food);
            await CommentController.createFoodComment(42, {message: "super test !"}, "test master");
            await CommentController.createFoodComment(42, {message: "super test !"}, "test master");
            let comments = await CommentController.getFoodComments(42);
            assert.strictEqual(comments.length, 2);
        });


        it('should return an empty list of comments if the specified recipe have no comments', async function() {
            let food = {_id: 42, product_name: "tacos"};
            await TestUtils.insert(Food, food);
            let comments = await CommentController.getFoodComments(42);
            assert.notStrictEqual(comments, undefined);
            assert.notStrictEqual(comments, null);
            assert.strictEqual(comments.length, 0);
        });
    });




});
