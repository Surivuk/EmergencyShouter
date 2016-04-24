$(document).ready(function(){
  var localhost_test = 'http://localhost:8081';
  var server = 'https://emergencyshouter.herokuapp.com';
  var socket = io.connect(server);
  var client = 'Klijent'; // ili username ili id kod telefona 
  var last = undefined; // spam reduction
  var i = 0;
  function toJsonMsg(type, fromID, toID, content){
    return { type: type, from: fromID, to: toID, content: content };
  };

  // korisnih inicira komunikaciju
  function sentMessageToServer(message){
    var x = toJsonMsg('txt', client, undefined, message);
    console.log(x);
    socket.emit('client_event', x);
  }
  
  socket.on('login_event_listener', function (data) {
    var con = data.connection;
    var type = data.type;
    if(con == "successful"){
      // successful connection
      if(type == "C"){
        // load client view
      }
      if(type == "W"){
        // load worker view
      }
    }
    else{
      // bad user, no connection
      // load login screan again
      // feedback
    }
  });
  
  socket.on(client + '_client_event', function (data) {
    if(data.connection != undefined){
      // operater je prihvatio ovog klijenta
    }
  
    if(data.data != undefined){
      // standardna komunikacija
      var content = data.data.content;
      //if(client == data.to){
        // poruka je za mene
        if(last != content){
          console.log(data);
          $("#client article").append('<section class="targ"> Server: ' + content + '</section>');
          last = data.server;
        }
      //}
      //else{
        // poruka nije za mene
      //}
    }
  });



  var socket2 = io.connect(server);
  var last2 = undefined; // spam reduction
  var operator = 'Surivuk';

  // korisnih inicira komunikaciju
  function sentMsg(message){
    socket2.emit('operator_event', toJsonMsg('txt', operator, undefined, message));
  }
  
  socket2.on('login_event_listener', function (data) {
    var con = data.connection;
    var type = data.type;
    if(con == "successful"){
      // successful connection
      if(type == "C"){
        // load client view
      }
      if(type == "W"){
        // load worker view
      }
    }
    else{
      // bad user, no connection
      // load login screan again
      // feedback
    }
  });
  
  socket2.on(operator + '_operator_event', function (data) {
    console.log('POGODAK OPERATOR');
    if(data.connection != undefined){
      // operater je prihvatio ovog klijenta
      $("#operator article").append('<section class="targ"> Client: ' + data.connection + '</section>');
    }
    console.log(data.data);
    if(data.data.content != undefined){
      console.log('USO U IF');
      // standardna komunikacija
      var content = data.data.content;

        // poruka je za mene
        //if(last2 != content){
          console.log(data);
          $("#operator article").append('<section class="targ"> Client: ' + content + '</section>');
          //last2 = data.server;
        //}


    }
  });

  socket2.on('new_client_event', function(data){
    socket2.emit('accept_client_event', { client: data.client, operator: operator});
  });


  $('#oButton').click(function(){
	  
    var txt = $('#operator textarea').val();
	setInterval(function(){ 
    $('#operator textarea').val('');
    $("#operator article").append('<section class="me"> Me: ' + txt + '</section>');
    sentMsg(txt);
	i = i + 1;
	}, 2000);
  });


  $('#cButton').click(function(){
    var txt = $('#client textarea').val();
	setInterval(function(){ 
		$('#client textarea').val('');
		$("#client article").append('<section class="me"> Me: ' + txt + '</section>');
    sentMessageToServer(txt + i.toString());
	i = i + 1;
	}, 2000);
    
  });






});


