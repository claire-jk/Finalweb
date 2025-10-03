var SAKURA_COUNT = 30;
var IMAGE_URL = './image/leaf.png';

var canvas = document.getElementById('leaf');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var _ctx = canvas.getContext('2d');
var IMG_SIZE = 24;

var _img = new Image();
_img.src = IMAGE_URL;
_img.onload = play;

var _sakuras = [];
var windRoots = [];

function setup() {
  addSakura();
  canvas.addEventListener('mousemove', function(e) {
    windRoots.push({x: e.clientX, y: e.clientY, rest:0});
  });
}
setup();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function draw(){
  _ctx.clearRect(0, 0, canvas.width, canvas.height);

  var len = _sakuras.length;
  for (var i=0; i < len; ++i) {
    fall(_sakuras[i]);
  }
  drawSakuras();
}

function getKyori(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function getNearWindRoot(sakura) {
  var len = windRoots.length;
  var wind = null;
  var kyoriMin = 100;
  for (var i=0; i < len; ++i) {
    var w = windRoots[i];
    var kyori = getKyori(w.x, w.y, sakura.x, sakura.y);
    if (kyori < kyoriMin) {
      wind = w;
      kyoriMin = kyori;
    }
  }
  return wind;
}

function fall(sakura) {
  sakura.rotationX += sakura.rotationVx + Math.random() * 5;
  sakura.rotationY += sakura.rotationVy + Math.random() * 5;
  sakura.rotationZ += sakura.rotationVz + Math.random() * 5;

  var vx = sakura.vx + Math.abs(Math.sin(sakura.rotationZ * Math.PI / 180));
  var vy = sakura.vy + Math.abs(Math.cos(sakura.rotationX * Math.PI / 180));
  var vz = sakura.vz + Math.abs(Math.sin(sakura.rotationY * Math.PI / 180));

  var w = getNearWindRoot(sakura);
  if (w) {
    var kyori = getKyori(w.x, w.y, sakura.x, sakura.y);
    if (kyori <= 0) {
      vx += 3;
    } else {
      vx += (sakura.x - w.x) / kyori * 0.5;
      vy += (sakura.y - w.y) / kyori * 0.5;
    }
  }

  sakura.x += vx;
  sakura.y += vy;
  sakura.z -= vz;

  if(sakura.x > canvas.width) sakura.x = 0;
  if(sakura.y > canvas.height) sakura.y = -100;
  if(sakura.z < 0) sakura.z = 500;

  var scale = 1 / Math.max(sakura.z / 200, 0.001);
  sakura.scaleX = sakura.scaleY = scale;
}

function drawSakuras() {
  var len = _sakuras.length;
  for (var i=0; i < len; ++i) {
    var s = _sakuras[i];
    var dispX = (s.x - 250) / Math.max(s.z / 200, 0.001) * 2 + canvas.width / 2;
    var dispY = (s.y - 250) / Math.max(s.z / 200, 0.001) * 2 + canvas.height / 3;

    _ctx.translate(dispX, dispY);
    _ctx.scale(s.scaleX, s.scaleY);
    _ctx.rotate(s.rotationZ * Math.PI / 180);
    _ctx.transform(1, 0, 0, Math.sin(s.rotationX * Math.PI / 180), 0, 0);
    _ctx.translate(-dispX, -dispY);

    _ctx.globalAlpha = Math.min(1, (500 - s.z) / 50);
    _ctx.drawImage(_img, dispX - IMG_SIZE / 2, dispY - IMG_SIZE / 2, IMG_SIZE, IMG_SIZE);
    _ctx.globalAlpha = 1;

    _ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

function addSakura() {
  for (var i=0; i < SAKURA_COUNT; ++i) {
    var sakura = {};
    sakura.scaleX = sakura.scaleY = Math.random() * 1.2 + 0.3;
    sakura.rotationX = Math.random() * 360;
    sakura.rotationY = Math.random() * 360;
    sakura.rotationZ = Math.random() * 360;
    sakura.x = Math.random() * canvas.width;
    sakura.y = Math.random() * canvas.height - canvas.height;
    sakura.z = Math.random() * 500;

    sakura.vx = 0.3 + 0.2 * Math.random();
    sakura.vy = 0.5 * Math.random();
    sakura.vz = 0.3 + 0.2 * Math.random();

    sakura.rotationVx = 7 - 10 * Math.random();
    sakura.rotationVy = 7 - 10 * Math.random();
    sakura.rotationVz = 7 - 10 * Math.random();

    _sakuras.push(sakura);
  }
}

function play(){
  setInterval(draw, 1000 / 60); // 60 FPS
}