//動畫
window.addEventListener('DOMContentLoaded', () => {
  const fromSidebar = sessionStorage.getItem('fromSidebar');
  const transition = document.getElementById('page-transition');

  if (!transition) return;

  if (fromSidebar) {
    // 確保遮罩一開始是顯示的
    transition.classList.remove('hidden');

    // 下一個 frame 才淡出
    requestAnimationFrame(() => {
      transition.classList.add('hidden');
    });

    // 關鍵：立刻清除，避免回上一頁 softlock
    sessionStorage.removeItem('fromSidebar');
  } else {
    // 非 sidebar 進來的，直接隱藏
    transition.classList.add('hidden');
  }
});