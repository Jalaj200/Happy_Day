/* ═══════════════════════════════════════════════════════════
   Forever Us — Final Surprise Interactivity (The Climax)
   ═══════════════════════════════════════════════════════════
   Features:
     1. Stage Transitions (Entrance -> Proposal Reveal -> Celebration)
     2. High-Speed Runaway "NO" Button (Cursor Evasion & Teleportation)
     3. HTML5 Canvas Fireworks & Multi-Colored Confetti Engines
     4. Continuous Floating Hearts Generator
     5. Web Audio API Synthesized Romantic Chimes & Wedding Fanfare
   ═══════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* ──────────────────────────────────────────
       1. STAGE ELEMENTS & INITIALIZATION
       ────────────────────────────────────────── */
    const stageEntrance = document.getElementById("stageEntrance");
    const stageProposal = document.getElementById("stageProposal");
    const stageSuccess = document.getElementById("stageSuccess");

    const triggerBtn = document.getElementById("triggerSurpriseBtn");
    const yesBtn = document.getElementById("yesBtn");
    const alwaysYesBtn = document.getElementById("alwaysYesBtn");
    const noBtn = document.getElementById("runawayNoBtn");
    const replayBtn = document.getElementById("replaySurpriseBtn");

    let isRevealed = false;
    let isSuccess = false;
    let audioCtx = null;
    let melodyTimer = null;
    let intensityMultiplier = 1;

    function transitionStage(fromStage, toStage, callback) {
        if (fromStage) {
            fromStage.style.opacity = "0";
            fromStage.style.transform = "scale(0.95)";
            setTimeout(() => {
                fromStage.style.display = "none";
                if (toStage) {
                    toStage.style.display = "flex";
                    toStage.style.opacity = "0";
                    toStage.style.transform = "scale(1.05)";
                    requestAnimationFrame(() => {
                        toStage.style.opacity = "1";
                        toStage.style.transform = "scale(1)";
                        if (callback) callback();
                    });
                }
            }, 500);
        } else if (toStage) {
            toStage.style.display = "flex";
            toStage.style.opacity = "1";
            toStage.style.transform = "scale(1)";
            if (callback) callback();
        }
    }

    /* ──────────────────────────────────────────
       2. WEB AUDIO API SYNTHESIZER
       ────────────────────────────────────────── */
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }
    }

    function playTone(freq, type = "sine", duration = 1.5, volume = 0.12) {
        if (!audioCtx) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

            gain.gain.setValueAtTime(volume, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.warn("Audio synth error:", e);
        }
    }

    function playRomanticChime() {
        initAudio();
        const chords = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        chords.forEach((note, i) => {
            setTimeout(() => playTone(note, "sine", 2.2, 0.15), i * 180);
        });
    }

    function playDodgeChirp() {
        initAudio();
        playTone(880, "triangle", 0.25, 0.08);
        setTimeout(() => playTone(1174.66, "sine", 0.3, 0.08), 80);
    }

    function playWeddingFanfare() {
        initAudio();
        const fanfare = [
            { f: 523.25, d: 0.3, t: 0 },
            { f: 659.25, d: 0.3, t: 250 },
            { f: 783.99, d: 0.3, t: 500 },
            { f: 1046.50, d: 2.5, t: 750 },
            { f: 880.00, d: 0.4, t: 1200 },
            { f: 1046.50, d: 3.0, t: 1500 },
        ];
        fanfare.forEach((n) => {
            setTimeout(() => playTone(n.f, "triangle", n.d, 0.2), n.t);
        });
    }

    /* ──────────────────────────────────────────
       3. TRIGGER REVEAL CLICKS
       ────────────────────────────────────────── */
    if (triggerBtn) {
        triggerBtn.addEventListener("click", () => {
            if (isRevealed) return;
            isRevealed = true;
            initAudio();
            playRomanticChime();

            transitionStage(stageEntrance, stageProposal, () => {
                startConfettiEngine();
                startFireworksEngine();
                startFloatingHearts();
            });
        });
    }

    /* ──────────────────────────────────────────
       4. THE NO BUTTON → PROGRESSIVE DIALOG
       ────────────────────────────────────────── */
    if (noBtn) {
        const dialog = document.getElementById("proposalConfirmDialog");
        const dialogMessage = document.getElementById("dialogMessage");
        const dialogPrimaryBtn = document.getElementById("dialogPrimaryBtn");
        const dialogSecondaryBtn = document.getElementById("dialogSecondaryBtn");
        
        let confirmStage = 1;

        function updateDialogContent() {
            if (confirmStage === 1) {
                dialogMessage.innerHTML = "Are you sure? 🥺❤️";
                dialogPrimaryBtn.innerHTML = "Yes ❤️";
                dialogSecondaryBtn.innerHTML = "No 💔";
                dialogSecondaryBtn.style.display = "block";
            } else if (confirmStage === 2) {
                dialogMessage.innerHTML = "Are you really sure? 🥹💕";
                dialogPrimaryBtn.innerHTML = "Yes ❤️";
                dialogSecondaryBtn.innerHTML = "Still No 💔";
                dialogSecondaryBtn.style.display = "block";
            } else if (confirmStage === 3) {
                dialogMessage.innerHTML = "There is no option... You have to say Yes! ❤️😊";
                dialogPrimaryBtn.innerHTML = "Okay ❤️";
                dialogSecondaryBtn.style.display = "none";
            }
        }

        // Open Dialog 1 when No button on proposal page is clicked
        noBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (isSuccess || !isRevealed) return;
            
            confirmStage = 1;
            updateDialogContent();
            
            if (dialog) {
                dialog.showModal();
                // Focus the primary button automatically for accessibility
                dialogPrimaryBtn.focus();
            }
        });

        if (dialog && dialogPrimaryBtn && dialogSecondaryBtn) {
            // Handle primary button click (Yes / Okay)
            dialogPrimaryBtn.addEventListener("click", () => {
                dialog.close();
                // On stage 3, "Okay ❤️" triggers the full acceptance celebration
                if (confirmStage === 3) {
                    handleYesClick();
                }
            });

            // Handle secondary button click (No / Still No)
            dialogSecondaryBtn.addEventListener("click", () => {
                if (confirmStage < 3) {
                    confirmStage++;
                    dialog.close();
                    
                    // Wait for the close animation/event before reopening
                    // We can use a short requestAnimationFrame sequence to ensure the browser registers the close
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            updateDialogContent();
                            dialog.showModal();
                            dialogPrimaryBtn.focus();
                        });
                    });
                }
            });
            
            // Restore focus when dialog fully closes
            dialog.addEventListener("close", () => {
                // Only restore focus if we are fully closing back to the proposal page
                // If it's closed just to immediately reopen for the next stage, focus will be hijacked by the new showModal()
                // If `dialog.open` is false after a short delay, it means it's truly closed.
                setTimeout(() => {
                    if (!dialog.open) {
                        noBtn.focus();
                    }
                }, 50);
            });
        }
    }

    /* ──────────────────────────────────────────
       5. SUCCESS CELEBRATION (CLICKING YES)
       ────────────────────────────────────────── */
    function handleYesClick() {
        if (isSuccess) return;
        isSuccess = true;
        intensityMultiplier = 3; // Triple fireworks & confetti!

        if (noBtn) noBtn.style.display = "none";
        playWeddingFanfare();

        transitionStage(stageProposal, stageSuccess, () => {
            // Extra celebratory burst
            for (let i = 0; i < 15; i++) {
                setTimeout(spawnFirework, i * 150);
            }
        });
    }

    if (yesBtn) yesBtn.addEventListener("click", handleYesClick);
    if (alwaysYesBtn) alwaysYesBtn.addEventListener("click", handleYesClick);

    /* ──────────────────────────────────────────
       6. REPLAY SURPRISE BUTTON
       ────────────────────────────────────────── */
    if (replayBtn) {
        replayBtn.addEventListener("click", () => {
            isSuccess = false;
            isRevealed = false;
            intensityMultiplier = 1;
            if (noBtn) {
                noBtn.style.display = "inline-block";
                noBtn.classList.remove("is-running");
                noBtn.style.left = "auto";
                noBtn.style.top = "auto";
            }
            transitionStage(stageSuccess, stageEntrance);
        });
    }

    /* ──────────────────────────────────────────
       7. CANVAS CONFETTI ENGINE
       ────────────────────────────────────────── */
    let confettiStarted = false;
    function startConfettiEngine() {
        if (confettiStarted) return;
        confettiStarted = true;
        const canvas = document.getElementById("surpriseConfettiCanvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const colors = ["#e91e63", "#ff80ab", "#ffd700", "#ffffff", "#ff4081", "#9c27b0", "#00e676"];

        class Confetti {
            constructor() {
                this.reset();
                this.y = Math.random() * height * -1;
            }
            reset() {
                this.x = Math.random() * width;
                this.y = -20;
                this.size = Math.random() * 9 + 6;
                this.speedY = (Math.random() * 4 + 2.5) * (intensityMultiplier > 1 ? 1.5 : 1);
                this.speedX = (Math.random() - 0.5) * 4;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.rotation = Math.random() * 360;
                this.rotSpeed = (Math.random() - 0.5) * 12;
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

        for (let i = 0; i < 110; i++) particles.push(new Confetti());

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
       8. CANVAS FIREWORKS ENGINE
       ────────────────────────────────────────── */
    let fireworksStarted = false;
    const fireworks = [];
    const sparks = [];

    function spawnFirework() {
        const canvas = document.getElementById("surpriseFireworksCanvas");
        if (!canvas || (!isRevealed && !isSuccess)) return;
        const width = canvas.width;
        const height = canvas.height;

        const targetX = Math.random() * (width * 0.8) + width * 0.1;
        const targetY = Math.random() * (height * 0.5) + height * 0.15;
        const colors = ["#ff0055", "#00ffff", "#ffff00", "#ff00ff", "#00ff66", "#ff80ab", "#ffd700"];
        const color = colors[Math.floor(Math.random() * colors.length)];

        fireworks.push({
            x: targetX,
            y: height,
            targetX: targetX,
            targetY: targetY,
            speed: 8,
            color: color,
            radius: 3,
        });
    }

    function startFireworksEngine() {
        if (fireworksStarted) return;
        fireworksStarted = true;
        const canvas = document.getElementById("surpriseFireworksCanvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        let lastFwSpawn = performance.now();
        function rAFFireworkLoop(time) {
            if (time - lastFwSpawn >= 900) {
                if (isRevealed && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                    const count = intensityMultiplier > 1 ? 3 : 1;
                    for (let i = 0; i < count; i++) spawnFirework();
                }
                lastFwSpawn = time;
            }
            requestAnimationFrame(rAFFireworkLoop);
        }
        requestAnimationFrame(rAFFireworkLoop);
        for (let i = 0; i < 4; i++) setTimeout(spawnFirework, i * 300);

        function renderFireworks() {
            ctx.clearRect(0, 0, width, height);

            // Update & draw launching rockets
            for (let i = fireworks.length - 1; i >= 0; i--) {
                const fw = fireworks[i];
                const dx = fw.targetX - fw.x;
                const dy = fw.targetY - fw.y;
                const dist = Math.hypot(dx, dy);

                if (dist < 15) {
                    // Explode into sparks!
                    const sparkCount = intensityMultiplier > 1 ? 80 : 50;
                    for (let s = 0; s < sparkCount; s++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = Math.random() * 6 + 2;
                        sparks.push({
                            x: fw.x,
                            y: fw.y,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed,
                            color: fw.color,
                            alpha: 1,
                            decay: Math.random() * 0.02 + 0.015,
                            size: Math.random() * 3 + 1.5,
                        });
                    }
                    fireworks.splice(i, 1);
                } else {
                    fw.x += (dx / dist) * fw.speed;
                    fw.y += (dy / dist) * fw.speed;
                    ctx.beginPath();
                    ctx.arc(fw.x, fw.y, fw.radius, 0, Math.PI * 2);
                    ctx.fillStyle = fw.color;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = fw.color;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }

            // Update & draw exploding sparks
            for (let i = sparks.length - 1; i >= 0; i--) {
                const sp = sparks[i];
                sp.x += sp.vx;
                sp.y += sp.vy;
                sp.vy += 0.08; // Gravity
                sp.vx *= 0.98; // Air resistance
                sp.alpha -= sp.decay;

                if (sp.alpha <= 0) {
                    sparks.splice(i, 1);
                } else {
                    ctx.save();
                    ctx.globalAlpha = sp.alpha;
                    ctx.beginPath();
                    ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
                    ctx.fillStyle = sp.color;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = sp.color;
                    ctx.fill();
                    ctx.restore();
                }
            }

            requestAnimationFrame(renderFireworks);
        }
        renderFireworks();
    }

    /* ──────────────────────────────────────────
       9. FLOATING HEARTS GENERATOR
       ────────────────────────────────────────── */
    let heartsStarted = false;
    function startFloatingHearts() {
        if (heartsStarted) return;
        heartsStarted = true;
        const container = document.getElementById("surpriseHeartsContainer");
        if (!container) return;
        const emojis = ["💖", "💕", "🌹", "💘", "👑", "✨", "💍", "🥰"];

        function spawnHeart() {
            if (!isRevealed || !container || container.children.length >= 15 || window.matchMedia("(prefers-reduced-motion: reduce)").matches || (window.isContainerVisible && !window.isContainerVisible(container))) return;
            const heart = document.createElement("div");
            heart.className = "surprise-floating-heart";
            heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            heart.style.position = "absolute";
            heart.style.left = "0px";
            heart.style.top = "0px";
            const startX = Math.random() * (window.innerWidth * 0.92);
            const startY = window.innerHeight + 50;
            const endX = startX + (Math.random() - 0.5) * 150;
            const endY = -80;
            heart.style.fontSize = `${Math.random() * 1.8 + 1.2}rem`;
            heart.style.opacity = `${Math.random() * 0.6 + 0.4}`;
            heart.style.transform = `translate3d(${startX}px, ${startY}px, 0) rotate(${Math.random() * 40 - 20}deg)`;
            const duration = Math.random() * 5 + 5;
            heart.style.transition = `all ${duration}s linear`;

            container.appendChild(heart);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    heart.style.transform = `translate3d(${endX}px, ${endY}px, 0) rotate(${Math.random() * 360}deg) scale(1.3)`;
                    heart.style.opacity = "0";
                });
            });

            setTimeout(() => {
                if (heart.parentNode) heart.parentNode.removeChild(heart);
            }, duration * 1000 + 200);
        }

        let lastHeartSpawn = performance.now();
        function rAFSurpriseHeartLoop(time) {
            if (time - lastHeartSpawn >= 550) {
                const count = intensityMultiplier > 1 ? 2 : 1;
                for (let i = 0; i < count; i++) spawnHeart();
                lastHeartSpawn = time;
            }
            requestAnimationFrame(rAFSurpriseHeartLoop);
        }
        requestAnimationFrame(rAFSurpriseHeartLoop);
        for (let i = 0; i < 6; i++) setTimeout(spawnHeart, i * 250);
    }
});
