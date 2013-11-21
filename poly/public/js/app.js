var canvas, context, circle, original, best, bestContext;

var iterations = 0;
var improvements = 0;
var num_iter, num_imp;

var evolve = false;
var goodPoly;

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

  num_iter = document.getElementById('num_iter');
  num_imp = document.getElementById('num_imp');
  time = document.getElementById('time');

  var start = document.getElementById('start');
  start.onclick = function() {
    main();
    return false;
  }

  var gum = document.getElementById('gum');
  gum.onclick = function() {
    getUserMedia({video: true}, gotVideo);
  }

  // var evo = document.getElementById('evo');
  // evo.onclick = function() {
  //   evolve = !evolve;
  // }

  var image = new Image();
  image.src = 'Mona_Lisa.jpg';
  // image.src = 'chrome.jpg';
  image.height = 374;
  image.width = 300;
  image.onload = function() {
    var origContext = original.getContext('2d');
    origContext.drawImage(image, 0, 0);
    setOrig(origContext);
  }
}

function setOrig(context) {
  origData = context.getImageData(0, 0, original.width, original.height).data;
  for (i = 0; i < origData.length; i++) {
    origPercents.push(origData[i] / 255.0);
  }
}

var mediastream;
function gotVideo(media) {
  mediastream = media;
  var video = document.getElementById('video');
  attachMediaStream(video, mediastream);
  setTimeout(function() {
    var origContext = original.getContext('2d');
    origContext.drawImage(video, -200, -50)
    setOrig(origContext);
    mediastream.stop();
  }, 500);
}

randomColor = function() {
  var s = 'rgba(';
  var i = 0;
  while (i < 3) {
    i++;
    s += randNumFromZeroTo(255) + ',';
  }
  s += 0.3;
  s += ')';
  return s;
}

randNumFromZeroTo = function randNumFromZeroTo(n) {
  return Math.floor(Math.random() * (n + 1));
}

function clearWindow() {
  canvas.width = canvas.width;
}

drawPoly = function drawPoly() {
  var numOfPixels = canvas.height * canvas.width;
  var imageData = context.createImageData(canvas.width, canvas.height);
  context.putImageData(bestData, 0, 0);
  var poly;
  if (goodPoly && evolve) {
    goodPoly.mutate();
    poly = goodPoly;
  } else {
    poly = new RandomPoly(6);
  }
  poly.draw();
  checkImprovements(poly);
}

function checkImprovements(figure) {
  iterations++;
  if (newPolyBetter()) {
    var newBest = context.getImageData(0, 0, original.width, original.height);
    bestContext.putImageData(newBest, 0, 0);
    bestData = newBest;
    goodPoly = figure;
  } else {
    goodPoly = undefined;
  }
}

function getPixelArray(array, startIndex) {
  return [array[startIndex], array[startIndex+1], array[startIndex+2], array[startIndex+3]];
}

var bestDelta;

// MOSHE: This is the code that requires the most churn.
// I'm realizing that it's probably not even necessary to do this
// per-pixel (see the i+=4 for loop) — pretty sure you should be able
// to do this one value at a time and get the same outcome.
function newPolyBetter() {
  var newImage = context.getImageData(0, 0, canvas.width, canvas.height);
  var newImageData = newImage.data;
  if (origPercents && origData) {
    var newDelta = 0;
    for (var i = 0; i < newImageData.length; i++) {
      newDelta += Math.abs(newImageData[i] - origData[i]);
    }
    if (!bestDelta) {
      bestDelta = newDelta;
    }
    if (newDelta <= bestDelta) {
      bestDelta = newDelta;
      improvements++;
      return true;
    } else {
      return false;
    }
  }
}

function RandomCircle(n) {
  this.coords = [];
  for (var i = 0; i < n; i++) {
    this.coords.push([randNumFromZeroTo(canvas.width), randNumFromZeroTo(canvas.height)]);
  }
}

RandomCircle.prototype.draw = function() {
  context.fillStyle = randomColor();
  context.beginPath();
  context.moveTo(this.coords[0][0], this.coords[0][1]);
  for (var i = 1; i < this.coords.length; i++) {
    context.lineTo(this.coords[i][0], this.coords[i][1]);
  }
  context.closePath();
  context.fill();
}

function RandomPoly(n) {
  this.coords = [];
  for (var i = 0; i < n; i++) {
    this.coords.push([randNumFromZeroTo(canvas.width), randNumFromZeroTo(canvas.height)]);
  }
}

RandomPoly.prototype.draw = function() {
  context.fillStyle = randomColor();
  context.beginPath();
  context.moveTo(this.coords[0][0], this.coords[0][1]);
  for (var i = 1; i < this.coords.length; i++) {
    context.lineTo(this.coords[i][0], this.coords[i][1]);
  }
  context.closePath();
  context.fill();
}

RandomPoly.prototype.mutate = function() {
  console.log('mutuate');
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

function updateStats() {
  num_iter.innerHTML = iterations;
  num_imp.innerHTML = improvements;
}


function draw() {
  clearWindow();
  drawPoly();
  updateStats();
}

function update() {
}

function main() {
  draw();
  update();
  window.requestAnimationFrame(main)
}
