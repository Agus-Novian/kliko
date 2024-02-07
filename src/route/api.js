const express = require("express");
const apiRouter = express.Router();

const requestController = require("../controller/request-controller");
const { callback } = require("../controller/callback-controller");

apiRouter.get("/balance", requestController.balance);

// callback webhook
apiRouter.post("/callback", callback);

module.exports = apiRouter;
