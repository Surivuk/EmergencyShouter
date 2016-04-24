var LoginController = function() {

    this.initialize = function() {
        // No Initialization required
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }


    this.returnView = function(containerID) {
        var deferred = $.Deferred();
        var results = $("#" + containerID).load("html/login.html", function() {
            //$("#debug").append("Load performed");
            console.log("Home View loaded.");
        });
        deferred.resolve(results);
        return deferred.promise();
    }



}
