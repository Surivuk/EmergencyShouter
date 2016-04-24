var compass = function()
{

    var self = this;
    var canvas = null;
    var ctx = null;
    var needle = null;
    var compassBody = null;
    var degrees = 0;
    var IntervalID = {};
    this.clearCanvas = function(x,y)
    {
        ctx.clearRect(0,0,x,y);
    }
    this.draw = function() {

      self.clearCanvas(200,200);

      // Draw the compass onto the canvas
      ctx.drawImage(compassBody, 0, 0);

      // Save the current drawing state
      ctx.save();

      // Now move across and down half the
      ctx.translate(100, 100);

      // Rotate around this point
      ctx.rotate(degrees * (Math.PI / 180));

      // Draw the image back and up
      ctx.drawImage(needle, -100, -100);

      // Restore the previous drawing state
      ctx.restore();

      // Increment the angle of the needle by 5 degrees
      degrees += 5;
}
    this.show = function(jqueryElement)
    {
       jqueryElement.load('html/compass.html',function(){

          $("#stop").click(function(){
            self.stopCompass();
          });
          self.compassInit();
          IntervalID = setInterval(function(){ self.draw(); }, 100);
       });
    }

    this.compassInit = function()
    {

        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        compassBody = new Image();
        compassBody.src = 'img/compass.png'//document.getElementById("compassBody");
        needle = new Image();//document.getElementById("compassNeedle");
        needle.src = 'img/needle.png';

    }
    this.stopCompass = function()
    {
      clearInterval(IntervalID);
    }

}
