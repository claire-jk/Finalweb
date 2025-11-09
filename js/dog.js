// script.js
// 小狗自動走路、碰邊反彈、點擊或觸控可跳躍
(() => {
  const dog = document.querySelector('.dog-sprite');

  // === 可調整參數 ===
  const SPEED_PX_PER_SEC = 140;   // 水平速度（像素/秒）
  const JUMP_VELOCITY = -700;     // 跳躍初速度（負值代表往上）
  const GRAVITY = 2600;           // 重力加速度（像素/秒²）
  const STAGE_MARGIN = 6;         // 左右邊距，避免緊貼邊界

  // === 動態狀態 ===
  let dir = 1;         // 1 = 向右，-1 = 向左
  let x = 60;          // 當前水平位置(px)
  let y = 0;           // 當前垂直位移(px)，0=地面
  let vy = 0;          // 垂直速度(px/s)
  let jumping = false; // 是否正在跳
  let lastTime = performance.now();

  // 取得邊界
  function getBounds() {
    const w = dog.offsetWidth;
    const left = STAGE_MARGIN;
    const right = window.innerWidth - w - STAGE_MARGIN;
    return { left, right };
  }

  // 更新 transform（位置＋方向）
  function updateTransform() {
    dog.style.transform = `translateX(${x}px) translateY(${-y}px) scaleX(${dir})`;
  }

  // === 主迴圈 ===
  function loop(now) {
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    // 水平移動
    x += dir * SPEED_PX_PER_SEC * dt;
    const { left, right } = getBounds();

    // 碰邊反彈
    if (x <= left) {
      x = left;
      dir = 1;
    } else if (x >= right) {
      x = right;
      dir = -1;
    }

    // 垂直運動（重力作用）
    if (jumping || vy !== 0) {
      vy += GRAVITY * dt;
      y += vy * dt;

      // 落地
      if (y <= 0) {
        y = 0;
        vy = 0;
        jumping = false;
        dog.classList.remove('jump'); // 移除跳躍動畫 class
      }
    }

    updateTransform();
    requestAnimationFrame(loop);
  }

  // === 跳躍觸發 ===
  function doJump() {
    if (!jumping) {
      jumping = true;
      vy = JUMP_VELOCITY;
      dog.classList.add('jump'); // 加入跳躍動畫 class（配合 CSS）
    }
  }

  // === 點擊或觸控事件 ===
  function onPointer(e) {
    const tag = (e.target?.tagName || '').toLowerCase();
    if (['input','textarea','button','a','select'].includes(tag)) return;
    doJump();
  }

  // === 視窗縮放調整 ===
  function onResize() {
    const { left, right } = getBounds();
    if (x < left) x = left;
    if (x > right) x = right;
  }

  // === 初始化 ===
  updateTransform();
  window.addEventListener('click', onPointer);
  window.addEventListener('touchstart', onPointer, { passive: true });
  window.addEventListener('resize', onResize);

  // 啟動動畫
  requestAnimationFrame(loop);
})();