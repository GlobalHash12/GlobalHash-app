const tg = window.Telegram.WebApp;
tg.expand();

// 1. መጽሐፍትህን እዚህ ጋር መመዝገብ ትችላለህ
const books = [
    { id: 1, title: "ዶክተር ዶርም (Dr. Dorm)", cover: "cover1.jpg" },
    { id: 2, title: "ስውር ስፌት (Hidden Stitch)", cover: "cover2.jpg" },
    { id: 3, title: "የአስፋልቱ ልዑል", cover: "cover3.jpg" },
    // ስምንቱንም እዚህ ጋር ጨምር...
];

const AdController = window.Adsgram.init({ blockId: "23804" });

// Load Library
const bookList = document.getElementById('book-list');
books.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
        <img src="${book.cover}" alt="${book.title}">
        <h3>${book.title}</h3>
    `;
    card.onclick = () => openBook(book);
    bookList.appendChild(card);
});

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function openBook(book) {
    document.getElementById('reading-title').innerText = book.title;
    const chapterList = document.getElementById('chapter-list');
    chapterList.innerHTML = '';
    
    // ምሳሌ፡ 5 ምዕራፎችን መፍጠር
    for(let i=1; i<=25; i++) {
        const btn = document.createElement('div');
        btn.className = 'chapter-btn' + (i > 3 ? ' locked' : '');
        btn.innerHTML = `<span>Chapter ${i}</span> ${i > 3 ? '🔒' : '🔓'}`;
        btn.onclick = () => openChapter(i);
        chapterList.appendChild(btn);
    }
    showPage('reader-section');
}

async function openChapter(num) {
    if (num > 3) {
        // ከ 3ኛው ምዕራፍ በላይ ለማንበብ ማስታወቂያ መታየት አለበት
        tg.showConfirm("To read this chapter, watch a short video.", async (ok) => {
            if (ok) {
                try {
                    await AdController.show();
                    tg.showAlert("Chapter Unlocked! Happy reading.");
                    displayContent(num);
                } catch (e) {
                    tg.showAlert("Ad failed to load. Try again later.");
                }
            }
        });
    } else {
        displayContent(num);
    }
}

function displayContent(num) {
    document.getElementById('chapter-list').classList.add('hidden');
    const content = document.getElementById('content-display');
    content.classList.remove('hidden');
    content.innerText = `Chapter ${num} content goes here...\n\nYour novel text will be loaded from your files.`;
}
