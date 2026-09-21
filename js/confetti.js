// ==========================================
// CONFETTI ANIMATION FOR KIDS
// ==========================================
const confettiCanvas = document.getElementById('confettiCanvas');
const ctx = confettiCanvas.getContext('2d');
let particles = [];
let confettiAnimationId = null;

function resizeConfetti() {
    confettiCanvas.width = confettiCanvas.offsetWidth;
    confettiCanvas.height = confettiCanvas.offsetHeight;
}
window.addEventListener('resize', resizeConfetti);

function triggerConfetti() {
    resizeConfetti();
    particles = [];
    const colors = ['#f43f5e', '#ec4899', '#d946ef', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

    for (let i = 0; i < 70; i++) {
        particles.push({
            x: confettiCanvas.width / 2,
            y: confettiCanvas.height / 2,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.7) * 14,
            size: Math.random() * 8 + 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rSpeed: (Math.random() - 0.5) * 10
        });
    }

    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
    animateConfetti();
}

function animateConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let alive = false;

    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // 重力
        p.rotation += p.rSpeed;

        if (p.y < confettiCanvas.height) {
            alive = true;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        }
    });

    if (alive) {
        confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
}

function clearConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}
