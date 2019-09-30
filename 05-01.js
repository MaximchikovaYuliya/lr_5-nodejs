const http = require('http');
const url = require('url');
const fs = require('fs');
const db_module  = require('./db_module');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let timer_sd, timer_sc, timer_ss;
let req_counter, commit_counter;

rl.on('line', (input) => {
    if (input === 'sd' && timer_sd != null) {
        console.log('Timer is canceled.');
        clearTimeout(timer_sd);
    }
    if (input === 'sc' && timer_sc != null) {
        console.log('Timer is canceled.');
        clearTimeout(timer_sc);
    }
    if (/sd \d+/.test(input)) {
        if (timer_sd != null) {
            clearTimeout(timer_sd);
        }
        let start = Date.now();
        timer_sd = setTimeout(() => {
            console.log('Passed time: ' + (Date.now() - start));
            process.exit(1);
            }, Number(input.match(/\d+/g)));
    }
    if (/sc \d+/.test(input)) {
        timer_sc = setInterval(() => {
            db.commit(() => console.log('Commit'));
            commit_counter++;
        }, Number(input.match(/\d+/g)));
    }
    if (/ss \d+/.test(input)) {
        req_counter = 0;
        commit_counter = 0;
        timer_ss = setTimeout(() => console.log("Requests: " + req_counter + "\nCommits: " + commit_counter), Number(input.match(/\d+/g)));
    }
});

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

const server = http.createServer(function (request, response) {
    if (url.parse(request.url).pathname === '/') {
        let html = fs.readFile('./index.html', (err, data) => {
            response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            response.end(data);
        });
    } else if (url.parse(request.url).pathname === '/api/db') {
        db.emit(request.method, request, response);
    }
}).listen(5000);

server.on('request', () => req_counter++);

console.log('Server created on http://localhost:5000/');