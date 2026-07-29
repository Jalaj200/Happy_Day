/* ═══════════════════════════════════════════════════════════
   Forever Us — Secret Sanctuary Interactivity
   ═══════════════════════════════════════════════════════════
   Features:
     1. Password Visibility Eye Toggle
     2. Fullscreen HTML5 Canvas Confetti Engine on Unlock
     3. Continuous Floating Hearts Generator
     4. Web Audio API Synthesized Romantic Music Box Melody
   ═══════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* ──────────────────────────────────────────
       1. PASSWORD VISIBILITY TOGGLE
       ────────────────────────────────────────── */
    const toggleBtn = document.getElementById("togglePasswordBtn");
    const passInput = document.getElementById("secretPasswordInput");
    const eyeIcon = document.getElementById("eyeIcon");

    if (toggleBtn && passInput && eyeIcon) {
        toggleBtn.addEventListener("click", () => {
            const isPass = passInput.type === "password";
            passInput.type = isPass ? "text" : "password";
            eyeIcon.className = isPass ? "fa-solid fa-eye-slash text-accent" : "fa-solid fa-eye";
            passInput.focus();
        });
    }

    /* ──────────────────────────────────────────
       2. FULLSCREEN CONFETTI ENGINE (ON UNLOCK)
       ────────────────────────────────────────── */
    const canvas = document.getElementById("secretConfettiCanvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const colors = ["#e91e63", "#ff80ab", "#ffd700", "#ffffff", "#ff4081", "#9c27b0"];

        class ConfettiParticle {
            constructor() {
                this.reset();
                this.y = Math.random() * height * -0.5; // Start above screen
            }
            reset() {
                this.x = Math.random() * width;
                this.y = -20;
                this.size = Math.random() * 8 + 6;
                this.speedY = Math.random() * 4 + 2;
                this.speedX = (Math.random() - 0.5) * 3;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.rotation = Math.random() * 360;
                this.rotSpeed = (Math.random() - 0.5) * 10;
                this.opacity = Math.random() * 0.4 + 0.6;
            }
            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.rotation += this.rotSpeed;
                if (this.y > height) this.reset();
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate((this.rotation * Math.PI) / 180);
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
                ctx.restore();
            }
        }

        // Spawn 100 confetti particles
        for (let i = 0; i < 100; i++) {
            particles.push(new ConfettiParticle());
        }

        function renderConfetti() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach((p) => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(renderConfetti);
        }
        renderConfetti();
    }

    /* ──────────────────────────────────────────
       3. FLOATING HEARTS GENERATOR
       ────────────────────────────────────────── */
    const heartsContainer = document.getElementById("secretHeartsContainer");
    if (heartsContainer) {
        const emojis = ["💖", "💕", "🌹", "💘", "👑", "✨"];

        function spawnHeart() {
            if (!heartsContainer || heartsContainer.children.length >= 15 || window.matchMedia("(prefers-reduced-motion: reduce)").matches || (window.isContainerVisible && !window.isContainerVisible(heartsContainer))) return;
            const heart = document.createElement("div");
            heart.className = "secret-floating-heart";
            heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            heart.style.position = "absolute";
            heart.style.left = "0px";
            heart.style.top = "0px";
            const startX = Math.random() * (window.innerWidth * 0.95);
            const startY = window.innerHeight + 50;
            const endX = startX + (Math.random() - 0.5) * 120;
            const endY = -60;
            heart.style.fontSize = `${Math.random() * 1.5 + 1.2}rem`;
            heart.style.opacity = `${Math.random() * 0.5 + 0.3}`;
            heart.style.transform = `translate3d(${startX}px, ${startY}px, 0) rotate(${Math.random() * 40 - 20}deg)`;
            const duration = Math.random() * 5 + 6;
            heart.style.transition = `all ${duration}s linear`;

            heartsContainer.appendChild(heart);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    heart.style.transform = `translate3d(${endX}px, ${endY}px, 0) rotate(${Math.random() * 360}deg) scale(1.2)`;
                    heart.style.opacity = "0";
                });
            });

            setTimeout(() => {
                if (heart.parentNode) heart.parentNode.removeChild(heart);
            }, duration * 1000 + 200);
        }

        let lastSpawn = performance.now();
        function rAFSecretLoop(time) {
            if (time - lastSpawn >= 600) {
                spawnHeart();
                lastSpawn = time;
            }
            requestAnimationFrame(rAFSecretLoop);
        }
        requestAnimationFrame(rAFSecretLoop);
        for (let i = 0; i < 6; i++) setTimeout(spawnHeart, i * 300);
    }

    /* ──────────────────────────────────────────
       4. SYNTHESIZED ROMANTIC MUSIC BOX MELODY
       ────────────────────────────────────────── */
    const musicBtn = document.getElementById("toggleSecretMusicBtn");
    const volumeIcon = document.getElementById("secretVolumeIcon");

    if (musicBtn && volumeIcon) {
        let audioCtx = null;
        let isPlaying = false;
        let loopTimer = null;

        const melodyNotes = [
            523.25, // C5
            659.25, // E5
            783.99, // G5
            987.77, // B5
            880.00, // A5
            659.25, // E5
            587.33, // D5
            783.99, // G5
        ];
        let noteIndex = 0;

        function playChime(freq) {
            if (!audioCtx || !isPlaying) return;
            try {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "sine";
                osc.frequency.value = freq;

                gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.2);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start();
                osc.stop(audioCtx.currentTime + 2.2);
            } catch (e) {
                console.warn("Web Audio chime error:", e);
            }
        }

        function startMelody() {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === "suspended") audioCtx.resume();

            isPlaying = true;
            volumeIcon.className = "fa-solid fa-volume-high text-accent";
            musicBtn.classList.add("active");

            playChime(melodyNotes[0]);
            loopTimer = setInterval(() => {
                if (!isPlaying) return;
                noteIndex = (noteIndex + 1) % melodyNotes.length;
                playChime(melodyNotes[noteIndex]);
            }, 1200);
        }

        function stopMelody() {
            isPlaying = false;
            if (loopTimer) clearInterval(loopTimer);
            volumeIcon.className = "fa-solid fa-volume-xmark text-secondary";
            musicBtn.classList.remove("active");
        }

        // Auto-start music when entering unlocked sanctuary
        startMelody();

        musicBtn.addEventListener("click", () => {
            if (isPlaying) stopMelody();
            else startMelody();
        });
    }
});
