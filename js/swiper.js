// 章節資料
const stories = {
  1: {
    slides: [
      'imageanimation/animationtv1.jpg',
      'imageanimation/animationtv2.jpg',
      'imageanimation/animationtv3.jpg',
      'imageanimation/animationtv4.jpg',
      'imageanimation/animationtv5.jpg',
      'imageanimation/animationtv6.jpg'
    ],
    text: '為Given作品的開頭。以Tv版呈現，總共11集，講述立夏與真冬的相遇，以及講述真冬在遇見立夏前所經歷的事。'
  },
  2: {
    slides: [
      'imageanimation/movie11.jpg',
      'imageanimation/movie12.jpg',
      'imageanimation/movie13.jpg',
      'imageanimation/movie14.jpg',
      'imageanimation/movie15.jpg',
      'imageanimation/movie16.jpg'
    ],
    text: 'Given的第一部劇場版，講述春秋雨三人的虐戀故事。'
  },
  3: {
    slides: [
      'imageanimation/movie21.jpg',
      'imageanimation/movie22.jpg',
      'imageanimation/movie23.jpg',
      'imageanimation/movie24.jpg',
      'imageanimation/movie25.jpg',
      'imageanimation/movie26.jpg'
    ],
    text: 'Given的劇場版，類似ova形式。時間線與第一部相同，只不過第一部劇場版聚焦在春秋雨，而ova聚焦在夏冬兩人。主要描述夏冬交往後的日常。'
  },
  4: {
    slides: [
      'imageanimation/movie31.jpg',
      'imageanimation/movie32.jpg',
      'imageanimation/movie33.jpg',
      'imageanimation/movie34.jpg',
      'imageanimation/movie35.jpg',
      'imageanimation/movie36.jpg'
    ],
    text: 'Given的第三部劇場版，主要講述配角柊與玄純的戀愛故事。算是下一部劇場版--去海邊的前篇。'
  },
  5: {
    slides: [
      'imageanimation/movie41.jpg',
      'imageanimation/movie42.jpg',
      'imageanimation/movie43.jpg',
      'imageanimation/movie44.jpg',
      'imageanimation/movie45.jpg',
      'imageanimation/movie46.jpg'
    ],
    text: 'Given的最後一部劇場版，講述柊、玄純跟立夏合作將由紀留下的曲子寫完送給真冬。聽完前男友寫給自己的歌後真冬終於放下昔日的陰影，決定終身懷抱音樂。'
  }
};

// 初始化 Swiper
let swiper = new Swiper('.swiper-container', {
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  }
});

// 更新章節
function updateStory(id) {
  const story = stories[id];

  // 更新 slide
  swiper.removeAllSlides();
  story.slides.forEach(url => {
    swiper.appendSlide(`<div class="swiper-slide"><img src="${url}" alt="slide"></div>`);
  });
  swiper.update(); // 更新 Swiper

  // 更新文字
  document.querySelector('.story-text p').textContent = story.text;

  // 更新 tab 樣式
  document.querySelectorAll('.tab-item').forEach(tab => {
    tab.classList.toggle('is-current', tab.dataset.id === id);
  });
}

// 預設第一章
updateStory('1');

// Tab 點擊事件
document.querySelectorAll('.tab-item').forEach(tab => {
  tab.addEventListener('click', () => {
    updateStory(tab.dataset.id);
  });
});