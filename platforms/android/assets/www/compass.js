var compass = function()
{

    var self = this;
    //canvas(DOM),drawing context,needle and compass ( images )
    var canvas = null;
    var ctx = null;
    var needle = null;
    var compassBody = null;
    //magnetic facing in degrees
    var degrees = 0;
    //var IntervalID = {};

    //watch for compass ( used for turning on and off the compass monitoring)
    var CompassWatchID = {};

    /*var factorBW = 1;
    var factorBH = 1;
    var factorNW = 1;
    var factorNH = 1;*/

    //clear canvas and set dims
    this.clearCanvas = function(x,y)
    {
        ctx.clearRect(0,0,x,y);
    }
    //compass drawing
    this.draw = function() {
      var width = compassBody.width;
      var height = compassBody.height
      self.clearCanvas(width,height);

      // Draw the compass onto the canvas
      ctx.drawImage(compassBody, 0, 0);

      // Save the current drawing state
      ctx.save();

      // Now move across and down half the (10 offset because picture is retarded.)
      ctx.translate(compassBody.width/2, compassBody.height/2+10);

      // Rotate around this point
      ctx.rotate(degrees * (Math.PI / 180));

      // Draw the image back and up
      ctx.drawImage(needle, -needle.width/2, -needle.height/2);

      // Restore the previous drawing state
      ctx.restore();


}
    //add the canvas to modal in index.html and bind stopCompass on close
    this.show = function(jqueryElement)
    {
       jqueryElement.load('html/compass.html',function(){

          $("#closeCompass").click(function(){
            self.stopCompass();
          });
          self.compassInit();

          var options = { frequency: 500 };  // Update every 0.5 seconds

          //start watching device compass and callback on success and error
          CompassWatchID = navigator.compass.watchHeading(self.onSuccess, self.onError, options);
       });
    }
    //canvas,context and images init
    this.compassInit = function()
    {

        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        compassBody = new Image();
        compassBody.src = 'img/compass.png'//document.getElementById("compassBody");
        var bodyWidth = compassBody.width;
        var bodyHeight = compassBody.height;



        needle = new Image();//document.getElementById("compassNeedle");
        needle.src = 'img/needle.png';
        var needleWidth = needle.width;
        var needleHeight = needle.height;
/*
        var ratio = Math.min(200/bodyWidth,200/bodyHeight);
        bodyWidth = bodyWidth*ratio;
        bodyHeight = bodyHeight*ratio;

        canvas.width  = bodyWidth;
        canvas.height = bodyHeight;

        ratio = Math.min(200/needleWidth,200/needleHeight);
        needleWidth = needleWidth*ratio;
        needleHeight = needleHeight*ratio;*/
    }
    this.stopCompass = function()
    {
      navigator.compass.clearWatch(CompassWatchID);
    }

    //update degrees with magneticHeading propraty and redraw
    //possible upgrade ( redrow only the arrow )
    this.onSuccess = function(heading) {
      degrees = heading.magneticHeading;
      console.log("Compass updated,object:");
      console.log(heading);
      self.draw();

    };

    this.onError = function(compassError) {
        alert('Compass error: ' + compassError.code);
    };

    //css wizardry , #notused
    /*
    function rotate(degrees,jqueryElement){
    jqueryElement.css({
    "webkitTransform":"rotate("+degrees+"deg)",
    "MozTransform":"rotate("+degrees+"deg)",
    "msTransform":"rotate("+degrees+"deg)",
    "OTransform":"rotate("+degrees+"deg)",
    "transform":"rotate("+degrees+"deg)"
  });
  }
    function scale(x,y,jqueryElement){
    jqueryElement.css({
    "webkitTransform":"scale("+x+","+y+")",
    "MozTransform":"scale("+x+","+y+")",
    "msTransform":"scale("+x+","+y+")",
    "OTransform":"scale("+x+","+y+")",
    "transform":"scale("+x+","+y+")"
  });
  }*/



}
