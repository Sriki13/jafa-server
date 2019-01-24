const express = require("express");
const searchRouter = require("./search.router");

const router = express.Router();

router.get("/foods", searchRouter.searchFood);
router.post("/foods/:id", searchRouter.createFood);
router.put("/foods", searchRouter.updateFood);

module.exports = router;
