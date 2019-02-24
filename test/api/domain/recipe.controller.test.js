const assert = require('assert');
const Recipe = require('../../../src/api/domain/models/recipe');
const Food = require('../../../src/api/domain/models/food');
const Store = require('../../../src/api/domain/models/store');
const RecipeController = require('../../../src/api/domain/recipe.controller');
const PriceController = require('../../../src/api/domain/price.controller');
const TestUtils = require('../testUtils');



describe('recipe.controller.js', function () {

    this.timeout(20000);

    beforeEach(async () => {
        await TestUtils.cleanCollections([Recipe, Food]);
    });
    

    describe('recipe.controller.suggestFoods', function () {

        it('should return the 5 first scored food in database', async function () {
            for (let i = 0; i < 6; i++) {
                await TestUtils.insert(Food, {_id: i, product_name: "cheese", score: i});
            }

            let result = await RecipeController.suggestFoods([{name: "cheese"}]);
            result = result[0];
            assert.strictEqual(5, result.length);
            for (let i = 0; i < 5; i++) {
                assert.strictEqual(5-i, result[i].score);
            }
        });

    });

    describe('recipe.controller.updateRecipeIngredient', function () {

        it('should throw an invalidRecipeIngredient if position argument is greater than number of ingredient', async function () {
            let recipe = {title: "tacos", ingredients: []};
            await TestUtils.insert(Recipe, recipe);
            let error = null;
            try {
                await RecipeController.updateRecipeIngredient(null, recipe._id, 1, 0);
            } catch (err) {
                error = err;
            }
            assert.notStrictEqual(null, error);
        });

        it('should throw an InvalidUserException if the update of recipe is not provide by its author', async function() {
            let recipe = {title: "tacos", ingredients: [{name: 'test'}], authorId: "testId"};
            await TestUtils.insert(Recipe, recipe);
            let error = null;
            try {
                await RecipeController.updateRecipeIngredient("coucou", recipe._id, 0, 0);
            } catch (err) {
                error = err;
            }
            assert.notStrictEqual(null, error);
        });

        it('should update the ingredient of the recipe', async function() {
            await TestUtils.insert(Food, {_id: 42, product_name: "test"});
            let recipe = {title: "tacos", ingredients: [{name: 'test'}], authorId: "testId"};
            await TestUtils.insert(Recipe, recipe);
            await RecipeController.updateRecipeIngredient("testId", recipe._id, 0, 42);
            let updatedRecipe = await TestUtils.find(Recipe, recipe._id);
            assert.strictEqual(updatedRecipe.ingredients.length, 1);
            assert.deepStrictEqual(updatedRecipe.ingredients[0], {foodId: 42, name: "test"});
        });

    });

    describe('recipe.controller.getRecipePrice', function () {

        it('it should return the sum of minimum price of all ingredients of the recipe', async function () {
            let food1 = {_id: 42, product_name: "test", prices: []};
            let food2 = {_id: 43, product_name: "test", prices: []};
            let store1 = {name: "Carrefour Antibes", address: "Chemin de Saint-Claude, 06600 Antibes", lat: "43.60352179511596", long: "7.088536031822969", region: "PACA"};
            let store2 = {name: "test", address: "test", lat: "43.60352179511596", long: "7.088536031822969", region: "TEST"};
            await TestUtils.insert(Food, food1);
            await TestUtils.insert(Food, food2);
            await TestUtils.insert(Store, store1);
            await TestUtils.insert(Store, store2);

            await PriceController.addPrice(42, store1._id, 5);
            await PriceController.addPrice(42, store2._id, 10);
            await PriceController.addPrice(43, store1._id, 5);
            await PriceController.addPrice(43, store2._id, 10);

            let recipe = {title: "tacos", ingredients: [{foodId: 42}, {foodId: 43}], authorId: "testId"};
            await TestUtils.insert(Recipe, recipe);
            let result = await RecipeController.getRecipePrice(recipe._id);
            assert.strictEqual(result.sum, 10);
            assert.strictEqual(result.unknown.length, 0);
        });



    });

});