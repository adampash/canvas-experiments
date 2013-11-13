var canvas, context, circle;

window.onload = function() {
  canvas = document.getElementById('animation');
  canvas.height = $(window).height();
  canvas.width = $(window).width();
  context = Context = canvas.getContext('2d');
  birds = new Birds(1);
}

$(window).resize(function() {
  console.log('resize');
  canvas.height = $(window).height();
  canvas.width = $(window).width();
});

function Bird() {
  this.position = {
    x: randNumFromZeroTo(canvas.width),
    y: randNumFromZeroTo(canvas.height)
  };
  this.direction = {
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1
  }
  this.size = 10;
}

Bird.prototype.draw = function() {

  context.fillStyle = 'black';
  context.fillRect(this.position.x, this.position.y, 20,  3);

  context.fillStyle = 'black';
  context.globalAlpha = 1.0;
  context.beginPath();
  context.moveTo(this.position.x + 5, this.position.y - 5);
  context.lineTo(this.position.x - -5, this.position.y - -5);
  context.lineTo(this.position.x - 5, this.position.y - -5);
  context.closePath();
  context.fill();
}

Bird.prototype.update = function() {
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


      function clearWindow() {
        canvas.width = canvas.width;
      }

      function Birds(n) {
        this.birds = [];
        for (i = 0; i < n; i++) {
          this.birds.push(new Bird());
        }
      }

Birds.prototype.draw = function() {
  this.birds.forEach(function(bird) {
    bird.draw();
  });
}

Birds.prototype.update = function() {
  this.birds.forEach(function(bird) {
    bird.update();
  });
}

function draw() {
  clearWindow();
  birds.draw();
}

function update() {
  birds.update();
}

function main() {
  draw();
  update();
  window.requestAnimationFrame(main)
}

window.requestAnimationFrame(main)
