//當頁面完全載入後，播放拍立得掉落動畫，然後淡出
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  //3.5秒後淡出
  setTimeout(() => {
    loader.classList.add("fade-out");
  }, 3500);
});

// 點擊連結時：重播掉落動畫再跳頁
document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", e => {
    const href = link.getAttribute("href");
    if (href && !href.includes("#")) {
      e.preventDefault();
      const loader = document.getElementById("loader");
      loader.classList.remove("fade-out");
      loader.style.opacity = 1;

      document.querySelectorAll(".polaroid").forEach(el => {
        el.style.animation = "none";
        void el.offsetWidth;
        el.style.animation = "";
      });

      setTimeout(() => {
        window.location.href = href;
      }, 2500);
    }
  });
});