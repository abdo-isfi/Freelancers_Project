const logger = require("../loaders/logger");

function errorHandler(err, req, res, next) {
  logger.error({ err }, "Unhandled error");

  const status = err.status || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({
    success: false,
    message,
    errors: err.errors || undefined,
  });
}

module.exports = errorHandler;
