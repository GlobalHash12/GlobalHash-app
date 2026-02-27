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

// CONVERSION RATE
const GH_TO_TON_RATE = 0.01; // 100 GH = 1 TON (1 GH = 0.01 TON)

const user = tg.initDataUnsafe.user;
const userId = user ? user.id : "guest";
document.getElementById('username').innerText = "@" + (user?.username || "Miner");

let userData = { balance: 0, adsSeen: 0, miningUntil: 0, friends: 0, refEarnings: 0, invitedBy: null };

db.ref('users/' + userId).on('value', (snapshot) => {
    if (snapshot.exists()) {
        userData = snapshot.val();
        updateTier();
    } else {
        const urlParams = new URLSearchParams(window.location.search);
        const refId = urlParams.get('tgWebAppStartParam');
        if (refId) { userData.invitedBy = refId; }
        saveData();
    }
    updateUI();
});

function showTab(tabName) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName + '-section').classList.add('active');
    event.currentTarget.classList.add('active');
}

const AdController = window.Adsgram.init({ blockId: "23804", debug: true });

async function showAd() {
    if (userData.miningUntil > Date.now()) return;
    if (userData.adsSeen < 20) {
        try {
            await AdController.show();
            userData.adsSeen++; saveData();
        } catch (e) { tg.showAlert("Ad not ready."); }
    } else {
        userData.miningUntil = Date.now() + (24 * 60 * 60 * 1000);
        userData.adsSeen = 0; saveData();
    }
}

function updateTier() {
    let t = "BRONZE"; let b = document.getElementById('tier-badge');
    let bal = userData.balance;
    if (bal >= 5000) { t = "GOLD"; b.className = "tier-gold"; }
    else if (bal >= 1000) { t = "SILVER"; b.className = "tier-silver"; }
    else { t = "BRONZE"; b.className = "tier-bronze"; }
    b.innerText = t;
}

function updateUI() {
    const balance = userData.balance || 0;
    document.getElementById('balance').innerText = balance.toFixed(4);
    document.getElementById('wallet-balance').innerText = balance.toFixed(4) + " GH";
    
    // Calculate TON value
    const estimatedTON = balance * GH_TO_TON_RATE;
    document.getElementById('ton-value').innerText = estimatedTON.toFixed(2);
    
    document.getElementById('ad-count').innerText = (userData.adsSeen || 0);
    document.getElementById('friends-count').innerText = userData.friends || 0;

    if (userData.miningUntil > Date.now()) {
        document.getElementById('status-text').innerText = "MINING...";
        document.getElementById('progress-bar').style.width = "100%";
        updateTimer(userData.miningUntil - Date.now());
    } else {
        document.getElementById('status-text').innerText = "IDLE";
        document.getElementById('progress-bar').style.width = ((userData.adsSeen || 0) / 20 * 100) + "%";
    }
}

function updateTimer(ms) {
    let s = Math.floor(ms / 1000);
    let h = Math.floor(s / 3600);
    let m = Math.floor((s % 3600) / 60);
    let sec = s % 60;
    document.getElementById('timer').innerText = `${h}:${m < 10 ? '0'+m : m}:${sec < 10 ? '0'+sec : sec}`;
}

function requestWithdraw() {
    const addr = document.getElementById('wallet-address').value;
    if (userData.balance < 100) { tg.showAlert("Minimum 100 GH (1 TON) required."); return; }
    if (addr.length < 10) { tg.showAlert("Please enter a valid TON address."); return; }
    
    // Save withdrawal request as TON
    db.ref('withdrawals/' + userId).push({
        ton_address: addr,
        gh_amount: userData.balance,
        ton_equivalent: (userData.balance * GH_TO_TON_RATE).toFixed(2),
        currency: "TON",
        time: Date.now()
    });
    
    userData.balance = 0;
    saveData();
    tg.showAlert("Success! Your TON withdrawal will be processed in 24h.");
}

setInterval(() => {
    if (userData.miningUntil > Date.now()) {
        userData.balance = (userData.balance || 0) + 0.0001;
        saveData();
    }
}, 1000);

function saveData() { db.ref('users/' + userId).set(userData); }

function inviteFriends() {
    const link = "https://t.me/GlobalHash_bot/app?startapp=" + userId;
    tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=Mine GH with me!`);
}
