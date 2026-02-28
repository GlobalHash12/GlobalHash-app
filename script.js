const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDjJkJ6fl96n5TBrO2sXFMQWSK1Sf6luSM",
  authDomain: "globalhash-e431a.firebaseapp.com",
  projectId: "globalhash-e431a",
  storageBucket: "globalhash-e431a.firebasestorage.app",
  messagingSenderId: "453689359269",
  appId: "1:453689359269:web:f61f441e383cb30b28464c",
  databaseURL: "https://globalhash-e431a-default-rtdb.firebaseio.com/"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const AdController = window.Adsgram.init({ blockId: "23804", debug: true });

// 1. PAGE NAVIGATION
window.showPage = function(id) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0,0);
};

// 2. LANGUAGE SELECTION
window.selectLang = function(id, name) {
    document.getElementById('selected-lang-title').innerText = name + " Novels";
    loadLibrary(id);
    showPage('library-section');
};

// 3. LOAD LIBRARY (8 BOOKS)
function loadLibrary(langId) {
    const list = document.getElementById('book-list');
    list.innerHTML = '';
    const myBooks = [
        { title: "Dr. Dorm", cover: "cover1.jpg" },
        { title: "Hidden Stitch", cover: "cover2.jpg" },
        { title: "Prince of Asphalt", cover: "cover3.jpg" },
        { title: "Dark Magic", cover: "cover4.jpg" },
        { title: "Dark Love", cover: "cover5.jpg" },
        { title: "Isekai Tale", cover: "cover6.jpg" },
        { title: "Fantasy World", cover: "cover7.jpg" },
        { title: "Forbidden Power", cover: "cover8.jpg" }
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
    for(let i=1; i<=25; i++) {
        const btn = document.createElement('div');
        btn.className = 'chapter-btn';
        btn.innerHTML = `<span>Chapter ${i}</span> 🔒`;
        btn.onclick = () => openChapter(i);
        list.appendChild(btn);
    }
    document.getElementById('content-display').classList.add('hidden');
    list.classList.remove('hidden');
    showPage('reader-section');
}

window.openChapter = async function(num) {
    try {
        await AdController.show();
        displayContent(num);
    } catch (e) {
        displayContent(num);
    }
};

function displayContent(num) {
    document.getElementById('chapter-list').classList.add('hidden');
    const display = document.getElementById('content-display');
    display.classList.remove('hidden');
    display.innerText = `Chapter ${num} Content will be loaded here from Firebase.`;
}
