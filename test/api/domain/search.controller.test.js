var assert = require('assert');
const database = require('../../../src/_helpers/database');
const Food = require('../../../src/api/domain/models/food');
const SearchController = require('../../../src/api/domain/search.controller');


describe('search.controller.js', function () {

    this.timeout(10000);


    beforeEach(async () => {
        let collection = await Food.getCollection();
        await collection.remove({});
    });

    describe('#getFoodById', function () {

        // it('should return food matching id', async function () {
        //     let collection = await Food.getCollection()
        //     await collection.insert({_id:1});
        //     let food = await SearchController.getFoodById(1);
        //     assert.strictEqual(food.id, 1);
        // });
        //
        // it ('should return null if no food match id', async function() {
        //     let food = await SearchController.getFoodById(1);
        //     assert.strictEqual(food, null);
        // });

    });

    describe('#fetchFood', function() {

        //
        // it ('should match everything if no name is given', async function() {
        //     let collection = await Food.getCollection();
        //     for (let i = 1; i <= 10; i++) {
        //         await collection.insert({_id:i, product_name: "tacos"});
        //         let foods = await SearchController.fetchFood("");
        //         assert.strictEqual(foods.count, i);
        //         assert.strictEqual(foods.data[i-1].id, i);
        //     }
        // });
        //
        // it ('should return only 20 first result if limit is not given', async function() {
        //     let collection = await Food.getCollection();
        //     for (let i = 1; i <= 20; i++) {
        //         await collection.insert({_id:i, product_name: "tacos"});
        //         let foods = await SearchController.fetchFood("");
        //         assert.strictEqual(foods.count, i);
        //         assert.strictEqual(foods.data[i-1].id, i);
        //     }
        //     await collection.insert({_id:21, product_name: "tacos"});
        //     let foods = await SearchController.fetchFood("");
        //     assert.strictEqual(foods.count, 21);
        //     assert.strictEqual(foods.data.length, 20);
        // });
        //
        // it ('should return limit the number of response corresponding to the limit argument', async function() {
        //     let collection = await Food.getCollection();
        //     for (let i = 1; i <= 5; i++) {
        //         await collection.insert({_id:i, product_name: "tacos"});
        //     }
        //     for (let i = 1; i <= 5; i++) {
        //         let foods = await SearchController.fetchFood("", i);
        //         assert.strictEqual(foods.count, 5);
        //         assert.strictEqual(foods.data.length, i);
        //     }
        //
        // });
        //
        // it('should throw an error if order is not null and different to "asc" or "desc"', async function() {
        //     let errorType = null;
        //     try {
        //         await SearchController.fetchFood("", 1, null, "test");
        //     } catch (err) {
        //         errorType = err.constructor.name;
        //     }
        //     assert.strictEqual(errorType, 'InvalidOrderException');
        // });
        //
        // it('should return skip responses corresponding to the page argument (pagination)', async function() {
        //     let collection = await Food.getCollection();
        //     for (let i = 1; i <= 5; i++) {
        //         await collection.insert({_id:i, product_name: "tacos"});
        //     }
        //     for (let i = 1; i <= 5; i++) {
        //         let foods = await SearchController.fetchFood("", 1, null, null, i);
        //         assert.strictEqual(foods.count, 5);
        //         assert.strictEqual(foods.data.length, 1);
        //         assert.strictEqual(foods.data[0].id, i);
        //     }
        // });



        it ('should ascending order if criteria argument is given without order argument', async function() {
            let collection = await Food.getCollection();
            for (let i = 1; i <= 5; i++) {
                await collection.insert({_id:i, product_name: "tacos", score: 6-i});
            }
            let foods = await SearchController.fetchFood("", null, "score", null, null);
            for (let i = 0; i < 5; i++) {
                assert.strictEqual(foods.data[i].score, i + 1);
            }
        });

        it('should order by criteria given (score, asc)', async function() {
            let collection = await Food.getCollection();
            for (let i = 1; i <= 5; i++) {
                await collection.insert({_id:i, product_name: "tacos", score: 6-i});
            }
            let foods = await SearchController.fetchFood("", null, "score", "asc", null);
            for (let i = 0; i < 5; i++) {
                assert.strictEqual(foods.data[i].score, i + 1);
            }
        });


        it('should order by criteria given (score, desc)', async function() {
            let collection = await Food.getCollection();
            for (let i = 1; i <= 5; i++) {
                await collection.insert({_id:i, product_name: "tacos", score: 6-i});
            }
            let foods = await SearchController.fetchFood("", null, "score", "desc", null);
            for (let i = 0; i < 5; i++) {
                assert.strictEqual(foods.data[i].score, 5 - i);
            }
        });

        it('should order by criteria given (price, asc)', async function() {
            let collection = await Food.getCollection();
            for (let i = 1; i <= 5; i++) {
                await collection.insert({_id:i, product_name: "tacos", price: 6-i});
            }
            let foods = await SearchController.fetchFood("", null, "price", "asc", null);
            console.log(foods);
            for (let i = 0; i < 5; i++) {
                assert.strictEqual(foods.data[i].price, i + 1);
            }
        });

        it('should order by criteria given (price, desc)', async function() {
            let collection = await Food.getCollection();
            for (let i = 1; i <= 5; i++) {
                await collection.insert({_id:i, product_name: "tacos", price: 6-i});
            }
            let foods = await SearchController.fetchFood("", null, "price", "desc", null);
            for (let i = 0; i < 5; i++) {
                assert.strictEqual(foods.data[i].price, 5 - i);
            }
        });


        //
        // it ('should ascending order  if "asc" argument is given as order', async function() {
        //
        // });
        //
        // it ('should descending order if "desc" argument is given as order', async function() {
        //
        // });
        //
        //
        // it ('should match by name if name is given', async function() {
        //
        // });


    });


});