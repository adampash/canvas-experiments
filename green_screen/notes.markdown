# What you need to know:

  * This was a really fun experiment in image processing in canvas.

  * It's surprisingly simple.

  * Here's all you need to know:

## THING 1:
### rgba(<0..255>, <0..255>, <0..255>, <0..1>)
  You've probably seen this before, but in case you haven't:

  Computers can make colors out of red, green, and blue values ranging from 0 to 255.

    ```psuedoCSS
      black = rgba(0, 0, 0, 1);
      white = rgba(255, 255, 255, 1);
    ```

  The a in rgba is alpha: 0 is transparent, 1 is opaque.**

## THING 2:
### navigator.getUserMedia(<constraints>, <successCallback>, <errorCallback>)

  (or, rather, navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;)

    * Allows us to grab video from a connected camera
      * Most often webcams
      * Also does audio and screen sharing (TK)

    * When we get the user's video stream via successCallback, you can assign it to
      a <video> element.

    * OR if you want to do more interesting things with it, we can paint it to a canvas.

    ```javascript
      context.drawImage(<videoSource>, <posX, posY>, ...)
      // videoSource references a video DOM element.
      // In my example, this video element is hidden
    ```

## THING 3:
### Getting and puting image data

  * You can get image data from a canvas, manipulate the data, and then draw it back to the canvas... CHANGED.
    ```javascript
      var imageData = context.getImageData(<posX>, <posY>, <imageWidth>, <imageHeight>)

      // DO STUFF WITH imageData //

      context.putImageData(imageData);
    ```

  imageData is an array-like object that contains a number of pixels amounting to:

     imageWidth * imageHeight * 4.

### Why 4?

  Because each set of four integers represents you rgba values for an individual pixel.

  That's all you need to know to do some pretty fun video/image manipulation with canvas.
