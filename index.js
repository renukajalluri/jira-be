const app = require("./app"); // the actual Express application
const http = require("http");
// const logger = require('./utils/logger')
const port = config.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
