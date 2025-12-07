// 書本翻轉控制
document.querySelectorAll('.book').forEach(book => {
    book.addEventListener('click', () => {
        const clickedInner = book.querySelector('.book-inner');
        document.querySelectorAll('.book-inner').forEach(inner => {
          if (inner !== clickedInner) inner.classList.remove('is-flipped');
        });
        clickedInner.classList.toggle('is-flipped');
    });
});

// 書本滑入動畫
window.addEventListener('load', () => {
    const books = document.querySelectorAll('.book');
    books.forEach((book, index) => {
        setTimeout(() => {
          book.classList.add('show');
        }, index * 150); // 依序出現
    });
});