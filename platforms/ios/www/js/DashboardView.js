var DashboardView = function() {
    var self = this;


    this.render = function(model, callback) {
        $("#content").load("html/dashboard.html", function() {
            //var test = model.toHtml();
            callback();
        });
    }
    this.updateModel = function(model) {
        self.model = model;
        self.render();
    }
}
