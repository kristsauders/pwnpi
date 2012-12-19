var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    util = require('util'),
    spawn = require('child_process').spawn,
    io = require('socket.io').listen(server),
    results = '\n',
    global_socket;

io.set('log level', 1);

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function(socket) {
    console.log('Connection received.');
    global_socket = socket;
    global_socket.emit('wifite-update', {
        data: results
    });
});

var wifite = spawn('/Users/kristsauders/Downloads/wifite-2.0r85/wifite.py', ['-wps', '-p', '30']);

wifite.stdout.on('data', function(data) {
    results += data.toString('utf8', 0, data.length);
    if (global_socket) {
        global_socket.emit('wifite-update', {
            data: data.toString('utf8', 0, data.length)
        });
    }
});
wifite.stderr.on('data', function(data) {
    results += data.toString('utf8', 0, data.length);
    if (global_socket) {
        global_socket.emit('wifite-update', {
            data: data.toString('utf8', 0, data.length)
        });
    }
});
wifite.on('exit', function(code) {
    results += '\n' + 'Exited with code: ' + code + '\n';
    if (global_socket) {
        global_socket.emit('wifite-update', {
            data: code
        });
    }
});

// Listen only from localhost, since this will be routed through a local Nginx proxy
server.listen(80);