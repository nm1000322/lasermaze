var Stopwatch = require("node-stopwatch").Stopwatch;
//var io = require('socket.io')(80);
var stopwatch = Stopwatch.create();
var express = require('express'),
  layout = require('express-layout'),
  app = express(),
  http = require('http'),
  server = http.createServer(app),
  io = require('socket.io').listen(server);
app.set('view engine', 'ejs');
app.set('layouts', './views/layouts');
app.use(layout());
app.use(express.static('public'));

//Global Variables

var time=0;
var startToggle = 0;
var watch = '';
var timeSec = 0;
var timeMin = 0;
var leaderboard = [];
var isRunning = false;
//End Global Varibles

app.get('/', function(req, res){
  io.emit('leaderboard', leaderboard);
  res.render('index');
});


app.post('/stop', function(req, res){
  isRunning = false;
  clearInterval(watch);
  io.emit('win');
  watch = '';
  res.redirect('/');
})

app.post('/reset', function(req, res){
  isRunning = false;
  clearInterval(watch);
  time = 0
  timeSec = 0;
  timeMin = 0;
  io.emit('startMil', time);
  io.emit('start', timeSec);
  io.emit('startMin', timeMin);
  io.emit('game over');
  res.redirect('/');
});

app.post('/start', function(req, res){
  if (isRunning == false){
    isRunning = true;
  watch = setInterval(function(){
    time++;
    if(time==100){
      timeSec++
      time = 0;
    }
    if(timeSec == 60){
      console.log("Seconds!");
      timeSec = 0;
      timeMin++;

    }
    console.log(timeSec);
    io.emit('startMil', time);
    io.emit('start', timeSec);
    io.emit('startMin', timeMin);
}, 10);
}
res.redirect('/');
});

io.on('connection', function(socket){

  console.log("A User has Connected!");

  socket.on('name submit', function(name){
    if (timeSec < 10){
      timeSec = '0' + timeSec.toString();
    }
    if(timeMin < 10){
      timeMin = '0' + timeMin.toString();

    }
    leaderboard.push(timeMin+ "." + timeSec + "." + time + ":" + name);
    leaderboard = leaderboard.sort();
    io.emit('leaderboard', leaderboard);
    timeSec = 0;
    timeMin = 0;
    time = 0
    io.emit('start', timeSec);
    io.emit('startMin', timeMin);
    io.emit('startMil', time);
    console.log(leaderboard);
  });
});


server.listen(3000, function (){
  console.log('Laser Maze is now Functional On Port 3000');
});
