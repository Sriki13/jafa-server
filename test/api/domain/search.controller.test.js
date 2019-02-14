var assert = require('assert');
const database = require('../../../src/_helpers/database');
const Food = require('../../../src/api/domain/models/food');
const Recipe = require('../../../src/api/domain/models/recipe');
const SearchController = require('../../../src/api/domain/search.controller');
const RecipeController = require('../../../src/api/domain/recipe.controller');


describe('search.controller.js', function () {

    this.timeout(20000);


    beforeEach(async () => {
        let models = [Food, Recipe];
        models.forEach(async function(model) {
            let collection = await model.getCollection();
            await collection.remove({});
        });
    });

    describe('#getFoodById', function () {

        it('should return food matching id', async function () {
            let collection = await Food.getCollection()
            await collection.insert({_id: 1});
            let food = await SearchController.getFoodById(1);
            assert.strictEqual(food.id, 1);
        });

        it('should return null if no food match id', async function () {
            let food = await SearchController.getFoodById(1);
            assert.strictEqual(food, null);
        });

    });

    describe('#fetchFood', function () {


        it('should match everything if no name is given', async function () {
            let collection = await Food.getCollection();
            for (let i = 1; i <= 10; i++) {
                await collection.insert({_id: i, product_name: "tacos"});
                let foods = await SearchController.fetchFood("");
                assert.strictEqual(foods.count, i);
                assert.strictEqual(foods.data[i - 1].id, i);
            }
        });

        it('should return only 20 first result if limit is not given', async function () {
            let collection = await Food.getCollection();
            for (let i = 1; i <= 20; i++) {
                await collection.insert({_id: i, product_name: "tacos"});
                let foods = await SearchController.fetchFood("");
                assert.strictEqual(foods.count, i);
                assert.strictEqual(foods.data[i - 1].id, i);
            }
            await collection.insert({_id: 21, product_name: "tacos"});
            let foods = await SearchController.fetchFood("");
            assert.strictEqual(foods.count, 21);
            assert.strictEqual(foods.data.length, 20);
        });

        it('should return limit the number of response corresponding to the limit argument', async function () {
            let collection = await Food.getCollection();
            for (let i = 1; i <= 5; i++) {
                await collection.insert({_id: i, product_name: "tacos"});
            }
            for (let i = 1; i <= 5; i++) {
                let foods = await SearchController.fetchFood("", i);
                assert.strictEqual(foods.count, 5);
                assert.strictEqual(foods.data.length, i);
            }

        });

        it('should throw an error if order is not null and different to "asc" or "desc"', async function () {
            let errorType = null;
            try {
                await SearchController.fetchFood("", 1, null, "test");
            } catch (err) {
                errorType = err.constructor.name;
            }
            assert.strictEqual(errorType, 'InvalidOrderException');
        });

        it('should return skip responses corresponding to the page argument (pagination)', async function () {
            let collection = await Food.getCollection();
            for (let i = 1; i <= 5; i++) {
                await collection.insert({_id: i, product_name: "tacos"});
            }
            for (let i = 1; i <= 5; i++) {
                let foods = await SearchController.fetchFood("", 1, null, null, i);
                assert.strictEqual(foods.count, 5);
                assert.strictEqual(foods.data.length, 1);
                assert.strictEqual(foods.data[0].id, i);
            }
        });


        it('should ascending order if criteria argument is given without order argument', async function () {
            let collection = await Food.getCollection();
            for (let i = 1; i <= 5; i++) {
                await collection.insert({_id: i, product_name: "tacos", score: 6 - i});
            }
            let foods = await SearchController.fetchFood("", null, "score", null, null);
            for (let i = 0; i < 5; i++) {
                assert.strictEqual(foods.data[i].score, i + 1);
            }
        });

        it('should order by criteria given (score, asc)', async function () {
            let collection = await Food.getCollection();
            for (let i = 1; i <= 5; i++) {
                await collection.insert({_id: i, product_name: "tacos", score: 6 - i});
            }
            let foods = await SearchController.fetchFood("", null, "score", "asc", null);
            for (let i = 0; i < 5; i++) {
                assert.strictEqual(foods.data[i].score, i + 1);
            }
        });


        it('should order by criteria given (score, desc)', async function () {
            let collection = await Food.getCollection();
            for (let i = 1; i <= 5; i++) {
                await collection.insert({_id: i, product_name: "tacos", score: 6 - i});
            }
            let foods = await SearchController.fetchFood("", null, "score", "desc", null);
            for (let i = 0; i < 5; i++) {
                assert.strictEqual(foods.data[i].score, 5 - i);
            }
        });

        it('should order by criteria given (price, asc)', async function () {
            let collection = await Food.getCollection();
            for (let i = 1; i <= 5; i++) {
                await collection.insert({_id: i, product_name: "tacos", price: 6 - i});
            }
            let foods = await SearchController.fetchFood("", null, "price", "asc", null);
            for (let i = 0; i < 5; i++) {
                assert.strictEqual(foods.data[i].price, i + 1);
            }
        });

        it('should order by criteria given (price, desc)', async function () {
            let collection = await Food.getCollection();
            for (let i = 1; i <= 5; i++) {
                await collection.insert({_id: i, product_name: "tacos", price: 6 - i});
            }
            let foods = await SearchController.fetchFood("", null, "price", "desc", null);
            for (let i = 0; i < 5; i++) {
                assert.strictEqual(foods.data[i].price, 5 - i);
            }
        });


        it('should match by name if name is given', async function () {
            let collection = await Food.getCollection();
            await collection.insert({_id: 1, product_name: "tacos one meal"});
            await collection.insert({_id: 2, product_name: "tacos two meals"});
            await collection.insert({_id: 3, product_name: "tacos three meals"});

            let foods = await SearchController.fetchFood("t");
            assert.strictEqual(foods.data.length, 3);

            foods = await SearchController.fetchFood("tacos o");
            assert.strictEqual(foods.data.length, 1);
            assert.strictEqual(foods.data[0].name, "tacos one meal");

            foods = await SearchController.fetchFood("tacos tw");
            assert.strictEqual(foods.data.length, 1);
            assert.strictEqual(foods.data[0].name, "tacos two meals");

            foods = await SearchController.fetchFood("tacos th");
            assert.strictEqual(foods.data.length, 1);
            assert.strictEqual(foods.data[0].name, "tacos three meals");
        });


    });


    describe('#fetchRecipe', function () {

        async function addRecipe(name) {
            let collectionRecipe = await Recipe.getCollection();
            let recipe = {
                title: name,
                ingredients: [
                    {
                        name: "pizza dough",
                        quantity: "1",
                        unit: ""
                    },
                    {
                        name: "tomato sauce",
                        quantity: "100",
                        unit: "g"
                    },
                    {
                        name: "cheese",
                        quantity: "100",
                        unit: "g"
                    }
                ],
                comments: [],
                "text": "Start by putting down the dough, add the tomato sauce and cheese on top and put on the oven for 15 min at 200°"
            };
            return await collectionRecipe.insert(recipe);
        }

        it('should return all recipe if no name specified', async function () {
            let recipe1 = await addRecipe("Pizza recipe");
            let result = await SearchController.fetchRecipe("", null);
            assert.deepStrictEqual(recipe1.ops, result.data);
            assert.strictEqual(1, result.count);

            let recipe2 = await addRecipe("Pizza recipe");
            result = await SearchController.fetchRecipe("", null);
            assert.deepStrictEqual(recipe1.ops.concat(recipe2.ops), result.data);
            assert.strictEqual(2, result.count);
        });


        it('should return no result if no name match', async function() {
            let recipe1 = await addRecipe("Pizza recipe");
            let result = await SearchController.fetchRecipe("anything", null);
            assert.deepStrictEqual([], result.data);
            assert.strictEqual(0, result.count);
        });

        it('should return only recipe matched name', async function() {
            let recipe1 = await addRecipe("Pizza recipe");
            let recipe2 = await addRecipe("Tacos");
            let result = await SearchController.fetchRecipe("Pizza", null);
            assert.deepStrictEqual(recipe1.ops, result.data);
            assert.strictEqual(1, result.count);
        });

        it('should return only the first 20 recipes', async function() {
            for (let i = 0; i < 21; i++) {
                await addRecipe("useless");
            }
            let result = await SearchController.fetchRecipe("", null);
            assert.strictEqual(21, result.count);
            assert.strictEqual(20, result.data.length);
        });

        it('should skip : 20 * (page - 1) recipes', async function() {
            for (let i = 0; i < 21; i++) {
                await addRecipe("useless");
            }
            let result = await SearchController.fetchRecipe("", 2);
            assert.strictEqual(21, result.count);
            assert.strictEqual(1, result.data.length);
        });

    });


    describe('#updateFood', function() {

        async function addFood() {
            let collection = await Food.getCollection();
            let food = {_id: "coucou", name:"test"};
            return await collection.insert(food);
        }

        it("should update food", async function() {
            let food = await addFood();
            food = food.ops[0];

            food.name = "updated";
            let updatedFood = await SearchController.updateFood(food);
            assert.deepStrictEqual(food, updatedFood);
        });

    });

});
