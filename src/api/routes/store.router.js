const controller = require("../domain/store.controller");
const HttpStatus = require("http-status-codes");

async function fetchStore(req, res) {
    let store = await controller.getStore(req.params.id);
    if (store == null) {
        return res.status(HttpStatus.NOT_FOUND).send();
    }
    return res.status(HttpStatus.OK).send(store);
}

async function fetchStores(req, res) {
    let stores = await controller.getStore(req.params.id);
    return res.status(HttpStatus.OK).send(stores);
}

async function createStore(req, res) {
    for (let str in ["name", "address", "lat", "long"]) {
        if (req.body[str] == null) {
            return res.status(HttpStatus.BAD_REQUEST).send(str + " must be defined in body");
        }
    }
    return res.status(HttpStatus.OK).send(await controller.addStore(
        req.body.name,
        req.body.address,
        req.body.lat,
        req.body.long
    ));
}

module.exports = {
    fetchStore,
    fetchStores,
    createStore
};

