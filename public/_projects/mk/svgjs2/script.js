var draw = SVG('drawing').size(900, 1200);
var drawing = SVG.adopt("motion-path")

var circle = draw.circle(50).attr({fill: 'rgba(0,40,50,0.8)'}).move(500, 200);

var path = anime.path('#motionPath path');

var motionPath = anime({
  targets: '#motionPath .el',
  translateX: path('x'),
  translateY: path('y'),
  rotate: path('angle'),
  easing: 'linear',
  duration: 2000,
  loop: true
});
