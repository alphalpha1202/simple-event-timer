// ==========================================
// MODALS & EVENT LISTENERS
// ==========================================
function toggleSettingsModal() {
    stopTimeUpSound();
    isTestingTimeUp = false;
    const btn = document.getElementById('testTimeUpBtn');
    if (btn) {
        btn.textContent = "🎉 おしまいの音（鳴らしテスト）";
        btn.className = "flex-1 py-2.5 px-3 rounded-2xl bg-rose-100 hover:bg-rose-200 text-xs font-bold text-rose-800 transition";
    }
    const modal = document.getElementById('settingsModal');
    modal.classList.toggle('hidden');
}

function toggleCustomTimeModal() {
    const modal = document.getElementById('customTimeModal');
    modal.classList.toggle('hidden');
}

function applyCustomTime() {
    const mins = parseInt(document.getElementById('customMinutes').value) || 0;
    const secs = parseInt(document.getElementById('customSeconds').value) || 0;
    const calculatedTotal = (mins * 60) + secs;

    if (calculatedTotal > 0) {
        setPreset(calculatedTotal);
        toggleCustomTimeModal();
    }
}

document.getElementById('settingsBtn').addEventListener('click', toggleSettingsModal);
document.getElementById('volumeSlider').addEventListener('input', updateMasterVolume);

// Initial Setup
updateDisplay();
