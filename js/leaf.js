// === 基本設定 ===
const SAKURA_COUNT = 100; // 葉子數量
const IMAGE_URL = "./image/leaf.png"; // 葉子圖片路徑
const IMG_SIZE = 24;

// ✅ 先建立圖片物件
const img = new Image();
img.src = IMAGE_URL;

const canvas = document.getElementById("leaf");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// === 全域變數 ===
let leaves = [];
let windRoots = [];

// === 初始化 ===
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

canvas.addEventListener("mousemove", (e) => {
  windRoots.push({ x: e.clientX, y: e.clientY, life: 60 });
});

// === 建立葉子資料 ===
function addLeaves() {
  for (let i = 0; i < SAKURA_COUNT; i++) {
    leaves.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      z: Math.random() * 500,
      vx: 0.3 + Math.random() * 0.3,
      vy: 0.5 + Math.random() * 0.3,
      vz: 0.3 + Math.random() * 0.2,
      rotationX: Math.random() * 360,
      rotationY: Math.random() * 360,
      rotationZ: Math.random() * 360,
      rotationVx: 5 - 10 * Math.random(),
      rotationVy: 5 - 10 * Math.random(),
      rotationVz: 5 - 10 * Math.random(),
      scaleX: 1,
      scaleY: 1,
    });
  }
}

// === 計算距離 ===
function getDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// === 找最近的風源 ===
function getNearestWind(leaf) {
  let nearest = null;
  let minDist = 150;
  for (let w of windRoots) {
    const dist = getDistance(leaf.x, leaf.y, w.x, w.y);
    if (dist < minDist) {
      nearest = w;
      minDist = dist;
    }
  }
  return nearest;
}

// === 葉子下落邏輯 ===
function fall(leaf) {
  leaf.rotationX += leaf.rotationVx * 0.1;
  leaf.rotationY += leaf.rotationVy * 0.1;
  leaf.rotationZ += leaf.rotationVz * 0.1;

  // 🔹 調整速度倍率（例如加快 2 倍）
  const SPEED_MULTIPLIER = 2.0;

  let vx = leaf.vx + Math.sin(leaf.rotationZ * Math.PI / 180) * 0.5;
  let vy = leaf.vy + Math.cos(leaf.rotationX * Math.PI / 180) * 0.5;
  let vz = leaf.vz + Math.sin(leaf.rotationY * Math.PI / 180) * 0.2;

  const wind = getNearestWind(leaf);
  if (wind) {
    const dist = getDistance(leaf.x, leaf.y, wind.x, wind.y);
    vx += (wind.x - leaf.x) / dist * 0.2;
    vy += (wind.y - leaf.y) / dist * 0.2;
  }

  leaf.x += vx;
  leaf.y += vy;
  leaf.z -= vz;

  if (leaf.x > canvas.width + 50) leaf.x = -50;
  if (leaf.y > canvas.height + 50) leaf.y = -100;
  if (leaf.z < 0) leaf.z = 500;

  const scale = 1 / Math.max(leaf.z / 200, 0.5);
  leaf.scaleX = leaf.scaleY = scale;
}

// === 繪製葉子 ===
function drawLeaves() {
  for (let s of leaves) {
    const dispX = (s.x - 250) / Math.max(s.z / 200, 0.001) * 2 + canvas.width / 2;
    const dispY = (s.y - 250) / Math.max(s.z / 200, 0.001) * 2 + canvas.height / 3;

    ctx.save();
    ctx.translate(dispX, dispY);
    ctx.scale(s.scaleX, s.scaleY);
    ctx.rotate(s.rotationZ * Math.PI / 180);
    ctx.transform(1, 0, 0, Math.sin(s.rotationX * Math.PI / 180), 0, 0);
    ctx.globalAlpha = Math.min(1, (500 - s.z) / 50);

    ctx.drawImage(img, -IMG_SIZE / 2, -IMG_SIZE / 2, IMG_SIZE, IMG_SIZE);
    ctx.restore();
  }
}

// === 主繪圖迴圈 ===
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 更新滑鼠風向的壽命
  windRoots = windRoots.filter((w) => --w.life > 0);

  for (let leaf of leaves) fall(leaf);
  drawLeaves();

  requestAnimationFrame(draw);
}

// === 啟動動畫 ===
img.onload = function () {
  addLeaves();
  draw();
};