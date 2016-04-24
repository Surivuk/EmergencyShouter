var setup = function() {

    var self = this;

    //show settings html and bind event for contact select button
    this.show = function(jqueryElement) {

        jqueryElement.load("html/setup.html", function() {
            console.log("Settings page loaded.");
            $("#contactSelect").click(function() {

                self.submitSettingsClick();
            });
        });

        //get message from the input,pick contact and set them in localStorage
        this.submitSettingsClick = function()
        {
            var message = $("#inputLarge").val();
            navigator.contacts.pickContact(function(contact){

                navigator.notification.alert(
                    'You picked',  // message
                    function() {alert("alertDismissed");},// callback
                    'Contact :'+contact.name.givenName+'\nNumber:'+contact.phoneNumbers[0].value,// title
                    'Ok'                  // buttonName
                    );

                localStorage.setItem('number', contact.phoneNumbers[0].value);
                localStorage.setItem('message', message);
                //process input then set flag to true!!
                localStorage.setItem('numberAndMessage',true);

                navigator.notification.alert(
                    'Number and message set.',  // message
                    function(){},         // callback
                    'Success',            // title
                    'Ok'                  // buttonName
                    );
                    console.log("Number and message set.");


            },function(err){
                navigator.notification.alert(
                    'Number and message not set,there was an error with accessing contacts:'+err,  // message
                    function(){},         // callback
                    'Error',            // title
                    'Ok'                  // buttonName
                    );
                    console.log("Number and message not set.");

            });
        }
    }
}
