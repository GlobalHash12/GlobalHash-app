const tg = window.Telegram.WebApp;
tg.expand();

const AdController = window.Adsgram.init({ blockId: "23804" });

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0,0);
}

function selectLang(id, name) {
    document.getElementById('selected-lang-title').innerText = name + " Novels";
    loadLibrary();
    showPage('library-section');
}

function loadLibrary() {
    const list = document.getElementById('book-list');
    list.innerHTML = '';
    const myBooks = [
        { id: 1, title: "ዶክተር ዶርም (Dr. Dorm)", cover: "cover1.jpg" },
        { id: 2, title: "ስውር ስፌት (Hidden Stitch)", cover: "cover2.jpg" },
        { id: 3, title: "የአስፋልቱ ልዑል", cover: "cover3.jpg" }
    ];
    myBooks.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `<img src="${book.cover}"><h3>${book.title}</h3>`;
        card.onclick = () => openBook(book);
        list.appendChild(card);
    });
}

function openBook(book) {
    document.getElementById('reading-title').innerText = book.title;
    const list = document.getElementById('chapter-list');
    list.innerHTML = '';
    for(let i=1; i<=10; i++) {
        const btn = document.createElement('div');
        btn.className = 'chapter-btn';
        btn.innerHTML = `<span>Chapter ${i}</span> ${i > 3 ? '🔒' : '🔓'}`;
        btn.onclick = () => openChapter(i);
        list.appendChild(btn);
    }
    document.getElementById('content-display').classList.add('hidden');
    list.classList.remove('hidden');
    showPage('reader-section');
}

async function openChapter(num) {
    if (num > 3) {
        try {
            await AdController.show();
            displayContent(num);
        } catch (e) {
            tg.showAlert("Ad loading... please wait.");
            displayContent(num);
        }
    } else {
        displayContent(num);
    }
}

function displayContent(num) {
    document.getElementById('chapter-list').classList.add('hidden');
    const display = document.getElementById('content-display');
    display.classList.remove('hidden');
    display.innerText = `Chapter ${num} Content...\n\nYour translated novel text will appear here.`;
}
