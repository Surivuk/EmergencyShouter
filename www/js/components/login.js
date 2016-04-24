var login = function() {
    var self = this;
    var socket2 = {};
    var server = 'https://emergencyshouter.herokuapp.com';
    var online = navigator.connection.type != Connection.NONE;
    this.show = function(jqueryElement) {

        jqueryElement.load("html/login.html", function() {
            console.log("Login page loaded.");
            $("#submitButtonLogin").click(function() {

                //validate input client side then put it in data
                var data = {};
                data.username = $("#username").val();
                data.password = $("#password").val();
                if ($.trim(data.username) == '') {
                    //navigator notification that username is empty
                    navigator.notification.alert(
                        'Username field is empty.', // message
                        function() {}, // callback
                        'Notification', // title
                        'Ok' // buttonName
                    );
                    return;
                }
                if ($.trim(data.password) == '') {
                    //navigator notify
                    navigator.notification.alert(
                        'Password field is empty.', // message
                        function() {}, // callback
                        'Notification', // title
                        'Ok' // buttonName
                    );
                    return;
                }

                self.pushRequestToServer(data);
            });
        });
    }
    this.pushRequestToServer = function(data) {
        alert("Status is"+online.toString());
        if (online) {
            socket2 = io.connect(server);
            socket2.emit('login_event', data);
            socket2.on('login_event_listener', function(data) {
                var con = data.connection;
                var type = data.type;
                if (con == "successful") {
                    // successful connection
                    //console.log("Successful login.")
                    self.loginDebugNotification("Successful login.");
                    if (type == "C") {
                        // load client view
                        self.loginDebugNotification("Logged in as client.");
                    }
                    if (type == "W") {
                        // load worker view
                        self.loginDebugNotification("Logged in as worker.");
                    }
                } else {
                    // bad user, no connection
                    // load login screan again
                    // feedback
                    self.loginDebugNotification("Login failed.");
                }
                socket2.disconnect();
                self.loginDebugNotification("Socket2 disconnected");
            });
            socket.on("connect", function() { self.loginDebugNotification("Socket2 connected."); });
            socket.on("disconnect", function() { self.loginDebugNotification("Socket2 disconnected"); });
            socket.on("connect_failed", function() { self.loginDebugNotification("Connection failed socket login"); });
            socket.on("error", function(err) { self.loginDebugNotification(JSON.strigify(err)); })
            socket.on('connect_error', function(e) {
                //socket.io.reconnection(false);
                self.loginDebugNotification(JSON.strigify(e));
            });
        } else {
            navigator.notification.alert(
                'Your device needs to be online to login.', // message
                function() {}, // callback
                'Notification', // title
                'Ok' // buttonName
            );
        }

    }
    this.updateConnectivity = function(connected) {
        this.online = connected;
        loginDebugNotification("Updated online status.");
    }
    this.loginDebugNotification = function(message)
    {
      navigator.notification.alert(
                        message, // message
                        function() {}, // callback
                        'Notification', // title
                        'Ok' // buttonName
                    );
    }
}
