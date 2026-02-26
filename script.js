// Firebase Configuration (ካንተ ዳታቤዝ ጋር የተገናኘ)
const firebaseConfig = {
  apiKey: "AIzaSyDjJkJ6fl96n5TBrO2sXFMQWSK1Sf6luSM",
  authDomain: "globalhash-e431a.firebaseapp.com",
  projectId: "globalhash-e431a",
  storageBucket: "globalhash-e431a.firebasestorage.app",
  messagingSenderId: "453689359269",
  appId: "1:453689359269:web:f61f441e383cb30b28464c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Telegram WebApp Integration
const tg = window.Telegram.WebApp;
tg.expand();
const userId = tg.initDataUnsafe.user?.id || "guest";
const username = tg.initDataUnsafe.user?.username || "Miner";

document.getElementById('username').innerText = `@${username}`;

let userData = { balance: 0, adsSeen: 0, miningUntil: 0, friendsCount: 0 };

// Load Data from Firebase
db.ref('users/' + userId).on('value', (snapshot) => {
    if (snapshot.exists()) {
        userData = snapshot.val();
    } else {
        // አዲስ ተጠቃሚ ከሆነ ሪፈራል ካለ ቼክ ማድረግ
        const urlParams = new URLSearchParams(window.location.search);
        const startParam = urlParams.get('tgWebAppStartParam');
        if (startParam) {
            giveReferralBonus(startParam);
        }
        saveData();
    }
    updateUI();
});

function handleAction() {
    const now = Date.now();
    if (userData.miningUntil > now) return;

    if (userData.adsSeen < 20) {
        userData.adsSeen++;
        saveData();
    } else {
        // Start 24H Mining
        userData.miningUntil = Date.now() + (24 * 60 * 60 * 1000);
        userData.adsSeen = 0;
        saveData();
    }
}

function giveReferralBonus(referrerId) {
    db.ref('users/' + referrerId).once('value', (snap) => {
        if (snap.exists()) {
            let data = snap.val();
            data.balance = (data.balance || 0) + 50; // ለጋባዡ 50 GH ስጦታ
            data.friendsCount = (data.friendsCount || 0) + 1;
            db.ref('users/' + referrerId).set(data);
        }
    });
}

// ጓደኛ መጋበዣ ቁልፍ ሲነካ (ይህ በአንተ ቦት ስም የተስተካከለ ነው)
function inviteFriends() {
    const inviteLink = `https://t.me/GlobalHash_bot/app?startapp=${userId}`;
    const shareText = `Join GlobalHash and mine GH tokens with me! 🚀`;
    const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`;
    tg.openTelegramLink(fullUrl);
}

function updateUI() {
    const now = Date.now();
    document.getElementById('balance').innerText = userData.balance.toFixed(4);
    document.getElementById('ad-count').innerText = userData.adsSeen + "/20";

    if (userData.miningUntil > now) {
        document.getElementById('status-text').innerText = "STATUS: MINING...";
        document.getElementById('action-btn').innerText = "MINING IN PROGRESS";
        document.getElementById('action-btn').style.opacity = "0.5";
        updateTimer(userData.miningUntil - now);
    } else {
        document.getElementById('status-text').innerText = "STATUS: IDLE";
        document.getElementById('timer').innerText = "24:00:00";
        document.getElementById('progress-bar').style.width = (userData.adsSeen / 20 * 100) + "%";
        document.getElementById('action-btn').innerText = userData.adsSeen >= 20 ? "START MINING" : "WATCH AD TO START";
        document.getElementById('action-btn').style.opacity = "1";
    }
}

function updateTimer(ms) {
    let s = Math.floor(ms / 1000);
    let h = Math.floor(s / 3600);
    let m = Math.floor((s % 3600) / 60);
    let sec = s % 60;
    document.getElementById('timer').innerText = `${h}:${m < 10 ? '0'+m : m}:${sec < 10 ? '0'+sec : sec}`;
}

// Mining Process (በየሰከንዱ ባላንስ መጨመር)
setInterval(() => {
    const now = Date.now();
    if (userData.miningUntil > now) {
        userData.balance += 0.0001; 
        saveData();
    }
}, 1000);

function saveData() {
    db.ref('users/' + userId).set(userData);
}
