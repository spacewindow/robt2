
          var canvas = document.createElement('canvas');
          var c = canvas.getContext('2d');

        canvas.width = 200;
        canvas.height = 200;

        var xpos=0,
            ypos=0,
            index=0,
            numFrames = 240,
            frameSize= 200;

          // Add our drawing canvas
          document.getElementById("status").appendChild(canvas);

           //load the image
        image = new Image();
        image.src = "http://michaelthwaites.dev/wp-content/themes/mrt-theme/images/birds_loop_ORIG_LARGE.png";

        image.onload = function() {

            //we're ready for the loop
            setInterval(loop, 1000 / 30);
        }


        function loop() {
            //clear the canvas!
            c.clearRect(0,0, 200, 200);

            /*our big long list of arguments below equates to:
                1: our image source
                2 - 5: the rectangle in the source image of what we want to draw
                6 - 9: the  rectangle of our canvas that we are drawing into

                the area of the source image we are drawing from will change each time loop() is called.
                the rectangle of our canvas that we are drawing into however, will not.
                tricky!
            */
            c.drawImage(image,xpos,ypos,frameSize,frameSize,0,0,frameSize, frameSize);

            //each time around we add the frame size to our xpos, moving along the source image
            xpos += frameSize;
            //increase the index so we know which frame of our animation we are currently on
            index += 1;

            //if our index is higher than our total number of frames, we're at the end and better start over
            if (index >= numFrames) {
                xpos =0;
                ypos =0;
                index=0;
            //if we've gotten to the limit of our source image's width, we need to move down one row of frames
            } else if (xpos + frameSize > image.width){
                xpos =0;
                ypos += frameSize;
            }


        }
