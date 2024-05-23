const http = require('http');

const server = http.createServer( function(req,res){
    res.end("hello friedns")
})

server.listen(3000);
