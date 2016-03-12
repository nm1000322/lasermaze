var socket = io();
$('.name').hide();

socket.on('leaderboard', function(leaderboard){
  console.log("hi");
  $(".leaderboard").html('');
  leaderboard.forEach(function(entry){
    var entrySplit = entry.split(":")
    var time = entrySplit[0];
    var name = entrySplit[1];
    time  = time.replace(".", ":");
    console.log(entrySplit);
    $(".leaderboard").append($('<tr class="data">').html("<td>" + name + "</td>" +"<td>" + time + "</td>"));
    console.log(name);
  });
  });
socket.on('start', function(time){
  if (time < 10){
    $('.stopwatch').html("0" + time);
  }
  else{
  $('.stopwatch').html(time);
  }
  console.log(time);
});




socket.on('startMin', function(time){
  if (time < 10){
    $('.stopwatchMiN').html("0" + time);
  }
  else{
  $('.stopwatchMin').html(time);
  }
  console.log(time);
});

socket.on('startMil', function(time){
  if (time < 10){
    $('.stopwatchMil').html("0" + time);
  }
  else{
  $('.stopwatchMil').html(time);
  }
  console.log(time);
});

$('.start').click(function(){
  console.log("Sent!");
  $.ajax({
    method: "POST",
    url: "/start"
  });

});






/*var socket = io();

$('form').submit(function(){

  socket.emit('name', $('#nameForm').val());
  socket.emit('time');
  $('#nameForm').val('');
  return false;
});
socket.on('name', function(name){
    $('#counter').html(counter);
  if(name != ''){
  $('#names').append($('<li>').text(name));
}
});
socket.on('countdown', function(time){
  console.log("Test");
  $('#time').html(time);

});

*/


$('.stop').click(function(){
  $('.name').show();
  $.ajax({
    method: "POST",
    url: "/stop"
  });

});

$('.reset').click(function(){
  $.ajax({
    method: "POST",
    url: "/reset"
  });
});

$('.name').submit(function(){
  $(".name").hide();
  socket.emit('name submit', $('.nameInput').val());
  $('.nameInput').val('');
  return false;
});
