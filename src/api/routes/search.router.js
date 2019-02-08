const controller = require("../domain/search.controller");
const HttpStatus = require("http-status-codes");

async function searchFood(req, res) {
    let search = "";
    if (req.query.name !== undefined) {
        search = req.query.name;
    }
    if (req.query.page != null && !isNaN(req.query.page) && req.query.page < 1) {
        return res.status(HttpStatus.BAD_GATEWAY).send("Page must be a number greater or equal to 1");
    }
    if (req.query.page == null) {
        req.query.page = 1;
    }
    let items = await controller.fetchFood(search, req.query.limit, req.query.criteria,
        req.query.order, req.query.page, req.query.store, req.query.region);
    return res.status(HttpStatus.OK).send(items);
}

async function updateFood(req, res) {
    try {
        let updatedFood = await controller.updateFood(req.body);
        return res.status(HttpStatus.OK).send(updatedFood)
    } catch (err) {
        return res.status(HttpStatus.BAD_REQUEST).send()
    }
}

async function searchRecipe(req, res) {
    // TODO: order by latest date by default
    let search = "";
    if (req.query.name !== undefined) {
        search = req.query.name;
    }
    if (req.query.page != null && !isNaN(req.query.page) && req.query.page < 1) {
        return res.status(HttpStatus.BAD_GATEWAY).send("Page must be a number greater or equal to 1");
    }
    if (req.query.page == null) {
        req.query.page = 1;
    }
    let items = await controller.fetchRecipe(search, req.query.page);
    console.log(items);
    return res.status(HttpStatus.OK).send(items);
}

async function getFood(req, res) {
    let food = await controller.getFoodById(req.params.id);
    if (food == null) {
        return res.status(HttpStatus.BAD_REQUEST).send("No food with id " + req.params.id);
    }
    return res.status(HttpStatus.OK).send(food);
}

module.exports = {
    searchFood,
    updateFood,
    searchRecipe,
    getFood
};