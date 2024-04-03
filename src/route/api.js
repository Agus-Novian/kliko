const express = require("express");
const apiRouter = express.Router();

const requestController = require("../controller/request-controller");
const { callback } = require("../controller/callback-controller");

apiRouter.get("/balance", requestController.balance);
apiRouter.get("/products", requestController.products);

// callback webhook
apiRouter.post("/callback", callback);

module.exports = apiRouter;
