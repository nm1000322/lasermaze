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
//End Global Varibles

app.get('/', function(req, res){
  io.emit('leaderboard', leaderboard);
  res.render('index');
});


app.post('/stop', function(req, res){
  clearInterval(watch);
  watch = '';
  res.redirect('.');
})

app.post('/reset', function(req, res){
  clearInterval(watch);
  timeSec = 0;
  timeMin = 0;
  //io.emit('start');
  res.render('index');
});

app.post('/start', function(req, res){
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
    //leaderboard = leaderboard.reverse();
    timeSec = 0;
    timeMin = 0;
    time = 0
    io.emit('start', timeSec);
    io.emit('startMin', timeMin);
    io.emit('startMil', time);
    console.log(leaderboard);
  });





    });


//
/*  socket.on('start', function(times){

    times = time

  });*/




/*
  socket.on('join', function(name){
    people[socket.id] = name;
    var counter = 0;

    setInterval(function(){
      counter++
      io.emit('countdown', counter)

    }, 1000);

    if (counter == 3){
      clearInterval();
    }
    console.log(stopwatch.elapsed.seconds);
    io.emit('name', people[socket.id]);
  });

*/




server.listen(3000, function (){
  console.log('Laser Maze is now Functional On Port 3000');
});
