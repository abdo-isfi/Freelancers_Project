const http = require("http");
const app = require("./app");
const logger = require("./loaders/logger");

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info({ port: PORT }, "Server listening");
});

module.exports = server;
