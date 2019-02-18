const assert = require('assert');
const Food = require('../../../src/api/domain/models/food');
const Store = require('../../../src/api/domain/models/store');
const PriceController = require('../../../src/api/domain/price.controller');
const TestUtils = require('../testUtils');



describe('price.controller.js', function () {

    this.timeout(20000);

    beforeEach(async () => {
        await TestUtils.cleanCollections([Food, Store]);
    });


    describe('price.controller.getPrices', function () {

        it('should return an empty list if food is not present in store', async function () {
            let food = {_id: 42, product_name: "test", prices: []};
            await TestUtils.insert(Food, food);
            let prices = await PriceController.getPrices(42);
            assert.notStrictEqual(prices, null);
            assert.strictEqual(prices.length, 0);
        });

        it('should return a list of price, store', async function () {
            let food = {_id: 42, product_name: "test", prices: []};
            let store1 = {name: "Carrefour Antibes", address: "Chemin de Saint-Claude, 06600 Antibes", lat: "43.60352179511596", long: "7.088536031822969", region: "PACA"};
            let store2 = {name: "test", address: "test", lat: "43.60352179511596", long: "7.088536031822969", region: "TEST"};
            await TestUtils.insert(Food, food);
            await TestUtils.insert(Store, store1);
            await TestUtils.insert(Store, store2);

            await PriceController.addPrice(42, store1._id, 52);

            let prices = await PriceController.getPrices(42);
            assert.strictEqual(prices.length, 1);
            assert.strictEqual(prices[0].price, 52);
            assert.strictEqual(prices[0].store._id.toString(), store1._id.toString());

            await PriceController.addPrice(42, store2._id, 62);

            prices = await PriceController.getPrices(42);
            assert.strictEqual(prices.length, 2);
            assert.strictEqual(prices[0].price, 52);
            assert.strictEqual(prices[0].store._id.toString(), store1._id.toString());
            assert.strictEqual(prices[1].price, 62);
            assert.strictEqual(prices[1].store._id.toString(), store2._id.toString());
        });


    });

    describe('price.controller.addPrice', function () {

        it('should add price on prices attribute of food object', async function() {
            let food = {_id: 42, product_name: "test", prices: []};
            let store1 = {name: "Carrefour Antibes", address: "Chemin de Saint-Claude, 06600 Antibes", lat: "43.60352179511596", long: "7.088536031822969", region: "PACA"};
            let store2 = {name: "test", address: "test", lat: "43.60352179511596", long: "7.088536031822969", region: "TEST"};
            await TestUtils.insert(Food, food);
            await TestUtils.insert(Store, store1);
            await TestUtils.insert(Store, store2);

            await PriceController.addPrice(42, store1._id, 52);

            let foodWithPrice = await TestUtils.find(Food, 42);
            assert.notStrictEqual(foodWithPrice.prices, null);
            assert.strictEqual(foodWithPrice.prices.length, 1);
            assert.notStrictEqual(foodWithPrice.prices[0].date, null);
            assert.strictEqual(foodWithPrice.prices[0].price, 52);
            assert.strictEqual(foodWithPrice.prices[0].storeId.toString(), store1._id.toString());

            await PriceController.addPrice(42, store2._id, 63);

            foodWithPrice = await TestUtils.find(Food, 42);
            assert.notStrictEqual(foodWithPrice.prices, null);
            assert.strictEqual(foodWithPrice.prices.length, 2);
            assert.notStrictEqual(foodWithPrice.prices[0].date, null);
            assert.strictEqual(foodWithPrice.prices[0].price, 52);
            assert.strictEqual(foodWithPrice.prices[0].storeId.toString(), store1._id.toString());
            assert.notStrictEqual(foodWithPrice.prices[1].date, null);
            assert.strictEqual(foodWithPrice.prices[1].price, 63);
            assert.strictEqual(foodWithPrice.prices[1].storeId.toString(), store2._id.toString());
        });

        it('should replace price if a price for specified store already exist', async function() {
            let food = {_id: 42, product_name: "test", prices: []};
            let store1 = {name: "Carrefour Antibes", address: "Chemin de Saint-Claude, 06600 Antibes", lat: "43.60352179511596", long: "7.088536031822969", region: "PACA"};
            await TestUtils.insert(Food, food);
            await TestUtils.insert(Store, store1);

            await PriceController.addPrice(42, store1._id, 52);
            await PriceController.addPrice(42, store1._id, 150);

            let foodWithPrice = await TestUtils.find(Food, 42);
            assert.notStrictEqual(foodWithPrice.prices, null);
            assert.strictEqual(foodWithPrice.prices.length, 1);
            assert.notStrictEqual(foodWithPrice.prices[0].date, null);
            assert.strictEqual(foodWithPrice.prices[0].price, 150);
            assert.strictEqual(foodWithPrice.prices[0].storeId.toString(), store1._id.toString());

        });

        it('should throw an NoSuchStore exception if specified store doesn\'t exist', async function() {
            let food = {_id: 42, product_name: "test", prices: []};
            await TestUtils.insert(Food, food);

            let actualError = null;
            try {
                await PriceController.addPrice(42, "5c6ae01ce97ef04f6cfb7308", 52);
            } catch (error) {
                actualError = error;
            }
            assert.notStrictEqual(actualError, null);
        });

    });

});