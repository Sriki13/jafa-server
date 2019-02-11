const Food = require('../../../src/api/domain/models/food');
const app = require('../../../src/app');
const request = require('supertest');


describe('search.controller.js', function () {

    this.timeout(10000);

    function sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms)
        })
    }

    before(async () => {
        await app.start();
        await sleep(1000);
    });

    after(async () => {
        await app.stop();
    });


    beforeEach(async () => {
        let collection = await Food.getCollection();
        await collection.remove({});
    });


    describe('GET /foods', function () {

        it('should return all foods in database', async function () {
            let collection = await Food.getCollection();
            let data = [];
            for (let i = 1; i <= 10; i++) {
                await collection.insert({_id: i, product_name: "tacos one meal"});
                data.push({id: i, name: 'tacos one meal', images: []})
                await request.agent(app.server)
                    .get('/jafa/api/foods')
                    .expect('Content-Type', /json/)
                    .expect(200, {
                            data: data,
                            count: i
                        }
                    );
            }
        });

    });


});