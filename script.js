let ads = 0;
let balance = 0.0000;
let isMining = false;

const tg = window.Telegram.WebApp;
tg.expand();
document.getElementById('username').innerText = `@${tg.initDataUnsafe.user?.username || 'GlobalMiner'}`;

function handleAction() {
    if (isMining) return;
    if (ads < 20) {
        ads++;
        document.getElementById('ad-count').innerText = ads + "/20";
        document.getElementById('progress-bar').style.width = (ads / 20 * 100) + "%";
        if (ads === 20) {
            document.getElementById('action-btn').innerText = "START 24H MINING";
        }
    } else {
        startMining();
    }
}

function startMining() {
    isMining = true;
    document.getElementById('action-btn').innerText = "MINING...";
    document.getElementById('action-btn').style.opacity = "0.6";
    
    const miningInterval = setInterval(() => {
        balance += 0.0001;
        document.getElementById('balance').innerText = balance.toFixed(4);
    }, 1000);
}
