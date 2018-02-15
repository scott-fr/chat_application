/* var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
}); */

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({extended:false});
var userMap = new Map();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	console.log('user connected');
	socket.on('chat message', function(msg){
		//console.log('message: ' + msg);
		io.emit('broadcast', msg);
	});
	socket.on('disconnect', function(){
	 console.log('user disconnected');
	 });
});

app.post('/validate_user', urlencodedParser, function(req, res){
	var username = req.body.username;
	if(userMap.has(username)){
		res.send('user already exists');
	}
	else{
		userMap.set(username, username);
		//res.redirect('/chatroom.html');
		res.sendFile(__dirname + '/chatroom.html');
	}
});

server.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("listening at http://%s:%s", host, port)

})