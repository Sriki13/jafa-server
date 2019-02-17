const assert = require('assert');
const Food = require('../../../src/api/domain/models/food');
const ScoreController = require('../../../src/api/domain/score.controller');
const TestUtils = require('../testUtils');



describe('score.controller.js', function () {

    this.timeout(20000);

    beforeEach(async () => {
        await TestUtils.cleanCollections([Food]);
    });


    describe('score.controller.addScore', function () {

        it('should add the score on the food object and persist it', async function() {
            await TestUtils.insert(Food, {_id: 42, product_name: "test", scores: [4.2]});
            await ScoreController.addScore(42, "4.2");
            let food = await TestUtils.find(Food, 42);
            assert.strictEqual(food.scores.length, 2);
            assert.strictEqual(food.scores[1], 4.2);
        });

        it('should assign an initial score if food object does\'t have score', async function() {
            await TestUtils.insert(Food, {_id: 42, product_name: "test"});
            await ScoreController.addScore(42, "4.2");
            let food = await TestUtils.find(Food, 42);
            assert.strictEqual(food.scores.length, 2);
            assert.strictEqual(food.scores[1], 4.2);
        });

    });


    describe('score.controller.getScore', function () {

        it('should return the average score of the food', async function() {
            await TestUtils.insert(Food, {_id: 42, product_name: "test", scores: [1]});
            await ScoreController.addScore(42, "2");
            await ScoreController.addScore(42, "3");
            await ScoreController.addScore(42, "4");
            let score = await ScoreController.getScore(42);
            assert.strictEqual(score, 2.5);
        });

        it('should assign an initial score if food object doesn\'t have score', async function () {
            await TestUtils.insert(Food, {_id: 42, product_name: "test"});
            let score = await ScoreController.getScore(42);
            assert.notStrictEqual(score, null);

            let food = await TestUtils.find(Food, 42);
            assert.strictEqual(food.scores.length, 1);
        });

    });

});
