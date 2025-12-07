//song playlist
// 取得元素
const record = document.getElementById("record");
const youtubeFrame = document.getElementById("youtube-frame");
const songCircles = document.querySelectorAll(".song-circle");
const musicPlayer = document.getElementById("music-player");

// 記錄目前播放的影片
let currentVideo = "";

// 判斷裝置大小，自動選擇背景圖
function getResponsiveBg(bgDesktop, bgMobile) {
  return window.innerWidth <= 768 ? bgMobile : bgDesktop;
}

// 點擊每個歌曲圓圈
songCircles.forEach(circle => {
  circle.addEventListener("click", () => {
    const videoUrl = circle.getAttribute("data-video");
    const bgDesktop = circle.getAttribute("data-bg-desktop");
    const bgMobile = circle.getAttribute("data-bg-mobile");

    // 如果再次點擊同一首歌 → 停止旋轉 & 暫停影片
    if (currentVideo === videoUrl && record.classList.contains("playing")) {
      record.classList.remove("playing");
      youtubeFrame.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}', '*'
      );
      return;
    }

    // 點擊新歌曲時，先停止上一首旋轉
    record.classList.remove("playing");

    // 更新背景圖
    const bgImage = getResponsiveBg(bgDesktop, bgMobile);
    if (bgImage) {
      musicPlayer.style.backgroundImage = `url('${bgImage}')`;
    }

    // 更新目前播放影片
    currentVideo = videoUrl;
    youtubeFrame.src = videoUrl + "&enablejsapi=1";

    // 重新啟動旋轉動畫
    void record.offsetWidth;
    record.classList.add("playing");
  });
});

// 縮放視窗自動切換背景圖
window.addEventListener("resize", () => {
  if (!currentVideo) return;
  const activeCircle = Array.from(songCircles).find(c => c.getAttribute("data-video") === currentVideo);
  if (activeCircle) {
    const bgDesktop = activeCircle.getAttribute("data-bg-desktop");
    const bgMobile = activeCircle.getAttribute("data-bg-mobile");
    musicPlayer.style.backgroundImage = `url('${getResponsiveBg(bgDesktop, bgMobile)}')`;
  }
});