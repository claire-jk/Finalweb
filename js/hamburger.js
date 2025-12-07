//漢堡選單
const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('show');
    });

    // 子選單切換
    document.querySelectorAll('.submenu-toggle').forEach(toggle => {
      toggle.addEventListener('click', function(e) {
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