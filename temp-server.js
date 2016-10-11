/*
* author: John Voltaire Pili
*/
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io').listen(server);
var fs = require('fs');
app.use(express.static(__dirname + '/images'));  
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/scripts'));

app.get('/fonts/lcd.ttf', function(req, res,next) {
    res.sendFile(__dirname + '/fonts/lcd.ttf');
});
app.get('/fonts/segmental.ttf', function(req, res,next) {
    res.sendFile(__dirname + '/fonts/segmental.ttf');
});
app.get('/images/logo.png', function(req, res,next) {
    res.sendFile(__dirname + '/images/logo.png');
});
app.get('/images/background.jpg', function(req, res,next) {
    res.sendFile(__dirname + '/images/background.jpg');
});
app.get('/css/site.css', function(req, res,next) {
    res.sendFile(__dirname + '/css/site.css');
});
app.get('/scripts/jquery-2.2.0.min.js', function(req, res,next) {
    res.sendFile(__dirname + '/scripts/jquery-2.2.0.min.js');
});
app.get('/scripts/socket.io-1.4.5.js', function(req, res,next) {
    res.sendFile(__dirname + '/scripts/socket.io-1.4.5.js');
});
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});
server.listen(9000);

io.sockets.on('connection', function(socket){
    var path = 'json/';
    fs.watchFile('' + path + 'temp.json', function(curr, prev) {
        fs.readFile('' + path + 'temp.json', 'utf8', function(err, data) {
        if(err) 
	{
	    //throw err;
	    console.log(err);
	}
        var json = data;
        console.log(data);
        socket.volatile.emit('notification1', json);
        });
    });

    fs.readFile('' + path + 'temp.json', 'utf8', function(err, data) {
        if(err)
        {
            //throw err;
            console.log(err);
        }
        var json = data;
        console.log(data);
        socket.volatile.emit('notification1', json);
    });
});
