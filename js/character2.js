// 只切換圖片，不動簡介
const portraits = [
  { src: 'imagecharacter/立夏.png' },
  { src: 'imagecharacter/立夏10th.png' }
];

let current = 0;

const portraitEl = document.getElementById('portrait');
const changeBtn = document.getElementById('changeBtn');

// 切換圖片
function updateCharacter(index){
  const item = portraits[index % portraits.length];

  // 確保圖片過渡效果
  portraitEl.style.opacity = 0;
  portraitEl.style.transform = 'scale(0.98)';

  setTimeout(() => {
    portraitEl.src = item.src;
    portraitEl.style.opacity = 1;
    portraitEl.style.transform = 'scale(1)';
  }, 220);
}

// 點擊按鈕切換圖片
changeBtn.addEventListener('click', () => {
  current = (current + 1) % portraits.length;
  updateCharacter(current);
});

// 左右方向鍵支援
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    current = (current - 1 + portraits.length) % portraits.length;
    updateCharacter(current);
  } else if (e.key === 'ArrowRight') {
    current = (current + 1) % portraits.length;
    updateCharacter(current);
  }
});

// 初始載入
document.addEventListener('DOMContentLoaded', () => {
  updateCharacter(current);
});