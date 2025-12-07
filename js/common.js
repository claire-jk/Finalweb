//只撥放一次loading動畫
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("a[href]").forEach(link => {
    const href = link.getAttribute("href");

    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("javascript:")) return;
    if (link.target === "_blank") return;
    if (link.hostname !== location.hostname) return;

    link.addEventListener("click", e => {
      e.preventDefault();

      //告訴下一頁不要再播一次loading
      sessionStorage.setItem("skipNextLoader", "true");

      const loader = document.getElementById("loader");
      if (loader) {
        loader.classList.remove("fade-out");
        loader.style.display = "flex";
      }

      const delay = 2500;
      setTimeout(() => {
        window.location.href = href;
      }, delay);
    });
  });
});

//是否跳過loading動畫
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const skip = sessionStorage.getItem("skipNextLoader") === "true";

  if (loader && skip) {
    loader.style.display = "none";
    sessionStorage.removeItem("skipNextLoader");
  }
});