// ==========================================
// WEB AUDIO API SYNTHESIZER (KIDS FRIENDLY)
// ==========================================
let audioCtx = null;
let masterGain = null;
let timeUpLoopTimer = null; // タイムアップ音の繰り返しタイマー

function initAudio() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
        masterGain = audioCtx.createGain();
        masterGain.connect(audioCtx.destination);
        updateMasterVolume();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function updateMasterVolume() {
    if (!masterGain) return;
    const vol = document.getElementById('volumeSlider').value / 100;
    masterGain.gain.setValueAtTime(vol, audioCtx.currentTime);
    document.getElementById('volumeValue').textContent = `${document.getElementById('volumeSlider').value}%`;
}

// 5, 4, 3, 2, 1秒前のカウントダウン音（はっきり聞こえるツートンピピッ音）
function playBeepSound() {
    initAudio();
    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now); // A5 (高めのハッキリした音)

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.15);
}

// 1回分のタイムアップサウンドパターンを発音
function playSingleTimeUpPattern() {
    initAudio();
    const soundType = document.getElementById('soundTypeSelect').value;
    const now = audioCtx.currentTime;

    if (soundType === 'whistle') {
        // ⚽ 運動会の笛（ピピピィー！）
        const pattern = [
            { freq: 1760, time: 0, dur: 0.08 },
            { freq: 1760, time: 0.12, dur: 0.08 },
            { freq: 1760, time: 0.24, dur: 0.45 }
        ];
        pattern.forEach(p => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const t = now + p.time;
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(p.freq, t);
            gain.gain.setValueAtTime(0.9, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + p.dur);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(t);
            osc.stop(t + p.dur);
        });

    } else if (soundType === 'horn') {
        // 🎺 パフパフラッパ（ぷっぷー！）
        const pattern = [
            { freq: 400, time: 0, dur: 0.15 },
            { freq: 600, time: 0.2, dur: 0.4 }
        ];
        pattern.forEach(p => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const t = now + p.time;
            osc.type = 'sawtooth'; // パフパフ感のある明るい音
            osc.frequency.setValueAtTime(p.freq, t);
            gain.gain.setValueAtTime(0.5, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + p.dur);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(t);
            osc.stop(t + p.dur);
        });

    } else if (soundType === 'alarm') {
        // ⏰ ポップアラーム（ピピピピ！）
        const pattern = [
            { freq: 1046.5, time: 0, dur: 0.08 },
            { freq: 1046.5, time: 0.1, dur: 0.08 },
            { freq: 1046.5, time: 0.2, dur: 0.08 },
            { freq: 1046.5, time: 0.3, dur: 0.08 }
        ];
        pattern.forEach(p => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const t = now + p.time;
            osc.type = 'square';
            osc.frequency.setValueAtTime(p.freq, t);
            gain.gain.setValueAtTime(0.3, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + p.dur);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(t);
            osc.stop(t + p.dur);
        });
    }
}

// タイムアップ音のループを開始（ストップするまで鳴り続ける）
function startTimeUpSoundLoop() {
    stopTimeUpSound(); // 二重再生防止
    playSingleTimeUpPattern();
    // 1.1秒ごとに繰り返し再生
    timeUpLoopTimer = setInterval(() => {
        playSingleTimeUpPattern();
    }, 1100);
}

// タイムアップ音を停止
function stopTimeUpSound() {
    if (timeUpLoopTimer) {
        clearInterval(timeUpLoopTimer);
        timeUpLoopTimer = null;
    }
}

function testBeepSound() {
    playBeepSound();
}

let isTestingTimeUp = false;
function toggleTestTimeUpSound() {
    const btn = document.getElementById('testTimeUpBtn');
    if (isTestingTimeUp) {
        stopTimeUpSound();
        isTestingTimeUp = false;
        btn.textContent = "🎉 おしまいの音（鳴らしテスト）";
        btn.className = "flex-1 py-2.5 px-3 rounded-2xl bg-rose-100 hover:bg-rose-200 text-xs font-bold text-rose-800 transition";
    } else {
        startTimeUpSoundLoop();
        isTestingTimeUp = true;
        btn.textContent = "⏹️ おとのストップ";
        btn.className = "flex-1 py-2.5 px-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-xs font-bold text-white transition animate-pulse";
    }
}
