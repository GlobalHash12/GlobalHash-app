const tg = window.Telegram.WebApp;
tg.expand();

// 14 ቋንቋዎች ከባንዲራ ጋር
const languages = [
    { id: 'am', name: 'Amharic Novels (የአማርኛ ልብወለዶች)', flag: 'https://flagcdn.com/w320/et.png' },
    { id: 'en', name: 'English Novels', flag: 'https://flagcdn.com/w320/gb.png' },
    { id: 'id', name: 'Indonesian Novels (Novel Bahasa Indonesia)', flag: 'https://flagcdn.com/w320/id.png' },
    { id: 'ko', name: 'Korean Novels (한국 소설)', flag: 'https://flagcdn.com/w320/kr.png' },
    { id: 'ja', name: 'Japanese Novels (日本の小説)', flag: 'https://flagcdn.com/w320/jp.png' },
    { id: 'ar', name: 'Arabic Novels (روايات عربية)', flag: 'https://flagcdn.com/w320/sa.png' },
    { id: 'hi', name: 'Hindi Novels (हिंदी उपन्यास)', flag: 'https://flagcdn.com/w320/in.png' },
    { id: 'zh', name: 'Chinese Novels (中文小说)', flag: 'https://flagcdn.com/w320/cn.png' },
    { id: 'fr', name: 'French Novels (Romans français)', flag: 'https://flagcdn.com/w320/fr.png' },
    { id: 'it', name: 'Italian Novels (Romanzi italiani)', flag: 'https://flagcdn.com/w320/it.png' },
    { id: 'es', name: 'Spanish Novels (Novelas en español)', flag: 'https://flagcdn.com/w320/es.png' },
    { id: 'de', name: 'German Novels (Deutsche Romane)', flag: 'https://flagcdn.com/w320/de.png' },
    { id: 'pt', name: 'Portuguese Novels (Romances em português)', flag: 'https://flagcdn.com/w320/pt.png' },
    { id: 'ru', name: 'Russian Novels (Русские романы)', flag: 'https://flagcdn.com/w320/ru.png' }
];

const AdController = window.Adsgram.init({ blockId: "23804" });

// ቋንቋዎችን በገጹ ላይ የሚጭን ፈንክሽን
function initApp() {
    const langList = document.getElementById('language-list');
    langList.innerHTML = ''; // Clear existing
    languages.forEach(lang => {
        const item = document.createElement('div');
        item.className = 'lang-item';
        item.innerHTML = `<img src="${lang.flag}"><p>${lang.name}</p>`;
        item.onclick = () => selectLanguage(lang);
        langList.appendChild(item);
    });
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0,0);
}

function selectLanguage(lang) {
    document.getElementById('selected-lang-title').innerText = lang.name;
    loadLibrary(lang.id);
    showPage('library-section');
}

function loadLibrary(langId) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';
    
    // በነጻነት የምትቀይራቸው 3 መጽሐፍት
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
        bookList.appendChild(card);
    });
}

function openBook(book) {
    document.getElementById('reading-title').innerText = book.title;
    const chapterList = document.getElementById('chapter-list');
    chapterList.innerHTML = '';
    for(let i=1; i<=20; i++) {
        const btn = document.createElement('div');
        btn.className = 'chapter-btn';
        btn.innerHTML = `<span>Chapter ${i}</span> ${i > 3 ? '🔒' : '🔓'}`;
        btn.onclick = () => openChapter(i);
        chapterList.appendChild(btn);
    }
    document.getElementById('content-display').classList.add('hidden');
    document.getElementById('chapter-list').classList.remove('hidden');
    showPage('reader-section');
}

async function openChapter(num) {
    if (num > 3) {
        try {
            await AdController.show();
            displayContent(num);
        } catch (e) {
            tg.showAlert("Ad not ready. Unlocking for free (Test Mode).");
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
    display.innerText = `Chapter ${num} Content will be displayed here from your novel library.`;
}

// ገጹ እንደተጫነ ስራ አስጀምር
document.addEventListener('DOMContentLoaded', initApp);
