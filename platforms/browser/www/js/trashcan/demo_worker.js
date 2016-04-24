navigator.geolocation.getCurrentPosition(function(position) {

        //console.log(position.toJs);
        postMessage(JSON.stringify(position));

    },
    function(error) {
        //console.log(error);
        postMessage(JSON.stringify(error));
    });
