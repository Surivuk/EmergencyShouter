var UserPositionModel = function(username, lat, lng) {
    var self = this;
    this.userName = username;
    this.latitude = lat;
    this.longitude = lng;

    this.toHtml = function() {
        var propraties = [self.userName, self.latitude, self.longitude];
        var div = $("<div>");
        for (i = 0; i < propraties.length; i++) {
            var p = $("<p>");
            p.text(propraties[i]);
            p.appendTo(div);
        }
        return div;

    }
}
