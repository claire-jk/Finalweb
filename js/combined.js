//Intro淡出動畫
window.addEventListener('load', () => {
  setTimeout(() => {
    const intro = document.getElementById('intro');
    intro.classList.add('fade-out');

    setTimeout(() => {
      intro.style.display = 'none';
      document.body.style.overflow = 'auto';
    }, 1000);
  }, 6000);
});

//漢堡選單
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('show');
});

//子選單切換
document.querySelectorAll('.submenu-toggle').forEach(toggle => {
  toggle.addEventListener('click', function (e) {
    e.preventDefault();
    const parentLi = this.parentElement;
    const submenu = this.nextElementSibling;

    if (submenu.style.display === 'block') {
      submenu.style.maxHeight = '0';
      submenu.style.display = 'none';
      parentLi.classList.remove('active');
    } else {
      submenu.style.display = 'block';
      submenu.style.maxHeight = submenu.scrollHeight + 'px';
      parentLi.classList.add('active');
    }
  });
});

//滾輪頁面切換（平滑滾動到下一區）
let isScrolling = false;
window.addEventListener('wheel', e => {
  if (isScrolling) return;
  isScrolling = true;

  const sections = [...document.querySelectorAll('.page')];
  const current = sections.findIndex(s => {
    const rect = s.getBoundingClientRect();
    return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
  });

  if (e.deltaY > 0 && current < sections.length - 1) {
    sections[current + 1].scrollIntoView({ behavior: 'smooth' });
  } else if (e.deltaY < 0 && current > 0) {
    sections[current - 1].scrollIntoView({ behavior: 'smooth' });
  }

  setTimeout(() => (isScrolling = false), 1000);
});

window.addEventListener('load', () => {
  // 如果網址中有 #section2 或其他錨點
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      // 稍微延遲確保畫面載入完成再平滑滾動
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    }
  }
});
