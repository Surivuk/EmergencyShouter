$(document).ready(function() {
    $("#d").text("AAAA");
});

function My_socket() {
    var ws = new WebSocket('ws://emergencyshouter.herokuapp.com');

    ws.onopen = function() {
        $("#mark").text('open');
        //console.log('open');
        this.send('hello'); // transmit "hello" after connecting
    };

    ws.onmessage = function(event) {
        $("#mark").text(event.data);
        //console.log(event.data);    // will be "hello"
        this.close();
    };

    ws.onerror = function() {
        $("#mark").text('greska');
        //console.log('error occurred!');
    };

    ws.onclose = function(event) {
        //console.log('close code=' + event.code);
    };
}
