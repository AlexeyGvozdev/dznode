var flash = require('connect-flash');
var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session');
var index = require('./routes');
const mongoose = require('mongoose');
var app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://sinx:vjhjptdbx99@ds125211.mlab.com:25211/finaldz');
// var users = require('./routes/users');



app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  key: 'key',
  cookie: {
    path: '/',
    maxAge: null,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false}));

app.use(logger('dev'));
app.set('mongooseClient', mongoose);
app.use(bodyParser.json({type: 'text/plain'}));
app.use(bodyParser.urlencoded({extended: false}));
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon')));

app.use(flash());


// app.use(cookieParser());


app.all('/', (req, res, next) => {
  console.log(req.session);
  console.log(12345);
  
  next();
});


app.use('/api', index);
app.get('*', function(req, res) {
  req.session.q = 123;
  console.log(req.session.user);
  // console.log(path.resolve(path.join('master', 'public', 'index.html')));
  // if(req.session.user) {
  //   db.getUser({username: req.session.user})
  //     .then((user) => {
  //       console.log('from /', user);
  //       res.setHeader('Content-Type', 'application/json');
  //       res.send(user);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }
  res.sendFile(path.resolve(path.join('master', 'public', 'index.html')));
});

// error handler
app.use(function (err, req, res, next) {
  
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req
    .app
    .get('env') === 'development'
    ? err
    : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

const clients = {};
let count = 0;
io
  .sockets
  .on('connection', function (socket) {
    let id = count++;
    clients[id] = socket.id;
    console.log(clients);
    socket.send({type: 'hello', message: `Приветствуем! ваш идентификатор  ${id}`, data: id});
    socket.send({type: 'info', message: `K нам присоединился #${id}`});
    socket
      .broadcast
      .send({type: 'info', message: `K нам присоединился #${id}`});
    socket.on('message', message => {
      socket.send({type: 'message', message: message, author: id});
      socket
        .broadcast
        .send({type: 'message', message: message, author: id});
    });
    socket.on('disconnect', (data) => {
      delete clients[id];
      console.log(clients);
    });
  })
server.listen(3000, () => {
  console.log('Server running');
})


// module.exports = app;