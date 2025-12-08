const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./loaders/logger");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url }, "Incoming request");
  next();
});

app.use("/api", routes);

app.use(errorHandler);

module.exports = app;
