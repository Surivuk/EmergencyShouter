var home = function(state) {
    var self = this;
    batteryState = {};
    batteryState.level = '-1';

    var position = {};
    position.coords = {};
    position.coords.latitude = 0.0;
    position.coords.longitude = 0.0;



    //show homepage and big red button event bind
    this.show = function(jqueryElement) {
        jqueryElement.load("html/homepage.html", function() {

            $("#bigRedButton").click(function() {
                self.redButtonClick(jqueryElement);
            });
            var h = window.screen.height / window.devicePixelRatio;
            $("#container1").height(h * 0.8);
        });
    }

    //load emergency list and add onclick event listener for each emergency div
    //and call report with their innerHTML value as param.
    this.redButtonClick = function(jqueryElement) {
        jqueryElement.load("html/emergency_list.html", function() {
            var inputs = $(".emergencyType");

            for (i = 0; i < inputs.length; i++) {
                inputs[i].onclick = function(event) {
                    console.log(event.currentTarget.children[0].innerHTML);
                    self.report(event.currentTarget.children[0].innerHTML);
                }

            }

        });
    }

    //check online status
        //post if online
        //message if offline from local storage
        //if no number is set,in else predefine default number (operater #)
    this.report = function(emergency) {

        var testNum = null;
        var testMsg = null;
        var data = {};

        if (typeof(Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            testNum = localStorage.getItem("number");
            alert("Number:" + testNum);
            testMsg = localStorage.getItem("message")
            testMsg += ";"

        } else {
            alert("No storage support!");
            //send on predifined number , operater server admin number
        }
        //prepraviti da ne odradi report
        if (testNum == null) {
            testNum = '+381604446035';
        }
        if (testMsg == null) {
            testMsg = 'Test poruka;';
        }

        data.message = testMsg;
        data.emergencyType = emergency;
        data.batteryLevel = batteryState.level + '/100';
        data.latitude = position.coords.latitude;
        data.longitude = position.coords.longitude;


        var isOffline = 'onLine' in navigator && !navigator.onLine;

        if (isOffline) {
            //local db
            //alert(isOffline);


            console.log("number=" + testNum + ", message= " + testMsg);

            //CONFIGURATION , doesn't promt user with native messaging application
            var options = {
                replaceLineBreaks: false, // true to replace \n by a new line, false by default
                android: {
                    intent: '' // send SMS with the native android SMS messaging
                        //intent: '' // send SMS without open any other app
                }
            };

            var success = function() { alert('Message sent successfully'); };
            var error = function(e) {
                console.log(e);
                alert('Message Failed:' + e);
            };
            try{
                sms.send(testNum, JSON.stringify(data), options, success, error);
            }
            catch(error)
            {
                alert("Send message exploded.Sending message to admin.")
                //sms.send()
            }


            console.log("Offline device");

        } else {
            // internet data
            //ajax on the server
            var postTo = 'https://emergencyshouter.herokuapp.com/distress';
            $.ajax({
                type: 'POST',
                dataType: "json",
                data: data,
                url: postTo,
                success: function(data) {
                    console.log(data);
                    alert('Server sent: ' + data);
                },
                error: function(data) {
                    console.log(data);
                    alert('There was an error sending to server!');
                    //maybe send message?!
                }
            });
            alert(isOffline);
            console.log("Online device");
        }

        //console.log(emergency);

    }

    //listeners / callback responses
    this.updateBatteryStatus = function(status) {
        batteryState = status;
        console.log('BatteryState updated.');
    }
    this.updateGeolocation = function(geolocObject) {
        position = geolocObject;
        console.log('Geolocation updated.');
    }





}
