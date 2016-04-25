var app = (function(global) {
    "use strict";
    //use strict means you cant use global variables , e.g variable without var (clean global scope)
    var test = {};
    var release = true;
    //singlton objects representing controllers,observers whatever.
    var _dashboard = {};
    var _home = {};
    var _setup = {};
    var _login = {};
    var _compass = {};
    var _chat = {};


    //state of the view (what is user seeing in any given moment)
    var state = 0;
    //GPS location
    var geolocation = {};
    geolocation.coords = {};
    geolocation.coords.latitude = 0.0;
    geolocation.coords.longitude = 0.0;
    //var firstTime = true;

    //watchID for geolocation plugin ( for stoping end starting )
    var GeolocationWatchID;

    var batteryState = {};


    //all the menu / navigation events
    function eventBind() {

        $("#settingsLink").click(function() {
            if (state == 2) {
                _dashboard.hideMap();
            }
            var menu = $('#menu-button');
            var mainmenu = $(menu).next('ul');
            if (mainmenu.hasClass('open')) {
                mainmenu.hide().removeClass('open');
            }
            _setup.show($("#content"));
            state = 1;
        });
        $("#dashBoardLink").click(function() {

            var menu = $('#menu-button');
            var mainmenu = $(menu).next('ul');
            if (mainmenu.hasClass('open')) {
                mainmenu.hide().removeClass('open');
            }
            if (state == 2) return;
            $("#content").empty();
            _dashboard.show($("#content"), geolocation.coords);

            state = 2;
            //alert("Stanje posle dashboard click-a :"+state);
        });
        $("#homeLink").click(function() {
            if (state == 2) {
                _dashboard.hideMap();
            }
            var menu = $('#menu-button');
            var mainmenu = $(menu).next('ul');
            if (mainmenu.hasClass('open')) {
                mainmenu.hide().removeClass('open');
            }
            _home.show($("#content"));

            state = 3;
        });

        $("#compass").click(function() {
            console.log("Compass clicked");

            var menu = $('#menu-button');
            var mainmenu = $(menu).next('ul');
            if (mainmenu.hasClass('open')) {
                mainmenu.hide().removeClass('open');
            }
            //alert(state);
            _compass.show($("#compassContent"));
            //state = 5;
        });
        $("#loginLink").click(function() {

            if (state == 2) {
                _dashboard.hideMap();
            }
            var menu = $('#menu-button');
            var mainmenu = $(menu).next('ul');
            if (mainmenu.hasClass('open')) {
                mainmenu.hide().removeClass('open');
            }
            _login.show($("#content"));

            state = 4;
        });
        $("#chatLink").click(function() {

            if (state == 2) {
                _dashboard.hideMap();
            }
            var menu = $('#menu-button');
            var mainmenu = $(menu).next('ul');
            if (mainmenu.hasClass('open')) {
                mainmenu.hide().removeClass('open');
            }
            _chat.show($("#content"));

            state = 5;
        });

    }


    //main entry point
    function onDeviceReady() {
        console.log("On device ready triggered.");
        //check local storage for
        var NumberAndMessageSet = localStorage.getItem("numberAndMessage");
        if(NumberAndMessageSet == null || NumberAndMessageSet == false)
        {
            navigator.notification.alert(
                'Please go to setup and set your message and alert number.',  // message
                function(){},         // callback
                'Notification',            // title
                'Ok'                  // buttonName
            );
        }
        var options = { timeout: 30000, enableHighAccuracy: true };
        GeolocationWatchID = navigator.geolocation.watchPosition(onSuccess, onError, options);

        global.addEventListener("batterystatus", onBatteryStatus, false);
        global.addEventListener("batterycritical", onBatteryCritical, false);
        global.addEventListener("batterylow", onBatteryLow, false);

        document.addEventListener("offline", onOffline, false);
        document.addEventListener("online", onOnline, false);
        document.addEventListener("resume", onResume, false);


        _dashboard = new dashboard(0);
        _home = new home(0);
        _setup = new setup();
        _login = new login();
        _compass = new compass();

        _chat = new chat(release);

        eventBind();

        _home.show($("#content"));

        //refreshLocation();
        //loadMapsApi();
        loadMapsApi();

    }

    //update home instance when battery changes
    function onBatteryStatus(status) {
        _home.updateBatteryStatus(status);
        //alert("Level: " + status.level + " isPlugged: " + status.isPlugged);
    }

    function onBatteryCritical(status) {
        //alert("Battery critical!Status:" + status);
        navigator.notification.alert(
                'Battery critical,going in power save mode.',  // message
                function(){},         // callback
                'Notification',            // title
                'Ok'                  // buttonName
            );
    }

    function onBatteryLow(status) {
        //alert("Battery low!Status:" + status);
        navigator.notification.alert(
                'Your battery is low!',  // message
                function(){},         // callback
                'Notification',            // title
                'Ok'                  // buttonName
            );
    }

    //callback for geolocation watch trigger,home instance location update
    //and dashboard map update
    function onSuccess(position) {
        geolocation = position;
        _home.updateGeolocation(geolocation);
        console.log(geolocation);



        /*if (firstTime) {

            loadMapsApi();
        } else {*/
            _dashboard.mapUpdate(geolocation.coords);
        //}

    }

    // onError Callback receives a [PositionError](PositionError/positionError.html) object
    //
    function onError(error) {
        console.log(error);
        //alert('code: ' + error.code + '\n' +'message: ' + error.message + '\n');

        loadMapsApi();
    }

    //callbacks for device state (connectivity and resuming)
    function onOnline() {
        //alert("device online");
        navigator.notification.alert(
                'Device is online.',  // message
                function(){},         // callback
                'Notification',            // title
                'Ok'                  // buttonName
            );
        _login.updateConnectivity(true);
        loadMapsApi();
    }

    function onResume() {
        //alert("Device is resumed.");
        navigator.notification.alert(
                'Device resumed.',  // message
                function(){},         // callback
                'Notification',            // title
                'Ok'                  // buttonName
            );
        loadMapsApi();
    }

    function onOffline() {
        //alert("device offline");
        navigator.notification.alert(
                'Device offline.',  // message
                function(){},         // callback
                'Notification',            // title
                'Ok'                  // buttonName
            );
        _login.updateConnectivity(false);
    }

    //loads scripts if you are connected and script isn't loaded
    function loadMapsApi() {

        //firstTime = false;
        //_dashboard.mapLoad(geolocation);



        if (navigator.connection.type === Connection.NONE || (global.google !== undefined && global.google.maps)) {
            return;
        }

        //TODO: Add your own Google maps API key to the URL below.
        $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyDiTpGOYpsxSsT2ku_NHGooQilONWiOs8k&callback=onMapsApiLoaded');
    }
    //global function for script onload,map size callculation and dashboard prompt for creation.
    global.onMapsApiLoaded = function() {
        // Maps API loaded and ready to be used.

        var h = window.screen.height / window.devicePixelRatio;
        $("#map").height(h * 0.8);

        _dashboard.newMapLoad(geolocation.coords, state);

        //$("#map").hide();
        console.log("onMapAPiLoaded triggered.");

    };



    //main event listener
    document.addEventListener("deviceready", onDeviceReady, false);

    // return test;

})(window);
