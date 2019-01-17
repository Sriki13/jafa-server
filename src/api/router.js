const {Router} = require("express");

const moduleRouter = require("./routes/router");

module.exports = function addRouter(app) {
    const router = Router();
    router.use("/api", moduleRouter);
    app.use("/jafa", router);
};
