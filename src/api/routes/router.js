const express       = require("express");
const searchRouter  = require("./search.router");
const scoreRouter   = require("./score.router");
const commentRouter = require("./comment.router"); 

const router = express.Router();

router.get("/foods", searchRouter.searchFood);
router.post("/foods/:id", searchRouter.createFood);
router.put("/foods", searchRouter.updateFood);

router.get("/foods/:id/score", scoreRouter.fetchScore);
router.post("/foods/:id/score", scoreRouter.createScore);

router.post('/foods/:id/comment', commentRouter.addComment);

module.exports = router;
