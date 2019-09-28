const http = require('http');
const url = require('url');
const fs = require('fs');
const db_module  = require('./db_module');

let db = new db_module.DB();

db.on('GET', (req, res) => {
    console.log('DB.GET');
    res.writeHead(200, {'Content-Type':'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*'});
    db.get((result) => {res.end(JSON.stringify(result));});
});

db.on('POST', (req, res) => {
    console.log('DB.POST');
    req.on('data', data => {
        let r = JSON.parse(data);
        db.post(r, (result) => {res.end(JSON.stringify(r));});
    });
});

db.on('PUT', (req, res) => {
    console.log('DB.PUT');
    req.on('data', data => {
        let r = JSON.parse(data);
        db.put(r, (result) => {res.end(JSON.stringify(r));});
    });
});

db.on('DELETE', (req, res) => {
    console.log('DB.DELETE');
    let url_parts = url.parse(req.url, true);
    let query = url_parts.query;
    let r = JSON.parse(query.id);
    db.delete(r, (result) => {res.end(JSON.stringify(result));});
});

http.createServer(function (request, response) {
    if (url.parse(request.url).pathname === '/') {
        let html = fs.readFile('./index.html', (err, data) => {
            response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            response.end(data);
        });
    } else if (url.parse(request.url).pathname === '/api/db') {
        db.emit(request.method, request, response);
    }
}).listen(5000);

console.log('Server created on http://localhost:5000/');