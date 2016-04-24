var dashboard = function(state) {
    var self = this;
    var view_state = state;

    //var position = {};
    var mapPTR = {};
    var htmlLoaded = false;
    var flagForMapLoad = false;

    var mapZoom = 16;
    var clicked = false;
    this.show = function(jqueryElement, position) {
        if (!clicked) {
            jqueryElement.empty();
            /*mapPTR = new google.maps.Map(document.getElementById("map"), {
                zoom: mapZoom,
                center: { lat: position.latitude, lng: position.longitude }
            });
*/
            $("#map").css({ opacity: 1, zoom: 1 });
            $("#map").css('z-index', 0);
            clicked = true;
        } else if (clicked) {
            $("#map").css({ opacity: 1, zoom: 1 });
            $("#map").css('z-index', 0);

        }




        /*jqueryElement.load("html/dashboard.html", function() {


            $("#save").click(function() {

                if (typeof(Storage) !== "undefined") {
                    // Code for localStorage/sessionStorage.
                    var key = "hard"; //$("#key").attr('value');
                    var value = "coded"; //$("#value").attr('value');
                    localStorage.setItem(key, value);

                } else {
                    alert("No storage support!");
                }
            });
            $("#show").click(function() {
                if (typeof(Storage) !== "undefined") {
                    // Code for localStorage/sessionStorage.
                    alert(localStorage.getItem("hard"));

                } else {
                    alert("No storage support!");
                }
            });
            htmlLoaded = true;
            if (flagForMapLoad) {
                self.mapLoad(position);
            }

        });*/
        console.log("dashboard loaded.");
    }
    this.hideMap = function() {
        $("#map").css({ opacity: 0, zoom: 0 });
        $("#map").css('z-index', -5);
    }
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
        alert("New map load trigger,state:" + state);

    }

    this.mapUpdate = function(position, map) {

            mapPTR.setCenter({ lat: position.latitude, lng: position.longitude });
            console.log("Map updated.");
        }
        /*this.getDeviceLocation = function() {
    }
    navigator.geolocation.getCurrentPosition(function(position) { self.deviceLocated(position); },
        function(error) { self.deviceLocationError; });
}
this.deviceLocated = function(position) {
    self.position = position;
    console.log(position);
}
this.deviceLocationError = function(error) {
    console.log(error);
    alert(error.message);
}
*/

}
