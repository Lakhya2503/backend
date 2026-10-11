const http = require("http");
const fs = require("fs");

const myServer = http.createServer((req, res) => {
  const log = `${Date.now()} : New Request Recived ! \n`;
  fs.appendFile("./log.txt", log, (error, data) => {
    res.end("hello from server");
  });
});

myServer.listen(8000, () => console.log(`server stared !`));
