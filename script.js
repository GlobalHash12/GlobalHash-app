// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDjJkJ6fl96n5TBrO2sXFMQWSK1Sf6luSM",
  authDomain: "globalhash-e431a.firebaseapp.com",
  projectId: "globalhash-e431a",
  storageBucket: "globalhash-e431a.firebasestorage.app",
  messagingSenderId: "453689359269",
  appId: "1:453689359269:web:f61f441e383cb30b28464c"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Adsgram መታወቂያ ተቀናብሯል
const AdController = window.Adsgram.init({ blockId: "23804" });

const tg = window.Telegram.WebApp;
tg.expand();
const userId = tg.initDataUnsafe.user?.id || "guest";
document.getElementById('username').innerText = `@${tg.initDataUnsafe.user?.username || 'Miner'}`;

let userData = { balance: 0, adsSeen: 0, miningUntil: 0 };

// ዳታውን ከዳታቤዝ መጫን
db.ref('users/' + userId).on('value', (snapshot) => {
    if (snapshot.exists()) {
        userData = snapshot.val();
    }
    updateUI();
});

// እውነተኛ ማስታወቂያ የሚያሳየው ፈንክሽን
async function showAd() {
    const now = Date.now();
    if (userData.miningUntil > now) return;

    if (userData.adsSeen < 20) {
        try {
            await AdController.show(); // ማስታወቂያውን ያሳያል
            userData.adsSeen++;
            saveData();
        } catch (e) {
            tg.showAlert("ማስታወቂያው አልተጫነም፤ እባክዎ በድጋሚ ይሞክሩ።");
        }
    } else {
        startMining();
    }
}

function startMining() {
    userData.miningUntil = Date.now() + (24 * 60 * 60 * 1000);
    userData.adsSeen = 0;
    saveData();
}

function updateUI() {
    const now = Date.now();
    document.getElementById('balance').innerText = userData.balance.toFixed(4);
    document.getElementById('ad-count').innerText = userData.adsSeen + "/20";

    if (userData.miningUntil > now) {
        document.getElementById('status-text').innerText = "STATUS: MINING...";
        document.getElementById('action-btn').innerText = "MINING IN PROGRESS";
        document.getElementById('action-btn').style.opacity = "0.5";
        document.getElementById('progress-bar').style.width = "100%";
        const remaining = userData.miningUntil - now;
        updateTimer(remaining);
    } else {
        document.getElementById('status-text').innerText = "STATUS: IDLE";
        document.getElementById('timer').innerText = "24:00:00";
        document.getElementById('progress-bar').style.width = (userData.adsSeen / 20 * 100) + "%";
        document.getElementById('action-btn').style.opacity = "1";
        document.getElementById('action-btn').innerText = userData.adsSeen >= 20 ? "START MINING ⛏️" : "WATCH AD TO START";
    }
}

function updateTimer(ms) {
    let s = Math.floor(ms / 1000);
    let h = Math.floor(s / 3600);
    let m = Math.floor((s % 3600) / 60);
    let sec = s % 60;
    document.getElementById('timer').innerText = `${h}:${m < 10 ? '0'+m : m}:${sec < 10 ? '0'+sec : sec}`;
}

// ማይንግ በየሰከንዱ ባላንስ እንዲጨምር
setInterval(() => {
    const now = Date.now();
    if (userData.miningUntil > now) {
        userData.balance += 0.0001; 
        saveData();
    }
}, 1000);

function saveData() { db.ref('users/' + userId).set(userData); }

function inviteFriends() {
    const inviteLink = `https://t.me/GlobalHash_bot/app?startapp=${userId}`;
    tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=Join GlobalHash!`);
}
