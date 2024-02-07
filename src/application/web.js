require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

const apiRouter = require("../route/api");
const { errorMiddleware } = require("../middleware/error-middleware");

const web = express();
module.exports = web;

web.disable("x-powered-by");
web.use(morgan("dev"));
web.use(express.json());

web.use(apiRouter);

web.use(errorMiddleware);
