const tg = window.Telegram.WebApp;
tg.expand();

const AdController = window.Adsgram.init({ blockId: "23804", debug: true });

let currentLanguage = "";

// 1. ገጾችን መቀያየሪያ ፈንክሽን
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0,0);
}

// 2. ቋንቋ ሲመረጥ
function selectLang(id, name) {
    currentLanguage = id;
    document.getElementById('selected-lang-title').innerText = name + " Novels";
    loadLibrary(id); // የዚያን ቋንቋ መጽሐፍት ይጭናል
    showPage('library-section');
}

// 3. መጽሐፍትን መጫኛ (በቋንቋው መሰረት)
function loadLibrary(langId) {
    const list = document.getElementById('book-list');
    list.innerHTML = '';

    // ስምንቱንም መጽሐፍት እዚህ ጋር መመዝገብ ትችላለህ
    const myBooks = [
        { id: 1, title: "ዶክተር ዶርም (Dr. Dorm)", cover: "cover1.jpg" },
        { id: 2, title: "ስውር ስፌት (Hidden Stitch)", cover: "cover2.jpg" },
        { id: 3, title: "የአስፋልቱ ልዑል", cover: "cover3.jpg" },
        { id: 4, title: "Dark Magic", cover: "cover4.jpg" },
        { id: 5, title: "Shadow of Love", cover: "cover5.jpg" },
        { id: 6, title: "The Forbidden Scroll", cover: "cover6.jpg" },
        { id: 7, title: "Fantasy World", cover: "cover7.jpg" },
        { id: 8, title: "The Last Isekai", cover: "cover8.jpg" }
    ];

    myBooks.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `<img src="${book.cover}"><h3>${book.title}</h3>`;
        card.onclick = () => openBook(book);
        list.appendChild(card);
    });
}

// 4. መጽሐፍ ሲከፈት ምዕራፎችን ማሳያ
function openBook(book) {
    document.getElementById('reading-title').innerText = book.title;
    const list = document.getElementById('chapter-list');
    list.innerHTML = '';
    
    // ከ 1 እስከ 25 ምዕራፎችን ይፈጥራል
    for(let i=1; i<=25; i++) {
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

// 5. ምዕራፍ ሲከፈት ማስታወቂያ ማሳያ
async function openChapter(num) {
    if (num > 3) {
        try {
            await AdController.show(); // እውነተኛ ማስታወቂያ
            displayContent(num);
        } catch (e) {
            tg.showAlert("Loading ad... please wait.");
            displayContent(num); // ለጊዜው ይክፈተው
        }
    } else {
        displayContent(num);
    }
}

// 6. የታሪኩን ጽሁፍ ማሳያ
function displayContent(num) {
    document.getElementById('chapter-list').classList.add('hidden');
    const display = document.getElementById('content-display');
    display.classList.remove('hidden');
    
    // እዚህ ጋር ነው ወደፊት ከFirebase ዳታ የሚመጣው
    display.innerText = `Chapter ${num}\n\n[Loading Story Content in ${currentLanguage}...]\n\nThis is where your epic story text will appear. Because you have 14 languages, we will link this to your Firebase database to fetch the correct translation automatically.`;
}
