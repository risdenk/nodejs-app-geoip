var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

app.use(express.static(__dirname+'/static'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/2', function (req, res) {
  res.sendfile(__dirname + '/index2.html');
});

var maxLastData = 100;
var lastData = new Array(maxLastData);
var count = 0;

function resendLastMessages(socket) {
  for(var i=0; i< maxLastData; i++) {
    if(lastData[i] != null) {
      socket.emit('news', lastData[i]);
    }    
  }
}

io.configure('production', function(){
  io.enable('browser client minification');  // send minified client
  io.enable('browser client etag');
  io.enable('browser client gzip');          // gzip the file
  io.set('log level', 1);

  io.set('transports', [
    'websocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
  ]);
});

io.configure('development', function(){
  io.set('transports', ['websocket']);
});

io.sockets.on('connection', function (socket) {
  resendLastMessages(socket);
  socket.on('test', function(data) {
    lastData[count % maxLastData] = data;
    count++;
    socket.broadcast.emit('news', data);
  });
});

server.listen(8080);
