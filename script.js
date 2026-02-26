// Firebase Configuration
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

// Telegram Integration
const tg = window.Telegram.WebApp;
tg.expand();
const userId = tg.initDataUnsafe.user?.id || "test_user";
document.getElementById('username').innerText = `@${tg.initDataUnsafe.user?.username || 'Miner'}`;

let userData = { balance: 0, adsSeen: 0, miningUntil: 0 };

// Load Data from Database
db.ref('users/' + userId).on('value', (snapshot) => {
    if (snapshot.exists()) {
        userData = snapshot.val();
        updateUI();
    } else {
        saveData();
    }
});

function handleAction() {
    const now = Date.now();
    if (userData.miningUntil > now) return;

    if (userData.adsSeen < 20) {
        // Here we simulate ad watching
        userData.adsSeen++;
        saveData();
    } else {
        // Start Mining for 24 hours
        userData.miningUntil = Date.now() + (24 * 60 * 60 * 1000);
        userData.adsSeen = 0;
        saveData();
    }
}

function updateUI() {
    const now = Date.now();
    document.getElementById('balance').innerText = userData.balance.toFixed(4);
    document.getElementById('ad-count').innerText = userData.adsSeen + "/20";

    if (userData.miningUntil > now) {
        // Mining is Active
        document.getElementById('status-text').innerText = "STATUS: MINING...";
        document.getElementById('action-btn').innerText = "MINING IN PROGRESS";
        document.getElementById('action-btn').style.opacity = "0.5";
        document.getElementById('progress-bar').style.width = "100%";
        
        // Calculate remaining time
        const remaining = userData.miningUntil - now;
        updateTimer(remaining);

        // Update Balance (visual only, real update happens on start)
        // In a real pro app, we calculate balance based on time elapsed
    } else {
        // Mining is Idle
        document.getElementById('status-text').innerText = "STATUS: IDLE";
        document.getElementById('timer').innerText = "24:00:00";
        document.getElementById('progress-bar').style.width = (userData.adsSeen / 20 * 100) + "%";
        document.getElementById('action-btn').innerText = userData.adsSeen >= 20 ? "START MINING" : "WATCH AD TO START";
        document.getElementById('action-btn').style.opacity = "1";
    }
}

function updateTimer(ms) {
    let seconds = Math.floor(ms / 1000);
    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = seconds % 60;
    document.getElementById('timer').innerText = `${h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
}

// Visual balance increase every second during mining
setInterval(() => {
    const now = Date.now();
    if (userData.miningUntil > now) {
        userData.balance += 0.0001; // Mining rate
        document.getElementById('balance').innerText = userData.balance.toFixed(4);
        saveData(); // Save new balance
        updateUI();
    }
}, 1000);

function saveData() {
    db.ref('users/' + userId).set(userData);
}
