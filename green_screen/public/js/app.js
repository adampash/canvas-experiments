var canvas, backCanvas, context, backContext, webcam, lastData, circles;

var toggles = {
  bigBlur     : false,
  smallBlur   : false ,
  whiteScreen : false,
  inverse     : false,
  noBG        : false,
  greenScreen : false,
  bnw         : false,
  circles     : false
};

greenScreenData = {
  r: 0.85,
  g: 50,
  b: 0.85
};


window.onload = function() {
  canvas = document.getElementById('animation');
  canvas.height = $(window).height();
  canvas.width = $(window).width();
  context = Context = canvas.getContext('2d');
  backCanvas = document.createElement('canvas');
  backContext = canvas.getContext('2d');
  webcam = document.getElementById('video');
  circles = new Circles(3, {color: 'green', size: 100});
  $('.toggles .toggle').on('click', function() {
    $this = $(this);
    var toggle = $this.attr('id');
    console.log(toggle);
    toggles[toggle] = !toggles[toggle];
    $this.toggleClass('active');
  });
  $(canvas).on('click', function(event) {
    var x = event.pageX;
    var y = event.pageY;

    var pixelData = context.getImageData(x, y, 1, 1);
    var r = pixelData.data[0];
    var g = pixelData.data[1];
    var b = pixelData.data[2];

    greenScreenData = {
      r: r/g + .20,
      g: g - 20,
      b: b/g + .20
    };

  });
}

function clearWindow() {
  canvas.width = canvas.width;
}

function draw() {
  if (webcam && video.src) {
    clearWindow();
    backContext.drawImage(webcam,0,0);
    // Grab the pixel data from the backing canvas
    if (circles && toggles.circles) circles.draw();
    var idata = backContext.getImageData(0,0,canvas.width,canvas.height);
    var data = idata.data;
    // Loop through the pixels
    for(var i = 0; i < data.length; i+=4) {
      var r = data[i];
      var g = data[i+1];
      var b = data[i+2];
      // green screen
      if (toggles.greenScreen) {
        if (g > greenScreenData.g && b/g < greenScreenData.b && r/g < greenScreenData.r) {
          data[i+3] = 0;
        }
      }

      // black and white
      if (toggles.bnw) {
        // 255 * 3 = 765
        var brightness = (r + g + b)/3;
        data[i] = brightness;
        data[i+1] = brightness;
        data[i+2] = brightness;
      }
      // big blur
      if (toggles.bigBlur) {
        if (lastData) {
          data[i]   = r+lastData[i]  *3 / 4;
          data[i+1] = g+lastData[i+1]*3 / 4;
          data[i+2] = b+lastData[i+2]*3 / 4;
          // data[i+3] = r+lastData[i+3]*2 / 3;
        }
      }
      // average images/mini-blur
      if (toggles.smallBlur) {
        if (lastData) {
          // data[i] = r+lastData[i] / 2;
          // data[i+1] = g+lastData[i+1] / 2;
          // data[i+2] = b+lastData[i+2] / 2;
          data[i+3] = r+lastData[i+3]*2 / 3;
        }
      }
      // cut out background
      if (toggles.noBG) {
        if (g > 100) {
          data[i+3] = 0;
        }
      }
      // inverse
      if (toggles.inverse) {
        data[i] = 255 - data[i];
        data[i+1] = 255 - data[i+1];
        data[i+2] = 255 - data[i+2];
      }
      // white screen
      if (toggles.whiteScreen) {
        if (g > 200 && b > 200 && r > 200) {
          data[i+3] = 0;
        }
      }
    }
    idata.data = data;
    lastData = data;
    context.putImageData(idata, 0, 0);
  }
}

function update() {
  if (circles) circles.update();
}

function main() {
  draw();
  update();
  window.requestAnimationFrame(main)
}

window.requestAnimationFrame(main)


  // GET USER MEDIA
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  var constraints = {
    audio: false, 
    video: {
      mandatory: {
        minWidth: 1280,
        minHeight: 720
      }
    }
  };

function successCallback(stream) {
  window.stream = stream; // stream available to console
  if (window.URL) {
    webcam.src = window.URL.createObjectURL(stream);
  } else {
    webcam.src = stream;
  }
  webcam.play();
  document.getElementById('background').play();
}

function errorCallback(error){
  console.log("navigator.getUserMedia error: ", error);
}

navigator.getUserMedia(constraints, successCallback, errorCallback);


// get color
$(canvas).click(function(e) {  
  console.log('clicked canvas');
  var canvasOffset = $(canvas).offset();  
  var canvasX = Math.floor(e.pageX-canvasOffset.left);  
  var canvasY = Math.floor(e.pageY-canvasOffset.top);  

  var imageData = context.getImageData(0, 0, video.width, video.height);  
  var pixels = imageData.data;  
  var pixelRedIndex = ((canvasY - 1) * (imageData.width * 4)) + ((canvasX - 1) * 4);  
  var pixelcolor = "rgba("+pixels[pixelRedIndex]+", "+pixels[pixelRedIndex+1]+", "+pixels[pixelRedIndex+2]+", "+pixels[pixelRedIndex+3]+")";  

  $("body").css("backgroundColor", pixelcolor);  
}); 
