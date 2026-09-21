// ==========================================
// TIMER LOGIC & STATE
// ==========================================
let totalTime = 30; // 秒数
let timeRemaining = 30;
let timerInterval = null;
let isRunning = false;

const timerDisplay = document.getElementById('timerDisplay');
const statusLabel = document.getElementById('statusLabel');
const startBtn = document.getElementById('startBtn');
const startBtnText = document.getElementById('startBtnText');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const progressRing = document.getElementById('progressRing');
const flashContainer = document.getElementById('flashContainer');
const presetLabel = document.getElementById('presetLabel');

const ringCircumference = 2 * Math.PI * 42; // r=42
const presetBtnIdleClass = "preset-btn px-4 py-2 rounded-2xl bg-white text-slate-600 hover:bg-amber-100 text-xs font-bold shadow-sm border border-amber-200 transition";
const presetBtnActiveClass = "preset-btn px-4 py-2 rounded-2xl bg-amber-400 text-amber-900 shadow-md text-xs font-bold transition";

function updateDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Update Progress Ring
    const progress = timeRemaining / totalTime;
    const offset = ringCircumference * (1 - progress);
    progressRing.style.strokeDashoffset = offset;

    // 5秒以下のやさしい警告（温かみのあるオレンジ＆ぴょんぴょんアニメーション）
    if (timeRemaining <= 5 && timeRemaining > 0 && isRunning) {
        timerDisplay.className = "font-mono text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter tabular-nums text-amber-500 animate-bounce-soft";
        progressRing.className = "text-amber-500 transition-all duration-300 ease-linear";
        flashContainer.className = "absolute inset-0 rounded-3xl transition-colors duration-500 pointer-events-none -z-10 bg-amber-100/50 animate-sparkle";
        statusLabel.textContent = `あと ${timeRemaining}びょう！`;
        statusLabel.className = "text-sm sm:text-base font-bold tracking-wider text-amber-800 mb-1 bg-amber-200 px-4 py-1 rounded-full animate-pulse";
    } else if (timeRemaining === 0) {
        timerDisplay.className = "font-mono text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter tabular-nums text-rose-500 scale-105";
        progressRing.className = "text-rose-400 transition-all duration-300 ease-linear";
        flashContainer.className = "absolute inset-0 rounded-3xl transition-colors duration-500 pointer-events-none -z-10 bg-pink-100/80";
    } else {
        timerDisplay.className = "font-mono text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter tabular-nums text-slate-800 drop-shadow-sm";
        progressRing.className = "text-amber-400 transition-all duration-300 ease-linear";
        flashContainer.className = "absolute inset-0 rounded-3xl transition-colors duration-500 pointer-events-none -z-10";
    }
}

function toggleTimer() {
    initAudio();
    if (isRunning) {
        pauseTimer();
    } else {
        if (timeRemaining <= 0) {
            resetTimer();
        }
        startTimer();
    }
}

function startTimer() {
    stopTimeUpSound(); // 鳴っていたら止める
    isRunning = true;
    statusLabel.textContent = "がんばれ〜！";
    statusLabel.className = "text-sm sm:text-base font-bold tracking-wider text-emerald-800 mb-1 bg-emerald-100 px-4 py-1 rounded-full";

    startBtnText.textContent = "ストップ";
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');

    timerInterval = setInterval(() => {
        timeRemaining--;
        updateDisplay();

        // 残り5秒〜1秒でカウントダウン音
        if (timeRemaining <= 5 && timeRemaining > 0) {
            playBeepSound();
        }

        // タイムアップ（0秒）
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            isRunning = false;
            statusLabel.textContent = "🛑 ストップ！てをとめよう！";
            statusLabel.className = "text-base sm:text-lg font-black tracking-wider text-white bg-rose-500 px-5 py-2 rounded-full animate-bounce shadow-lg";

            startBtnText.textContent = "もういちど";
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');

            startTimeUpSoundLoop(); // ストップされるまで鳴らし続ける
            triggerConfetti();
        }
    }, 1000);
}

function pauseTimer() {
    stopTimeUpSound(); // 鳴っていたら止める
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    statusLabel.textContent = "たんま！";
    statusLabel.className = "text-sm sm:text-base font-bold tracking-wider text-amber-800 mb-1 bg-amber-100 px-4 py-1 rounded-full";

    startBtnText.textContent = "つづける";
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
}

function resetTimer() {
    stopTimeUpSound(); // 鳴っていたら止める
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    timeRemaining = totalTime;

    statusLabel.textContent = "じゅんび OK！";
    statusLabel.className = "text-sm sm:text-base font-bold tracking-wider text-amber-600 mb-1 bg-amber-100/80 px-4 py-1 rounded-full";

    startBtnText.textContent = "スタート";
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');

    clearConfetti();

    updateDisplay();
}

function setPreset(seconds, sourceBtn) {
    totalTime = seconds;

    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    let labelStr = "";
    if (m > 0) labelStr += `${m}ふん`;
    if (s > 0) labelStr += `${s}びょう`;
    presetLabel.textContent = `せってい: ${labelStr}`;

    resetTimer();

    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.className = presetBtnIdleClass;
    });
    if (sourceBtn) {
        sourceBtn.className = presetBtnActiveClass;
    }
}
