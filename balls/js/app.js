var canvas, context, circle;

window.onload = function() {
  canvas = document.getElementById('animation');
  canvas.height = $(window).height();
  canvas.width = $(window).width();
  context = Context = canvas.getContext('2d');
  circles = new Circles(500);
}

$(window).resize(function() {
  console.log('resize');
  canvas.height = $(window).height();
  canvas.width = $(window).width();
});

function Circle() {
  this.down = Math.floor(Math.random() * 2);
  this.right = Math.floor(Math.random() * 2);
  this.position = {
    x: randNumFromZeroTo(canvas.width),
    y: randNumFromZeroTo(canvas.height)
  };
  this.size = randNumFromZeroTo(45) + 5;
  this.color = randomColor();
  this.age = 0;
  this.direction = {
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1
  }
}

randomColor = function() {
  var s = 'rgba(';
  var i = 0;
  while (i < 3) {
    i++;
    s += randNumFromZeroTo(255) + ',';
  }
  s += Math.random() * 1;
  s += ')';
  return s;
}

randNumFromZeroTo = function randNumFromZeroTo(n) {
  return Math.floor(Math.random() * (n + 1));
}

Circle.prototype.draw = function() {
  context.beginPath();
  context.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI, false);
  context.fillStyle = this.color;
  context.fill();
}

Circle.prototype.update = function() {
  if (this.position.x + this.size > canvas.width)
    this.right = 0;
  else if (this.position.x - this.size < 0)
    this.right = 1;
  if (this.position.y + this.size > canvas.height)
    this.down = 0;
  else if (this.position.y - this.size < 0)
    this.down = 1;
  if (this.right)
    this.position.x = this.position.x + this.direction.x + this.age * 0.00005;
  else
    this.position.x = this.position.x - this.direction.x - this.age * 0.00005;
  if (this.down) {
    this.position.y = this.position.y + this.direction.y + this.age * 0.00005;
  } else {
    this.position.y = this.position.y - this.direction.y - this.age * 0.00005;
  }
  this.age++;
}

function clearWindow() {
  canvas.width = canvas.width;
}

function Circles(n) {
  this.circles = [];
  for (i = 0; i < n; i++) {
    this.circles.push(new Circle());
  }
}

Circles.prototype.draw = function() {
  this.circles.forEach(function(circle) {
    circle.draw();
  });
}

Circles.prototype.update = function() {
  this.circles.forEach(function(circle) {
    circle.update();
  });
}

function draw() {
  clearWindow();
  circles.draw();
}

function update() {
  circles.update();
}

function main() {
  draw();
  update();
  window.requestAnimationFrame(main)
}

window.requestAnimationFrame(main)
