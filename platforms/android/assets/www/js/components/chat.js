var chat = function(live) {

    var self = this;
    var $messages = null;
    var d = {};
    var m = {};
    var firstTime = true;
    //socket settup
    var localhost_test = 'http://localhost:8081';
    var server = 'https://emergencyshouter.herokuapp.com';
    var socket = live ? io.connect(server) : io.connect(localhost_test);
    var client = 'Klijent'; // ili username ili id kod telefona
    var last = undefined; // spam reduction

    //var socket2 = io.connect(localhost_test);
    var last2 = undefined; // spam reduction
    var operator = 'Surivuk';

    this.updateScrollbar = function() {
        $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
            scrollInertia: 10,
            timeout: 0
        });
    }

    this.setDate = function(message) {
        d = new Date()
            //if (m != d.getMinutes()) {
        m = d.getMinutes();
        if (m > -1 && m < 10) m = "0" + m.toString();
        $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo(message);
        //}
    }

    // korisnih inicira komunikaciju
    this.sentMsg = function(message) {
            socket2.emit('operator_event', self.toJsonMsg('txt', operator, undefined, message));
        }
        // korisnik inicira komunikaciju
    this.sendMessageToServer = function(message) {
        var x = self.toJsonMsg('txt', client, undefined, message);
        console.log(x);
        socket.emit('client_event', x);
    }
    this.insertMessage = function() {
        msg = $('.message-input').val();
        if ($.trim(msg) == '') {
            return false;
        }
        var message = $('<div class="message message-personal"><p>' + msg + '</p></div>');
        self.setDate(message);
        message.appendTo($('.mCSB_container')).addClass('new');

        $('.message-input').val(null);
        self.updateScrollbar();
        self.sendMessageToServer(msg);
    }
    this.show = function(jqueryElement) {
        var h = window.screen.height / window.devicePixelRatio;
        //var w = window.screen.width / window.devicePixelRatio;
        jqueryElement.load("html/chat.html", function() {

            $(".chat").height(h * 0.7);
            $messages = $('.messages-content');
            $messages.mCustomScrollbar();


            $('.message-input').on('input', function(who) {
                var text = $("#preview");
                if (firstTime) {
                    text.show();
                    firstTime = false;
                  }
                  var test = $(this).val();
                  text[0].innerHTML = test;


            });

            $("#sendMSG").click(function() {
                self.insertMessage();

            });
            $('html').bind('keypress', function(e) {
                if (e.keyCode == 13) {
                    $("#preview").hide();
                    firstTime = true;
                    self.insertMessage();

                }
            });
        });
    }

    this.fakeMessage = function(message) {

        if ($('.message-input').val() != '') {
            return false;
        }
        //$('<div class="message loading new"><figure class="avatar"><img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80_4.jpg" /></figure><span></span></div>').appendTo($('.mCSB_container'));
        self.updateScrollbar();

        //<figure class="avatar"><img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80_4.jpg" /></figure>
        //setTimeout(function() {
        //$('.message.loading').remove();
        var message = $('<div class="message new">' + message + '</div>');
        self.setDate(message);
        message.appendTo($('.mCSB_container')).addClass('new');

        self.updateScrollbar();

        //}, 1000 + (Math.random() * 20) * 100);

    }

    this.toJsonMsg = function(type, fromID, toID, content) {
        return { type: type, from: fromID, to: toID, content: content };
    };



    socket.on('login_event_listener', function(data) {
        var con = data.connection;
        var type = data.type;
        if (con == "successful") {
            // successful connection
            if (type == "C") {
                // load client view
            }
            if (type == "W") {
                // load worker view
            }
        } else {
            // bad user, no connection
            // load login screan again
            // feedback
        }
    });

    socket.on(client + '_client_event', function(data) {
        if (data.connection != undefined) {
            // operater je prihvatio ovog klijenta
        }

        if (data.data != undefined) {
            // standardna komunikacija
            var content = data.data.content;
            //if(client == data.to){
            // poruka je za mene
            if (last != content) {
                console.log(data);
                //$("#client article").append('<section class="targ"> Server: ' + content + '</section>');
                self.fakeMessage(content);
                last = data.server;
            }
            //}
            //else{
            // poruka nije za mene
            //}
        }
    });



    /*
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
      */
}
