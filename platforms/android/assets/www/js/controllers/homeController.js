var HomeController = function(dataService) {

    var service = dataService;
    //var data = [];

    this.initialize = function() {
        //  Initialization
        //service.init();
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }

    this.selectTest = function(callBack) {
        service.select("users", function(results) {
            //data.push(results);
            //console.log(data);
            console.log("Select results below:");
            console.log(results);
            alert(results.rows.item(0).text);
            callBack(results);
        });
        //return test;
    }

    this.returnView = function(containerID) {
        var deferred = $.Deferred();

        var results = $("#" + containerID).load("html/homepage.html", function() {
            //$("#debug").append("Load performed");
            console.log("Home View loaded.");
        });
        deferred.resolve(results);
        return deferred.promise();
    }

    this.setupDB = function() {
        service.createTable("users");
        service.insert("users", "darko");
    }



}
