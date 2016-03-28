var express=require('express');
var app = express();
var server = require('http').Server(app); // or use require('http').createServer(app)
var io = require('socket.io')(server);
var path = require('path');
var redis = require('redis');
var redisClient = redis.createClient();

var storeMessage = function(from, message) {
  var data = JSON.stringify({name: from, message: message});
  redisClient.lpush("messages", data, function(err, response) {
    redisClient.ltrim("messages", 0, 9);
  });
};

app.get('/', function(req, res){
  app.use(express.static(path.join(__dirname)));
  res.sendFile(path.join(__dirname, '../chat-application', 'index.html'));
});
 
// Register events on socket connection
io.on('connection', function(client){
  
  client.on('chatMessage', function(from, msg){
    if(from != 'System') {
      storeMessage(from, msg);
    }
    io.emit('chatMessage', from, msg);
  });
  
  client.on('notifyUser', function(user){
    client.broadcast.emit('notifyUser', user);
  });

  client.on('add user', function(username) {
    client.username = username;
    client.broadcast.emit('add chatter', username);
    redisClient.sadd('chatters', username);

    redisClient.smembers('chatters', function(err, chatters) {
      chatters.forEach(function(name) {
        client.emit('add chatter', name);
      });
    });

    redisClient.lrange("messages", 0, -1, function(err, messages){
      messages = messages.reverse();
      messages.forEach(function(message){
        message = JSON.parse(message);
        client.emit('chatMessage', message.name, message.message);
      });
    });
  });

  client.on('disconnect', function() {
    client.broadcast.emit('chatMessage', 'System', '<b>' + client.username + '</b> has left the discussion.');
    client.broadcast.emit('remove chatter', client.username);
    redisClient.srem("chatters", client.username);
  });
});
 
// Listen application request on port 8080
server.listen(8080, function(){
  redisClient.del('messages');
  redisClient.del('chatters');
  console.log('listening on *:8080');
});