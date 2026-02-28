const tg = window.Telegram.WebApp;
tg.expand();

// Adsgram Block ID: 23804
const AdController = window.Adsgram.init({ blockId: "23804", debug: true });

// 1. ገጽ መቀያየሪያ
window.showPage = function(id) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById(id);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    window.scrollTo(0, 0);
};

// 2. ቋንቋ ሲመረጥ
window.selectLang = function(id, name) {
    document.getElementById('selected-lang-title').innerText = name + " Novels";
    loadLibrary(id);
    showPage('library-section');
};

// 3. መጽሐፍትን መጫኛ
function loadLibrary(langId) {
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

// 4. መጽሐፍ ሲከፈት
function openBook(book) {
    document.getElementById('reading-title').innerText = book.title;
    const list = document.getElementById('chapter-list');
    list.innerHTML = '';
    for(let i=1; i<=20; i++) {
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

// 5. ምዕራፍ ሲከፈት ማስታወቂያ
window.openChapter = async function(num) {
    if (num > 3) {
        try {
            await AdController.show();
            displayContent(num);
        } catch (e) {
            tg.showAlert("Ad loading... unlocking for now.");
            displayContent(num);
        }
    } else {
        displayContent(num);
    }
};

function displayContent(num) {
    document.getElementById('chapter-list').classList.add('hidden');
    const display = document.getElementById('content-display');
    display.classList.remove('hidden');
    display.innerText = `Chapter ${num} Content...\n\n[Your translated story text will be here]`;
}
