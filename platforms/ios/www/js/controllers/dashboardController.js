var DashboardController = function() {

    var self = this;
    this.view = new DashboardView();
    this.model = new UserPositionModel("darko", "23", "42");

    this.onLoad = function() {
        //pokupi iz baze model
        //
        self.view.render(self.model, function() {
            self.setPin(self.geoLoc)
        });


    }
    this.onUpdate = function() {
        view.render(model);
    }
    this.initialize = function() {
        // No Initialization required
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }


    this.returnView = function(containerID) {
        //var deferred = $.Deferred();
        var results = $("#" + containerID).load("html/dashboard.html", function() {
            //$("#debug").append("Load performed");
            console.log("Home View loaded.");
        });
        //deferred.resolve(results);
        //return deferred.promise();
    }
    this.setPin = function(position) {

        var myLatLng = { lat: position.coords.latitude, lng: position.coords.longitude };

        var map = new google.maps.Map(document.getElementById("map"), {
            zoom: 15,
            center: new google.maps.LatLng(myLatLng)
        });

        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: 'Your position'
        });
        map.setCenter(myLatLng);
    }

}
