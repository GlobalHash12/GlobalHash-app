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
const tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe.user;
const userId = user ? user.id : "guest_user";
document.getElementById('username').innerText = "@" + (user?.username || "Miner");

let userData = { balance: 0, adsSeen: 0, miningUntil: 0, friends: 0, tier: "BRONZE" };

db.ref('users/' + userId).on('value', (snapshot) => {
    if (snapshot.exists()) {
        userData = snapshot.val();
        updateTier();
    } else { saveData(); }
    updateUI();
});

function showTab(tabName) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName + '-section').classList.add('active');
    event.currentTarget.classList.add('active');
}

const AdController = window.Adsgram.init({ blockId: "23804" });
async function showAd() {
    if (userData.miningUntil > Date.now()) return;
    if (userData.adsSeen < 20) {
        try {
            await AdController.show();
            userData.adsSeen++;
            saveData();
        } catch (e) { tg.showAlert("Ad not ready. Try later."); }
    } else { startMining(); }
}

function startMining() {
    userData.miningUntil = Date.now() + (24 * 60 * 60 * 1000);
    userData.adsSeen = 0;
    saveData();
}

function updateTier() {
    let t = "BRONZE";
    let badge = document.getElementById('tier-badge');
    if (userData.balance >= 1000) { t = "GOLD"; badge.className = "tier-gold"; }
    else if (userData.balance >= 200) { t = "SILVER"; badge.className = "tier-silver"; }
    badge.innerText = t;
}

function inviteFriends() {
    const link = "https://t.me/GlobalHash_bot/app?startapp=" + userId;
    tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=Join me on GlobalHash!`);
}

function requestWithdraw() {
    const addr = document.getElementById('wallet-address').value;
    if (userData.balance < 100) { tg.showAlert("Min 100 GH needed."); return; }
    if (addr.length < 10) { tg.showAlert("Invalid address."); return; }
    db.ref('withdrawals/' + userId).push({ addr: addr, amount: userData.balance, time: Date.now() });
    userData.balance = 0;
    saveData();
    tg.showAlert("Withdrawal request sent!");
}

function updateUI() {
    document.getElementById('balance').innerText = userData.balance.toFixed(4);
    document.getElementById('wallet-balance').innerText = userData.balance.toFixed(4) + " GH";
    document.getElementById('ad-count').innerText = userData.adsSeen + "/20";
    document.getElementById('friends-count').innerText = userData.friends || 0;

    const now = Date.now();
    if (userData.miningUntil > now) {
        document.getElementById('status-text').innerText = "MINING...";
        document.getElementById('action-btn').innerText = "MINING IN PROGRESS";
        document.getElementById('progress-bar').style.width = "100%";
        updateTimer(userData.miningUntil - now);
    } else {
        document.getElementById('status-text').innerText = "IDLE";
        document.getElementById('progress-bar').style.width = (userData.adsSeen / 20 * 100) + "%";
        document.getElementById('action-btn').innerText = userData.adsSeen >= 20 ? "START MINING ⛏️" : "WATCH AD TO START";
    }
}

function updateTimer(ms) {
    let s = Math.floor(ms / 1000);
    let h = Math.floor(s / 3600);
    let m = Math.floor((s % 3600) / 60);
    let sec = s % 60;
    document.getElementById('timer').innerText = h + ":" + (m < 10 ? '0'+m : m) + ":" + (sec < 10 ? '0'+sec : sec);
}

setInterval(() => {
    if (userData.miningUntil > Date.now()) {
        userData.balance += 0.0001;
        saveData();
    }
}, 1000);

function saveData() { db.ref('users/' + userId).set(userData); }
