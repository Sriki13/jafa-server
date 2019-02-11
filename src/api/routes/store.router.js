const controller = require("../domain/store.controller");
const HttpStatus = require("http-status-codes");
const ObjectId = require('mongodb').ObjectID;

/**
 * @api {get} jafa/api/stores/:id Get store
 * @apiGroup store
 *
 * @apiParam (URL parameters) {Number} id The id of the store
 *
 * @apiSuccess {Number} id The id of the store
 * @apiSuccess {String} address The address of the store
 * @apiSuccess {String} name The name of the store
 * @apiSuccess {String} lat The latitude of the store
 * @apiSuccess {String} long The longitude of the store
 * @apiSuccess {String} region The region of the store
 */
async function fetchStore(req, res) {
    let store = await controller.getStore(ObjectId(req.params.id));
    if (store == null) {
        return res.status(HttpStatus.NOT_FOUND).send();
    }
    return res.status(HttpStatus.OK).send(store);
}

/**
 * @api {get} jafa/api/stores Browse stores
 * @apiGroup store
 *
 * @apiSuccess {Array} Result-Array An array of Store items.
 *
 * @apiSuccess {Number} id The id of the store
 * @apiSuccess {String} address The address of the store
 * @apiSuccess {String} name The name of the store
 * @apiSuccess {String} lat The latitude of the store
 * @apiSuccess {String} long The longitude of the store
 * @apiSuccess {String} region The region of the store
 */
async function fetchStores(req, res) {
    let stores = await controller.searchStore(req.params.id);
    return res.status(HttpStatus.OK).send(stores);
}

/**
 * @api {post} jafa/api/stores Add store
 * @apiGroup store
 *
 * @apiParam {Number} id The id of the store
 * @apiParam {String} address The address of the store
 * @apiParam {String} name The name of the store
 * @apiParam {String} lat The latitude of the store
 * @apiParam {String} long The longitude of the store
 * @apiParam {String} region The region of the store
 *
 * @apiSuccess {Number} id The id of the store
 * @apiSuccess {String} address The address of the store
 * @apiSuccess {String} name The name of the store
 * @apiSuccess {String} lat The latitude of the store
 * @apiSuccess {String} long The longitude of the store
 * @apiSuccess {String} region The region of the store
 */
async function createStore(req, res) {
    for (let str of ["name", "address", "lat", "long", "region"]) {
        if (req.body[str] == null) {
            return res.status(HttpStatus.BAD_REQUEST).send(str + " must be defined in body");
        }
    }
    return res.status(HttpStatus.OK).send(await controller.addStore(
        req.body.name,
        req.body.address,
        req.body.lat,
        req.body.long,
        req.body.region
    ));
}

/**
 * @api {get} jafa/api/regions Get regions
 * @apiGroup store
 *
 * @apiSuccess {Array} Result-Array An array containing all available regions as strings
 */
async function fetchRegions(req, res) {
    return res.status(HttpStatus.OK).send(await controller.getAllRegions());
}

module.exports = {
    fetchStore,
    fetchStores,
    createStore,
    fetchRegions
};

