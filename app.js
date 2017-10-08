var express = require('express');
var app = express();
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
var serv = require('http').Server(app);

// var index = require('./routes/index');
// var users = require('./routes/users');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
console.log('server started 2k');

// socket object
const SOCKET_LIST = {};

// function will be called if player connects to server
var io = require('socket.io')(serv,{});
io.sockets.on('connection', socket => {
  socket.id = Math.random();
  socket.x = 0;
  socket.y = 0;
  SOCKET_LIST[socket.id] = socket;
});

// location
setInterval( () => {
  for (var i in SOCKET_LIST) {
    var socket = SOCKET_LIST[i];
      socket.x++;
      socket.y++;
      socket.emit('newPosition', {
        x:socket.x,
        y:socket.y
      })
  }
}, 1000/25);

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
