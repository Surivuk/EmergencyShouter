var dashboard = function(state) {
    var self = this;

    //map pointer (google.maps.Map object with API functions)
    var mapPTR = {};
    var mapZoom = 16;
    //flag for anti spam
    var clicked = false;

    //shows map with css magic
    this.show = function(jqueryElement, position) {
        if (!clicked) {
            jqueryElement.empty();

            $("#map").css({ opacity: 1, zoom: 1 });
            $("#map").css('z-index', 0);
            clicked = true;
        } else if (clicked) {
            $("#map").css({ opacity: 1, zoom: 1 });
            $("#map").css('z-index', 0);

        }

        console.log("dashboard loaded.");
    }
    //pull map back and make it invisible
    this.hideMap = function() {
        $("#map").css({ opacity: 0, zoom: 0 });
        $("#map").css('z-index', -5);
    }
    //create new map object with position passed and state
    this.newMapLoad = function(position, state) {

        mapPTR = new google.maps.Map(document.getElementById("map"), {
            zoom: mapZoom,
            center: { lat: position.latitude, lng: position.longitude }
        });
        if (state == 2) {
            $("#map").css({ opacity: 1, zoom: 1 });
        } else {
            $("#map").css({ opacity: 0, zoom: 0 });
        }
        //alert("New map load trigger,state:" + state);
        console.log("New map load trigger,state:" + state);


    }
    //update map center when GPS location triggers ( this is essencially callback when you change your location dramatically)
    this.mapUpdate = function(position, map) {

            mapPTR.setCenter({ lat: position.latitude, lng: position.longitude });
            console.log("Map updated.");
        }
}
