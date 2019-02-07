const controller = require("../domain/price.controller");
const HttpStatus = require("http-status-codes");
const exceptions = require("../domain/exceptions");

async function fetchFoodPrice(req, res) {
    try {
        let prices = await controller.getPrices(req.params.id);
        return res.status(HttpStatus.OK).send(prices);
    } catch (e) {
        if (e instanceof exceptions.NoSuchFoodException) {
            return res.status(HttpStatus.NOT_FOUND).send(e.message);
        }
        console.error(e);
        return res.status(HttpStatus.BAD_REQUEST).send(e);
    }
}

async function addNewPrice(req, res) {
    try {
        await controller.addPrice(req.params.id, req.body.storeId, req.body.price);
        return res.status(HttpStatus.OK).send();
    } catch (e) {
        if (e instanceof exceptions.NoSuchFoodException) {
            return res.status(HttpStatus.NOT_FOUND).send(e.message);
        }
        console.error(e);
        return res.status(HttpStatus.BAD_REQUEST).send(e);
    }
}

module.exports = {
    fetchFoodPrice,
    addNewPrice
};