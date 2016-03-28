var socket = io();
function submitfunction(){
  var from = $('#user').val();
  var message = $('#m').val();
  if(message != '') {
    socket.emit('chatMessage', from, message);
  }
  $('#m').val('').focus();
  return false;
}
 
function notifyTyping() {
  var user = $('#user').val();
  socket.emit('notifyUser', user);
}

socket.on('chatMessage', function(from, msg){
  var me = $('#user').val();
  var color = (from == me) ? 'green' : '#009afd';
  var from = (from == me) ? 'Me' : from;
  if(from == 'System') {
    $('#messages').append('<li><i><b style="color:' + color + '">' + from + '</b>: ' + msg + '</i></li>');
  } else {
    $('#messages').append('<li><b style="color:' + color + '">' + from + '</b>: ' + msg + '</li>');
  }
});
 
socket.on('notifyUser', function(user){
  $('#notifyUser').text(user + ' is typing ...');
  setTimeout(function(){ $('#notifyUser').text(''); }, 10000);
});

socket.on('disconnect', function(userName) {
  console.log(userName);
  socket.emit('chatMessage', 'System', '<b>' + userName + '</b> has left the discussion');
});

 socket.on('updateOnline', function(count) {
  console.log("count: "+count);
  $('#online').text(count + ' people online');
 });

socket.on('add chatter', function(username) {
  var chatter = $('<li>'+username+'</li>').data('name', username);
  $('#chatters').append(chatter);
});

socket.on('remove chatter', function(username) {
  var x = $('#chatters li').filter(function(i, el){
    return $(this).data('name') == username;
  });
  x.remove();
});

//socket.on('connect', function(data) {
$(document).ready(function() {
  var name = makeid();
  $('#user').val(name);
  socket.emit('add user', name);
  socket.emit('chatMessage', 'System', '<b>' + name + '</b> has joined the discussion');
});
 
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 
  for( var i=0; i < 5; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  text = prompt("Please enter your name", text);
  return text;
}