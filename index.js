const express = require("express");
const fs = require("fs");

const upload = require("./upload.js");
const retrieve = require("./retrieve.js");

fs.mkdir("./datastore", function(){});

const server = express();
const port = 3000;

server.listen(port, function(){
    console.log(`Server listening on port ${port}`);
})

server.use(express.urlencoded());

server.use(function(req, res){
    console.log(`Recieved ${req.method} request for ${req.path}`);
    if (req.path == "/" || req.path == "/index.html"){
        res.writeHead(200, {"content-type": "text/html"});
        res.write(fs.readFileSync("./pages/index.html"));
        res.end();
    } else if (req.path == "/retrieve.html"){
        res.writeHead(200, {"content-type": "text/html"});
        res.write(fs.readFileSync("./pages/retrieve.html"));
        res.end();
    } else if (req.path == "/upload.html"){
        res.writeHead(200, {"content-type": "text/html"});
        res.write(fs.readFileSync("./pages/upload.html"));
        res.end();
    } else if (req.path == "/upload_data.json") {
        if (req.method != "POST") {
            res.status(405);
            res.write(`Invalid method: ${req.method}, expected: POST`);
            res.end();
            return;
        }
        const upload_result = upload.uploadData(req.body.name, req.body.data, req.body.password);
        res.writeHead(200, {"content-type": "application/json"});
        res.write(JSON.stringify(upload_result));
        res.end();
    } else if (req.path == "/retrieve_data"){
        res.writeHead(307, {"location": `/data/${req.body.name}`});
        res.end();
    } else if (req.path.startsWith("/data/")) {
        if (req.method != "POST") {
            res.status(405);
            res.write(`Invalid method: ${req.method}, expected: POST`);
            res.end();
            return;
        }
        const fileName = req.path.slice(6);
        const retrieveResult = retrieve.retrieveData(fileName, req.body.password);
        if (retrieveResult.error){
            res.status(retrieveResult.status);
            res.write(retrieveResult.error);
            res.end();
            return;
        }
        res.writeHead(200, {"content-type": "text/plain"})
        res.write(retrieveResult.data);
        res.end();
    } else {
        res.status(404);
        res.write("NOT FOUND");
        res.end()
    }
})
