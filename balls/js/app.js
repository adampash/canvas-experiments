var canvas, context, circle;

window.onload = function() {
  canvas = document.getElementById('animation');
  canvas.height = $(window).height();
  canvas.width = $(window).width();
  context = Context = canvas.getContext('2d');
  circles = new Circles(100);
}

$(window).resize(function() {
  console.log('resize');
  canvas.height = $(window).height();
  canvas.width = $(window).width();
});

function clearWindow() {
  canvas.width = canvas.width;
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
