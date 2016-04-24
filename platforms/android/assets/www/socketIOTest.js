


 var last = undefined;
 var socket = io.connect('http://localhost:8081');
    socket.on('news', function (data) {
     if(last != data.server){
      console.log(data);
        $("#cont").append('<p>' + data.server + '</p>');
        last = data.server;
     }
    });

