const assert = require('assert');
const Store = require('../../../src/api/domain/models/store');
const StoreController = require('../../../src/api/domain/store.controller');
const TestUtils = require('../testUtils');
const ObjectId = require('mongodb').ObjectID;


describe('comment.controller.js', function () {

    this.timeout(20000);

    beforeEach(async () => {
        await TestUtils.cleanCollections([Store]);
    });


    describe('sotre.controller.getStore', function () {

        it('should return store corresponding to id', async function () {
            let store = {name: 'test'};
            await TestUtils.insert(Store, store);
            let storeFromController = await StoreController.getStore(store._id);
            assert.notStrictEqual(storeFromController, null);
            assert.strictEqual(storeFromController.name, store.name);
        });

        it('should return null if id doesn\'t match any store in database', async function () {
            let storeFromController = await StoreController.getStore(ObjectId(4248));
            assert.strictEqual(storeFromController, null);
        });
    });


    describe('sotre.controller.searchStore', function () {

        it('should return the twenty first entries', async function () {
            for (let i = 0; i < 21; i++) {
                let store = {name: 'test'};
                await TestUtils.insert(Store, store);
            }
            let stores = await StoreController.searchStore("");
            assert.strictEqual(stores.data.length, 20);
            assert.strictEqual(stores.count, 21);
        });

        it('should return entries with name matching search argument', async function () {
            await TestUtils.insert(Store, {name: "test1"});
            await TestUtils.insert(Store, {name: "test2"});
            await TestUtils.insert(Store, {name: "should not match"});

            let stores = await StoreController.searchStore("test");
            assert.strictEqual(stores.data.length, 2);
            assert.strictEqual(stores.count, 2);
            assert.strictEqual(stores.data[0].name, "test1");
            assert.strictEqual(stores.data[1].name, "test2");

            stores = await StoreController.searchStore("test1");
            assert.strictEqual(stores.data.length, 1);
            assert.strictEqual(stores.count, 1);
            assert.strictEqual(stores.data[0].name, "test1");

            stores = await StoreController.searchStore("test2");
            assert.strictEqual(stores.data.length, 1);
            assert.strictEqual(stores.count, 1);
            assert.strictEqual(stores.data[0].name, "test2");
        });

        it('should return empty data array if no store match', async function () {
            await TestUtils.insert(Store, {name: 'test1'});
            let stores = await StoreController.searchStore("should not match");
            assert.strictEqual(stores.data.length, 0);
            assert.strictEqual(stores.count, 0);
        });

    });


    describe('store.controller.addStore', function () {

        it('should add store in database', async function () {
            let stores = await StoreController.searchStore("");
            assert.strictEqual(stores.data.length, 0);
            assert.strictEqual(stores.count, 0);

            await StoreController.addStore("test", 'rue du test', 45.408092, 2.050198, "PACA");
            stores = await StoreController.searchStore("");
            assert.strictEqual(stores.data.length, 1);
            assert.strictEqual(stores.count, 1);
            assert.strictEqual(stores.data[0].name, "test");
            assert.strictEqual(stores.data[0].address, "rue du test");
            assert.strictEqual(stores.data[0].lat, 45.408092);
            assert.strictEqual(stores.data[0].long, 2.050198);
            assert.strictEqual(stores.data[0].region, "PACA");
        });

    });

    describe('sotre.controller.getAllRegions', function () {

        it('should return all different regions contain in all store', async function() {
            await StoreController.addStore(null, null, null, null, "region1");
            await StoreController.addStore(null, null, null, null, "region2");
            await StoreController.addStore(null, null, null, null, "region3");
            await StoreController.addStore(null, null, null, null, "region3");
            await StoreController.addStore(null, null, null, null, "region3");

            let expectedRegions = ["region1", "region2", "region3"];
            let regions = await StoreController.getAllRegions();
            assert.deepStrictEqual(regions, expectedRegions);
        });


    });

});