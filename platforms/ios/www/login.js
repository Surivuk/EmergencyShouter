var login = function()
{

    this.show = function(jqueryElement) {

        jqueryElement.load("html/login.html", function() {
            console.log("Login page loaded.");
            $("#submitButtonLogin").click(function() {

                //validate input client side then put it in data
                var data = {};
                data.username = $("#username").val();
                data.password = $("#password").val();

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
                }
            });
            });
        });
    }
}
