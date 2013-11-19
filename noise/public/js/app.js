var canvas, context, circle, original, best, bestContext;
var counter = 0;

var origData, bestData, imageData;

var origPercents = [];

window.onload = function() {
  canvas = document.getElementById('current');
  // have to explicitly set w/h in javascript;
  // css values won't be used.
  canvas.height = 374;
  canvas.width = 300;
  context = Context = canvas.getContext('2d');

  original = document.getElementById('original');
  original.width = 300;
  original.height = 374;

  best = document.getElementById('best');
  best.height = 374;
  best.width = 300;
  bestContext = best.getContext('2d');
  bestData = bestContext.getImageData(0, 0, original.width, original.height);

  var image = new Image();
  image.src = 'Mona_Lisa.jpg';
  image.height = 374;
  image.width = 300;
  image.onload = function() {
    var origContext = original.getContext('2d');
    origContext.drawImage(image, 0, 0);
    origData = origContext.getImageData(0, 0, original.width, original.height).data;
    for (i = 0; i < origData.length; i++) {
      origPercents.push(origData[i] / 255.0);
    }
  }
}

randomColor = function() {
  var s = 'rgba(';
  var i = 0;
  while (i < 3) {
    i++;
    s += randNumFromZeroTo(255) + ',';
  }
  s += 0.5;
  s += ')';
  return s;
}

randNumFromZeroTo = function randNumFromZeroTo(n) {
  return Math.floor(Math.random() * (n + 1));
}

function clearWindow() {
  canvas.width = canvas.width;
}

drawNoise = function drawNoise() {
  var numOfPixels = canvas.height * canvas.width;
  var imageData = context.createImageData(canvas.width, canvas.height);
  var newPixel = [];
  for (var i = 0; i < imageData.data.length; i += 4) {
    for (var j = 0; j < 3; j++) {
      newPixel.push(randNumFromZeroTo(255));
    }
     newPixel.push(255);

     // compare new pixel with old pixel
     // and store best match
     if (origPercents && origData) {
       // var newSimilarity = redPercent + greenPercent + bluePercent;
       var newPixelType = calculatePixel(newPixel);
       var bestPixelType = calculatePixel([bestData.data[i], bestData.data[i+1], bestData.data[i+2]]);
       var actualPixelType = calculatePixel([origData[i], origData[i+1], origData[i+2]]);
       var newPercentages = actualPixelType.reduce(function(prev, current, index) {
         return prev + Math.abs(current - newPixelType[index]);
       }, 0);
       var bestPercentages = actualPixelType.reduce(function(prev, current, index) {
         return prev + Math.abs(current - bestPixelType[index]);
       }, 0);

     } else { // first run
       bestData.data[i] = newPixel[0];
       bestData.data[i+1] = newPixel[1];
       bestData.data[i+2] = newPixel[2];
       bestData.data[i+3] = newPixel[3];
     }
     // if new pixel delta is smaller than best pixel data, use new
     if (Math.abs(newPercentages) < Math.abs(bestPercentages)) {
       if (counter < 10) {
         bestData.data[i] = newPixel[0];
       }
       if (counter > 10 && counter < 20) {
         bestData.data[i+1] = newPixel[1];
       }
       if (counter > 20 && counter < 30) {
         bestData.data[i+2] = newPixel[2];
       }
       bestData.data[i+3] = newPixel[3];
     }
     imageData.data[i] = newPixel[0];
     imageData.data[i+1] = newPixel[1];
     imageData.data[i+2] = newPixel[2];
     imageData.data[i+3] = newPixel[3];
     newPixel = [];
  }
  // for (var i = 0; i < imageData.data.length; i++) {
  //   data[i] = randNumFromZeroTo(255);
  // }
  bestContext.putImageData(bestData, 0, 0);
  context.putImageData(imageData, 0, 0);
  counter++;
  if (counter == 30) {
    counter = 0;
    console.log('red');
  } else if (counter == 10) {
    console.log('green');
  } else if (counter == 20) {
    console.log('blue');
  }
}

function calculatePixel(pixel) {
  var redPercent = pixel[0] / 255;
  var greenPercent = pixel[1] / 255;
  var bluePercent = pixel[2] / 255;
  return [redPercent, greenPercent, bluePercent];
}


function draw() {
  clearWindow();
  drawNoise();
}

function update() {
}

function main() {
  draw();
  update();
  window.requestAnimationFrame(main)
}

window.requestAnimationFrame(main)
