var app = (function(global) {
    "use strict";
    var test = {};
    var _dashboard = {};
    var _home = {};
    var _setup = {};
    var _login = {};
    var _compass = {};

    var state = 0;
    var geolocation = {};
    geolocation.coords = {};
    geolocation.coords.latitude = 0.0;
    geolocation.coords.longitude = 0.0;
    var firstTime = true;

    var watchID;
    var batteryState = {};

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
            alert("Stanje posle dashboard click-a :"+state);
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

        $("#sqlTest").click(function() {

            if (state == 2) {
                _dashboard.hideMap();
            }

            var menu = $('#menu-button');
            var mainmenu = $(menu).next('ul');
            if (mainmenu.hasClass('open')) {
                mainmenu.hide().removeClass('open');
            }
            //alert(state);
            _compass.show($("#content"));
            state = 5;
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



    }



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
        watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);

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
        eventBind();

        _home.show($("#content"));

        //refreshLocation();
        //loadMapsApi();
        loadMapsApi();

    }


    function onBatteryStatus(status) {
        _home.updateBatteryStatus(status);
        //alert("Level: " + status.level + " isPlugged: " + status.isPlugged);
    }

    function onBatteryCritical(status) {
        alert("Battery critical!Status:" + status);
    }

    function onBatteryLow(status) {
        alert("Battery low!Status:" + status);
    }

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
        alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
        loadMapsApi();
    }

    function onOnline() {
        alert("device online");
        loadMapsApi();
    }

    function onResume() {
        alert("Device is resumed.");
        loadMapsApi();
    }

    function onOffline() {
        alert("device offline");
    }

    function loadMapsApi() {

        firstTime = false;
        //_dashboard.mapLoad(geolocation);



        if (navigator.connection.type === Connection.NONE || (global.google !== undefined && global.google.maps)) {
            return;
        }

        //TODO: Add your own Google maps API key to the URL below.
        $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyDiTpGOYpsxSsT2ku_NHGooQilONWiOs8k&callback=onMapsApiLoaded');
    }

    global.onMapsApiLoaded = function() {
        // Maps API loaded and ready to be used.

        var h = window.screen.height / window.devicePixelRatio;
        $("#map").height(h * 0.8);

        _dashboard.newMapLoad(geolocation.coords, state);

        //$("#map").hide();
        console.log("onMapAPiLoaded triggered.");

    };




    document.addEventListener("deviceready", onDeviceReady, false);

    // return test;

})(window);
