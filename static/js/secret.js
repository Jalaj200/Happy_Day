/* ═══════════════════════════════════════════════════════════
   Forever Us — Secret Sanctuary Interactivity
   ═══════════════════════════════════════════════════════════
   Features:
     1. Promise-based Transitions (Progressive Enhancement)
     2. Password Visibility Eye Toggle
     3. Fullscreen HTML5 Canvas Confetti Engine on Unlock
     4. Continuous Floating Hearts Generator
     5. Web Audio API Synthesized Romantic Music Box Melody
   ═══════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // ──────────────────────────────────────────
    // Architecture & State
    // ──────────────────────────────────────────
    let isUnlocked = window.INITIAL_IS_UNLOCKED || false;
    let isTransitioning = false;
    
    const dom = {
        lockSection: document.getElementById("secretLockSection"),
        unlockedSection: document.getElementById("secretUnlockedSection"),
        unlockForm: document.getElementById("secretUnlockForm"),
        passInput: document.getElementById("secretPasswordInput"),
        submitBtn: document.getElementById("unlockSubmitBtn"),
        submitText: document.getElementById("unlockSubmitText"),
        relockBtn: document.getElementById("relockBtn"),
        entranceOverlay: document.getElementById("sanctuaryEntranceOverlay"),
        lockIcon: document.getElementById("entranceLockIcon"),
        sanctuaryCard: document.getElementById("sanctuaryCard"),
        confettiCanvas: document.getElementById("secretConfettiCanvas"),
        heartsContainer: document.getElementById("secretHeartsContainer"),
        togglePassBtn: document.getElementById("togglePasswordBtn"),
        eyeIcon: document.getElementById("eyeIcon"),
        musicBtn: document.getElementById("toggleSecretMusicBtn"),
        volumeIcon: document.getElementById("secretVolumeIcon")
    };

    // Ensure initial DOM state matches isUnlocked
    if (isUnlocked) {
        dom.lockSection?.classList.add("hidden");
        dom.unlockedSection?.classList.remove("hidden");
        dom.confettiCanvas?.classList.remove("hidden");
        dom.heartsContainer?.classList.remove("hidden");
    } else {
        dom.lockSection?.classList.remove("hidden");
        dom.unlockedSection?.classList.add("hidden");
        dom.confettiCanvas?.classList.add("hidden");
        dom.heartsContainer?.classList.add("hidden");
    }

    // ──────────────────────────────────────────
    // Promise-Based Transition Utilities
    // ──────────────────────────────────────────
    const isReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function transitionFadeOut(element) {
        return new Promise(resolve => {
            if (!element) return resolve();
            if (isReducedMotion() || getComputedStyle(element).opacity === "0") {
                element.classList.add("hidden");
                element.classList.add("fade-out");
                element.classList.remove("fade-in");
                return resolve();
            }
            let fired = false;
            const handler = (e) => {
                if (e && e.target !== element) return;
                if (e && e.propertyName !== 'opacity') return;
                if (fired) return;
                fired = true;
                element.removeEventListener("transitionend", handler);
                element.classList.add("hidden");
                resolve();
            };
            element.addEventListener("transitionend", handler);
            element.classList.remove("fade-in");
            element.classList.add("fade-out");
            setTimeout(handler, 450);
        });
    }

    function transitionFadeIn(element) {
        return new Promise(resolve => {
            if (!element) return resolve();
            element.classList.remove("hidden");
            void element.offsetWidth; // force reflow
            if (isReducedMotion() || getComputedStyle(element).opacity === "1") {
                element.classList.remove("fade-out");
                element.classList.add("fade-in");
                return resolve();
            }
            let fired = false;
            const handler = (e) => {
                if (e && e.target !== element) return;
                if (e && e.propertyName !== 'opacity') return;
                if (fired) return;
                fired = true;
                element.removeEventListener("transitionend", handler);
                resolve();
            };
            element.addEventListener("transitionend", handler);
            element.classList.remove("fade-out");
            element.classList.add("fade-in");
            setTimeout(handler, 450);
        });
    }

    function animateLock() {
        return new Promise(resolve => {
            if (!dom.lockIcon) return resolve();
            dom.lockIcon.classList.remove("fa-lock-open");
            dom.lockIcon.classList.add("fa-lock");
            dom.lockIcon.style.animation = "none";
            void dom.lockIcon.offsetWidth; // reset animation
            
            if (isReducedMotion()) {
                dom.lockIcon.classList.remove("fa-lock");
                dom.lockIcon.classList.add("fa-lock-open");
                return resolve();
            }
            let fired = false;
            const handler = (e) => {
                if (e && e.target !== dom.lockIcon) return;
                if (fired) return;
                fired = true;
                dom.lockIcon.removeEventListener("animationend", handler);
                dom.lockIcon.classList.remove("fa-lock");
                dom.lockIcon.classList.add("fa-lock-open");
                resolve();
            };
            dom.lockIcon.addEventListener("animationend", handler);
            dom.lockIcon.style.animation = "unlockLock 1.2s ease forwards";
            setTimeout(handler, 1300);
        });
    }

    function staggerElementsIn() {
        return new Promise(resolve => {
            if (!dom.sanctuaryCard) return resolve();
            const elements = dom.sanctuaryCard.querySelectorAll('.sanctuary-crown, .sanctuary-badge, .secret-main-msg, .sanctuary-divider, .secret-ext-msg, .secret-music-box, .sanctuary-actions, .text-secondary');
            
            // Reset state
            dom.sanctuaryCard.classList.remove("entrance-card");
            elements.forEach(el => {
                el.classList.remove("entrance-fade-up");
                el.style.opacity = "0";
            });

            void dom.sanctuaryCard.offsetWidth; // reflow
            
            if (isReducedMotion()) {
                dom.sanctuaryCard.style.opacity = "1";
                dom.sanctuaryCard.style.filter = "none";
                elements.forEach(el => {
                    el.style.opacity = "1";
                    el.style.transform = "none";
                });
                return resolve();
            }

            dom.sanctuaryCard.classList.add("entrance-card");
            let completed = 0;
            elements.forEach((el, idx) => {
                setTimeout(() => {
                    el.style.opacity = "";
                    el.classList.add("entrance-fade-up");
                    completed++;
                    if (completed === elements.length) {
                        setTimeout(resolve, 600); // wait for last anim
                    }
                }, idx * 100);
            });
            if(elements.length === 0) resolve();
        });
    }

    // ──────────────────────────────────────────
    // Password Visibility
    // ──────────────────────────────────────────
    if (dom.togglePassBtn && dom.passInput && dom.eyeIcon) {
        dom.togglePassBtn.addEventListener("click", () => {
            const isPass = dom.passInput.type === "password";
            dom.passInput.type = isPass ? "text" : "password";
            dom.eyeIcon.className = isPass ? "fa-solid fa-eye-slash text-accent" : "fa-solid fa-eye";
            dom.passInput.focus();
        });
    }

    // ──────────────────────────────────────────
    // Music Box Logic
    // ──────────────────────────────────────────
    let audioCtx = null;
    let globalGain = null;
    let isPlaying = false;
    let loopTimer = null;
    const melodyNotes = [ 523.25, 659.25, 783.99, 987.77, 880.00, 659.25, 587.33, 783.99 ];
    let noteIndex = 0;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            globalGain = audioCtx.createGain();
            globalGain.connect(audioCtx.destination);
        }
    }

    function playChime(freq) {
        if (!audioCtx || !isPlaying) return;
        try {
            const osc = audioCtx.createOscillator();
            const noteGain = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.value = freq;
            noteGain.gain.setValueAtTime(0.12, audioCtx.currentTime);
            noteGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.2);
            osc.connect(noteGain);
            noteGain.connect(globalGain);
            osc.start();
            osc.stop(audioCtx.currentTime + 2.2);
        } catch (e) { console.warn("Audio error:", e); }
    }

    function startMelodyWithFade() {
        return new Promise(resolve => {
            initAudio();
            if (audioCtx.state === "suspended") audioCtx.resume();
            isPlaying = true;
            if(dom.volumeIcon) dom.volumeIcon.className = "fa-solid fa-volume-high text-accent";
            if(dom.musicBtn) dom.musicBtn.classList.add("active");

            // Fade in over 500ms
            globalGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
            globalGain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.5);

            playChime(melodyNotes[0]);
            if (loopTimer) clearInterval(loopTimer);
            loopTimer = setInterval(() => {
                if (!isPlaying) return;
                noteIndex = (noteIndex + 1) % melodyNotes.length;
                playChime(melodyNotes[noteIndex]);
            }, 1200);
            
            setTimeout(resolve, 500);
        });
    }

    function stopMelodyWithFade() {
        return new Promise(resolve => {
            if (!isPlaying || !audioCtx) return resolve();
            
            // Fade out over 800ms
            globalGain.gain.setValueAtTime(globalGain.gain.value, audioCtx.currentTime);
            globalGain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
            
            setTimeout(() => {
                isPlaying = false;
                if (loopTimer) clearInterval(loopTimer);
                noteIndex = 0; // Reset to beginning
                if (audioCtx.state === "running") audioCtx.suspend();
                if(dom.volumeIcon) dom.volumeIcon.className = "fa-solid fa-volume-xmark text-secondary";
                if(dom.musicBtn) dom.musicBtn.classList.remove("active");
                resolve();
            }, 800);
        });
    }

    if (dom.musicBtn) {
        dom.musicBtn.addEventListener("click", () => {
            if (isPlaying) stopMelodyWithFade();
            else startMelodyWithFade();
        });
    }
    
    // Auto start if loaded initially unlocked
    if (isUnlocked) {
        startMelodyWithFade();
    }

    // ──────────────────────────────────────────
    // Visual Effects Engines
    // ──────────────────────────────────────────
    let effectsActive = isUnlocked;

    // Confetti
    let ctx, width, height, particles = [];
    if (dom.confettiCanvas) {
        ctx = dom.confettiCanvas.getContext("2d");
        const resizeCanvas = () => {
            width = dom.confettiCanvas.width = window.innerWidth;
            height = dom.confettiCanvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        
        const colors = ["#e91e63", "#ff80ab", "#ffd700", "#ffffff", "#ff4081", "#9c27b0"];
        for (let i = 0; i < 100; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height * -0.5 - 20,
                size: Math.random() * 8 + 6,
                speedY: Math.random() * 4 + 2,
                speedX: (Math.random() - 0.5) * 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10,
                opacity: Math.random() * 0.4 + 0.6
            });
        }
    }
    
    function renderConfetti() {
        if (!effectsActive || !ctx) return;
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.y += p.speedY; p.x += p.speedX; p.rotation += p.rotSpeed;
            if (p.y > height) { p.y = -20; p.x = Math.random() * width; }
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            ctx.restore();
        });
        requestAnimationFrame(renderConfetti);
    }

    // Hearts
    const emojis = ["💖", "💕", "🌹", "💘", "👑", "✨"];
    function spawnHeart() {
        if (!effectsActive || !dom.heartsContainer || dom.heartsContainer.children.length >= 15 || isReducedMotion()) return;
        const heart = document.createElement("div");
        heart.className = "secret-floating-heart";
        heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        heart.style.position = "absolute";
        const startX = Math.random() * (window.innerWidth * 0.95);
        const startY = window.innerHeight + 50;
        const endX = startX + (Math.random() - 0.5) * 120;
        const endY = -60;
        heart.style.fontSize = `${Math.random() * 1.5 + 1.2}rem`;
        heart.style.opacity = `${Math.random() * 0.5 + 0.3}`;
        heart.style.transform = `translate3d(${startX}px, ${startY}px, 0) rotate(${Math.random() * 40 - 20}deg)`;
        const duration = Math.random() * 5 + 6;
        heart.style.transition = `all ${duration}s linear`;

        dom.heartsContainer.appendChild(heart);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                heart.style.transform = `translate3d(${endX}px, ${endY}px, 0) rotate(${Math.random() * 360}deg) scale(1.2)`;
                heart.style.opacity = "0";
            });
        });

        setTimeout(() => { if (heart.parentNode) heart.parentNode.removeChild(heart); }, duration * 1000 + 200);
    }

    let lastSpawn = performance.now();
    function rAFEffects(time) {
        if (!effectsActive) return;
        if (time - lastSpawn >= 600) {
            spawnHeart();
            lastSpawn = time;
        }
        requestAnimationFrame(rAFEffects);
    }

    function startEffects() {
        effectsActive = true;
        if (dom.confettiCanvas) {
            dom.confettiCanvas.classList.remove("hidden");
            renderConfetti();
        }
        if (dom.heartsContainer) {
            dom.heartsContainer.classList.remove("hidden");
            requestAnimationFrame(rAFEffects);
            for (let i = 0; i < 6; i++) setTimeout(spawnHeart, i * 300);
        }
    }
    
    function stopEffects() {
        effectsActive = false;
        if (dom.confettiCanvas) dom.confettiCanvas.classList.add("hidden");
        if (dom.heartsContainer) {
            dom.heartsContainer.classList.add("hidden");
            dom.heartsContainer.innerHTML = "";
        }
    }
    if (isUnlocked) startEffects();

    // ──────────────────────────────────────────
    // Main Flow Controls (Unlock/Relock)
    // ──────────────────────────────────────────
    
    function resetFormState() {
        if (dom.submitBtn) dom.submitBtn.disabled = false;
        if (dom.passInput) dom.passInput.disabled = false;
        if (dom.submitText) dom.submitText.textContent = "Unlock My Heart";
        document.querySelectorAll(".secret-form .alert").forEach(el => el.remove());
    }

    function showError(msg) {
        resetFormState();
        if (!dom.unlockForm) return;
        const errDiv = document.createElement("div");
        errDiv.className = "alert alert-danger glass-alert animate-shake mb-3";
        errDiv.innerHTML = `<i class="fa-solid fa-triangle-exclamation me-2"></i> ${msg}`;
        dom.unlockForm.insertBefore(errDiv, dom.unlockForm.querySelector(".input-group"));
    }

    if (dom.unlockForm) {
        dom.unlockForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (isTransitioning) return;
            isTransitioning = true;

            const password = dom.passInput.value;
            dom.submitBtn.disabled = true;
            dom.passInput.disabled = true;
            dom.submitText.textContent = "Unlocking...";

            // Fetch API check
            let success = false;
            let errorMsg = "Incorrect secret code.";
            try {
                const res = await fetch(dom.unlockForm.action, {
                    method: "POST",
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "application/json",
                        "X-CSRFToken": dom.unlockForm.querySelector("[name=csrfmiddlewaretoken]")?.value || ""
                    },
                    body: JSON.stringify({ password })
                });
                if (!res.ok) throw new Error("Server response not ok");
                const data = await res.json();
                success = data.success;
                if (!success && data.error) errorMsg = data.error;
            } catch (err) {
                console.error("AJAX failed, falling back to standard submission...", err);
                dom.unlockForm.submit();
                return;
            }

            if (!success) {
                showError(errorMsg);
                isTransitioning = false;
                return;
            }

            isUnlocked = true;
            await transitionFadeOut(dom.lockSection);
            
            if (dom.entranceOverlay) {
                dom.unlockedSection.classList.remove("hidden");
                dom.entranceOverlay.classList.remove("hidden", "fade-out");
                dom.entranceOverlay.style.opacity = "1";
                
                await animateLock();
                await transitionFadeOut(dom.entranceOverlay);
            }
            
            await transitionFadeIn(dom.unlockedSection);
            await staggerElementsIn();
            
            startEffects();
            await startMelodyWithFade();

            isTransitioning = false;
        });
    }

    if (dom.relockBtn) {
        dom.relockBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            if (isTransitioning) return;
            isTransitioning = true;
            
            await stopMelodyWithFade();
            stopEffects();

            try {
                await fetch(dom.relockBtn.href, {
                    headers: { "X-Requested-With": "XMLHttpRequest", "Accept": "application/json" }
                });
            } catch (err) { console.warn("Relock sync failed", err); }
            
            isUnlocked = false;

            await transitionFadeOut(dom.unlockedSection);
            
            resetFormState();
            if (dom.passInput) dom.passInput.value = "";
            await transitionFadeIn(dom.lockSection);
            
            if (dom.passInput) dom.passInput.focus();
            
            isTransitioning = false;
        });
    }
});
