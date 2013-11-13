var canvas, context, circle;

window.onload = function() {
  canvas = document.getElementById('animation');
  canvas.height = $(window).height();
  canvas.width = $(window).width();
  context = Context = canvas.getContext('2d');
  circle = new Circle();
}

function Circle() {
  this.size = randNumFromZeroTo(45) + 80;
  this.position = {
    x: randNumFromZeroTo(canvas.width),
    y: 0 - this.size
  };
  this.color = randomColor();
}

Circle.prototype.draw = function() {
  context.beginPath();
  context.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI, false);
  context.fillStyle = this.color;
  context.fill();
}

Circle.prototype.update = function() {
  this.position.y += 2;
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
  for (var i = 0; i < imageData.data.length; i += 4) {
    for (var j = 0; j < 3; j++) {
      imageData.data[i + j] = randNumFromZeroTo(255);
    }
    imageData.data[i + 3] = 1000;
  }
  // for (var i = 0; i < imageData.data.length; i++) {
  //   data[i] = randNumFromZeroTo(255);
  // }
  context.putImageData(imageData, 0, 0);
}


function draw() {
  clearWindow();
  drawNoise();
  circle.draw();
}

function update() {
  circle.update();
}

function main() {
  draw();
  update();
  window.requestAnimationFrame(main)
}

window.requestAnimationFrame(main)
