const http = require("http");
const fs = require("fs");

const myServer = http.createServer((req, res) => {
  const log = `${Date.now()} : ${req.url} - New Request Recived ! \n`;
  fs.appendFile("./log.txt", log, (error, data) => {
    switch (req.url) {
      case "/":
        res.end("Home Page......");
        break;
      case "/about":
        res.end("I am laxman Shinde AUTHOR OF WEB....");
        break;
      default:
        res.end("404 Page Not found");
    }
  });
});

myServer.listen(8000, () => console.log(`server stared !`));
