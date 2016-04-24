var ApplicationModule = (function() {

    /* ---------------------------------- Local Variables ---------------------------------- */
    var sqlService = new WebSqlService();

    var homeController = new HomeController(sqlService);
    homeController.initialize().done(function() {
        console.log("HomeController initialized");
        //renderHomeView("content");
    });
    var loginController = new LoginController();
    loginController.initialize().done(function() {
        console.log("LoginController initialized");
    });
    var dashboardController = new DashboardController();
    dashboardController.initialize().done(function() {
        console.log("DashboardController initialized");
    });

    //testing websql
    homeController.setupDB();
    /* --------------------------------- Event Registration -------------------------------- */

    function testing(jqueryElem) {
        jqueryElem.on("load", function() {
            console.log(jqueryElem);
        })
    }

    function eventBind() {

        $("#loginLink").click(function() {
            var menu = $('#menu-button');
            var mainmenu = $(menu).next('ul');
            if (mainmenu.hasClass('open')) {
                mainmenu.hide().removeClass('open');
            }
            $("#content").empty();
            $("#content").load("html/login.html", function() {
                console.log("Login page loaded.");
            });
        });
        $("#dashBoardLink").click(function() {
            var menu = $('#menu-button');
            var mainmenu = $(menu).next('ul');
            if (mainmenu.hasClass('open')) {
                mainmenu.hide().removeClass('open');
            }
            dashboardController.onLoad();
            //$("#content").empty();
            //$("#content").load("html/dashboard.html", function() {

            //});
        });
        $("#homeLink").click(function() {
            var menu = $('#menu-button');
            var mainmenu = $(menu).next('ul');
            if (mainmenu.hasClass('open')) {
                mainmenu.hide().removeClass('open');
            }
            $("#content").empty();
            $("#content").load("html/homepage.html", function() {
                console.log("Home page loaded.");

            });
        });

        $("#sqlTest").click(function() {
            var menu = $('#menu-button');
            var mainmenu = $(menu).next('ul');
            if (mainmenu.hasClass('open')) {
                mainmenu.hide().removeClass('open');
            }
            $("#content").empty();
            $("#content").load("html/dashboard.html", function() {
                testing($("#dashboardView"))
            });



            //alert('sqlTest clicked.');
        });
        $('#forma').submit(function() {
            var postTo = 'https://emergencyshouter.herokuapp.com/';
            $.ajax({
                type: 'POST',
                data: 'test',
                url: 'https://emergencyshouter.herokuapp.com/',
                success: function(data) {
                    console.log(data);
                    alert('Server sent: ' + data);
                },
                error: function(data) {
                    console.log(data);
                    alert('There was an error adding your comment');
                }
            });
            return false;
        });
        $("#sndMsg").click(function() {

            var number = '+381637446277';
            var message = 'Test from the Cordova app';
            console.log("number=" + number + ", message= " + message);

            //CONFIGURATION
            var options = {
                replaceLineBreaks: false, // true to replace \n by a new line, false by default
                android: {
                    intent: '' // send SMS with the native android SMS messaging (send "INTENT" as parameter to use native)
                        //intent: '' // send SMS without open any other app
                }
            };

            var success = function() { alert('Message sent successfully'); };
            var error = function(e) { alert('Message Failed:' + e); };
            sms.send(number, message, options, success, error);
        });




    }
    /* ---------------------------------- Local Functions ---------------------------------- */
    function init(contentID) {
        homeController.returnView("content");
        //renderHomeView(contentID);
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
        eventBind();
    }

    function onSuccess(position) {
        console.log(position);
        dashboardController.geoLoc = position;
        alert(position);

    }

    function onError(error) {
        alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
    }

    function renderHomeView(conteinerID) {
        homeController.returnView(conteinerID).done(function(conteinerID) {
            console.log("RenderHoveView controller promise triggered.");
        });
    }
    /* ---------------------------------- Public Functions (selection of local functions) ---------------------------------- */
    return {
        init: init
    };
}());
