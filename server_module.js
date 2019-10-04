const http = require('http');
const url = require('url');
const fs = require('fs');
const readline = require('readline');

const db_events_module = require('./db_events_module');
const stat_module = require('./statistics_module');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let timer_sd;
let timer_sc;
let timer_ss;
let stat;

let server = http.createServer(function (request, response) {
    if (url.parse(request.url).pathname === '/') {
        let html = fs.readFile('./index.html', (err, data) => {
            response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            response.end(data);
        });
    } else if (url.parse(request.url).pathname === '/api/db') {
        db_events_module.db.emit(request.method, request, response);
    } else if (url.parse(request.url).pathname === '/api/ss') {
        response.writeHead(200, {'Content-Type':'application/json; charset=utf-8'});
        response.end(JSON.stringify((stat != null)?stat.getJSON():null));

    }
}).listen(5000);

console.log('Server created on http://localhost:5000/');

server.on('request', () => {
        if (stat != null && stat.active) {
            stat.request();
        }
});

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
            server.close(() => {
                console.log('Server terminate');
                process.exit(1);
            });
        }, Number(input.match(/\d+/g)));
    }
    if (/sc \d+/.test(input)) {
        timer_sc = setInterval(() => {
            db_events_module.db.commit(() => console.log('Commit'));
            if(stat != null && stat.active) {
                stat.commit();
            }
        }, Number(input.match(/\d+/g)));
        timer_sc.unref();
    }
    if (/ss \d+/.test(input)) {
        stat = new stat_module();
        timer_ss = setTimeout(() => {
            stat.end();
            console.log("Requests: " + stat.requests + "\nCommits: " + stat.commits), Number(input.match(/\d+/g))
        }, Number(input.match(/\d+/g)));
        timer_ss.unref();
    }
});