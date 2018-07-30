var drawingDiv = document.querySelector('#drawing');

var draw = SVG('drawing').size(900, 1200)
// var rect = draw.rect((160*4), 90*4).attr({ fill: '#f06' }).move(100, 100).radius(10)

var circle = draw.circle(50).attr({fill: 'rgba(0,40,50,0.8)'}).move(500, 200)

var letters = draw.group();
var lOne = letters.path('M100 100 H250 V550 H450 V700 H100 z');
var lTwo = letters.path('M100 100 H250 V550 H450 V700 H100 z').move(480, 100);

letters.fill('none');
letters.stroke({ color: '#000', width: 2, linecap: 'round', linejoin: 'round' });

var aLOne = SVG.get(lOne);
var aLTwo = SVG.get(lTwo);

var aCircle = SVG.get(circle)

// var duration = anime({
//   targets: '#duration .el',
//   translateX: 250,
//   duration: 3000,
//   loop: 5
// });

var path = anime.path(aLOne);

var easings = ['linear', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic'];

var motionPath = anime({
  targets: '.blue',
  translateX: path('x'),
  translateY: path('y'),
  rotate: path('angle'),
  easing: function (el, i) {
    return easings[i];
  },
  duration: 10000,
  loop: true
});
