const express = require("express");
const searchRouter = require("./search.router");
const scoreRouter = require("./score.router");

const router = express.Router();

router.get("/foods", searchRouter.searchFood);
router.post("/foods/:id", searchRouter.createFood);

router.get("/foods/:id/score", scoreRouter.fetchScore);
router.post("/foods/:id/score", scoreRouter.createScore);

module.exports = router;
