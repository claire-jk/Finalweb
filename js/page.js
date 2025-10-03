document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  // 開關漢堡選單
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('show');
  });

  // 處理所有子選單展開
  document.querySelectorAll('.has-submenu > a').forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault(); // 阻止跳轉
      this.parentElement.classList.toggle('active');
    });
  });
});
