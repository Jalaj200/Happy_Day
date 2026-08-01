/* ═══════════════════════════════════════════════════════════
   Forever Us — Girlfriend's Day Countdown Interactivity
   ═══════════════════════════════════════════════════════════
   Features:
     1. Live countdown loop (Days, Hours, Minutes, Seconds) with pop animations
     2. Automatic celebration trigger when countdown reaches 00:00:00:00
     3. Interactive simulation ("Test Celebration Now" & "Reset Timer")
     4. High-performance HTML5 Canvas Fireworks engine
     5. HTML5 Canvas Confetti generator
     6. Floating hearts DOM generator
   ═══════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const daysEl = document.getElementById("daysEl");
    const hoursEl = document.getElementById("hoursEl");
    const minutesEl = document.getElementById("minutesEl");
    const secondsEl = document.getElementById("secondsEl");
    const timerStatusText = document.getElementById("timerStatusText");
    
    const simulateBtn = document.getElementById("simulateBtn");
    const resetTimerBtn = document.getElementById("resetTimerBtn");
    const closeCelebrationBtn = document.getElementById("closeCelebrationBtn");
    const celebrationScreen = document.getElementById("celebrationScreen");
    const celebrationHearts = document.getElementById("celebrationHearts");

    // 1. Get countdown config from Django JSON script
    let config = {
        target_date_iso: "2026-08-01T00:00:00",
        celebration_title: "Happy Girlfriend's Day! 💖✨",
        celebration_message: "Today and every day, I celebrate YOU! You are my sunshine, my greatest blessing, and my forever love."
    };
    
    const configEl = document.getElementById("countdown-config");
    if (configEl) {
        try {
            const parsed = JSON.parse(configEl.textContent);
            if (parsed && parsed.target_date_iso) {
                config = parsed;
            }
        } catch (e) {
            console.error("Error parsing countdown config:", e);
        }
    }

    let targetDate = new Date(config.target_date_iso);
    if (isNaN(targetDate.getTime())) {
        targetDate = new Date("2026-08-01T00:00:00");
    }

    let countdownInterval = null;
    let isCelebrating = false;
    let fireworksId = null;
    let confettiId = null;
    let heartsInterval = null;

    let prevDays = -1;
    let prevHours = -1;
    let prevMinutes = -1;
    let prevSeconds = -1;

    // ──────────────────────────────────────────
    // DYNAMIC STATUS MESSAGES & GREETINGS
    // ──────────────────────────────────────────
    const statusMessages = [
        "💙 Every heartbeat brings us closer.",
        "✨ Only a little longer until your special day.",
        "🌸 Every second brings me closer to celebrating you.",
        "💖 Time keeps moving, but my love only grows stronger.",
        "💌 Counting down to another beautiful memory together.",
        "❤️ Every moment is worth waiting for.",
        "🌙 Another day closer to making you smile.",
        "✨ Forever begins with moments like these."
    ];
    let currentStatusMsgIndex = -1;
    let statusInterval = null;

    function getTimeBasedGreeting() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "☀️ Good morning, beautiful.";
        if (hour >= 12 && hour < 17) return "🌸 Hope your day is as lovely as your smile.";
        if (hour >= 17 && hour < 22) return "🌙 Another beautiful sunset brings us closer.";
        return "✨ Sleep peacefully. Tomorrow brings us one step closer.";
    }

    function rotateStatusMessage() {
        if (isCelebrating || !timerStatusText) return;
        
        currentStatusMsgIndex++;
        let msg = "";
        
        if (currentStatusMsgIndex % 3 === 0) {
            msg = getTimeBasedGreeting();
        } else {
            const index = (currentStatusMsgIndex % statusMessages.length);
            msg = statusMessages[index];
        }

        timerStatusText.classList.add("fade-out");
        
        setTimeout(() => {
            if (isCelebrating) return;
            timerStatusText.textContent = msg;
            
            setTimeout(() => {
                if (isCelebrating) return;
                timerStatusText.classList.remove("fade-out");
            }, 300);
            
        }, 800);
    }

    function startStatusRotation() {
        if (statusInterval) clearInterval(statusInterval);
        if (!timerStatusText) return;
        timerStatusText.classList.remove("fade-out", "fade-in-start");
        statusInterval = setInterval(rotateStatusMessage, 10000);
    }


    /* ──────────────────────────────────────────
       1. LIVE COUNTDOWN TIMER LOOP
       ────────────────────────────────────────── */
    function updateCountdown() {
        if (isCelebrating) return;

        const now = new Date().getTime();
        const diff = targetDate.getTime() - now;

        if (diff <= 0) {
            // Countdown reached zero! Trigger celebration!
            setNumberWithPop(daysEl, "00", prevDays !== 0);
            setNumberWithPop(hoursEl, "00", prevHours !== 0);
            setNumberWithPop(minutesEl, "00", prevMinutes !== 0);
            setNumberWithPop(secondsEl, "00", prevSeconds !== 0);
            
            if (timerStatusText) {
                timerStatusText.textContent = "Girlfriend's Day is here! 🎉💖";
            }
            
            startCelebration();
            return;
        }

        // Calculate time units
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Format leading zeros
        const daysStr = String(days).padStart(2, "0");
        const hoursStr = String(hours).padStart(2, "0");
        const minStr = String(minutes).padStart(2, "0");
        const secStr = String(seconds).padStart(2, "0");

        // Update DOM with slide/fade transition and subtle alive animations
        if (days !== prevDays) {
            setNumberWithPop(daysEl, daysStr, prevDays !== -1);
            if (prevDays !== -1) triggerDaysHeartBurst(daysEl);
            prevDays = days;
        }
        if (hours !== prevHours) {
            setNumberWithPop(hoursEl, hoursStr, prevHours !== -1);
            if (prevHours !== -1) triggerCardAnimation(hoursEl, "hour-pulse", 1500);
            prevHours = hours;
        }
        if (minutes !== prevMinutes) {
            setNumberWithPop(minutesEl, minStr, prevMinutes !== -1);
            if (prevMinutes !== -1) triggerCardAnimation(minutesEl, "shimmer", 1000);
            prevMinutes = minutes;
        }
        if (seconds !== prevSeconds) {
            setNumberWithPop(secondsEl, secStr, prevSeconds !== -1);
            prevSeconds = seconds;
        }
    }

    function setNumberWithPop(element, text, animate) {
        if (!element) return;
        
        if (animate) {
            element.classList.remove("pop-tick");
            void element.offsetWidth; // Trigger reflow
            element.textContent = text;
            element.classList.add("pop-tick");
            setTimeout(() => {
                element.classList.remove("pop-tick");
            }, 400);
        } else {
            element.textContent = text;
        }
    }

    function triggerCardAnimation(textElement, className, duration) {
        const box = textElement.closest('.time-box');
        if (!box) return;
        box.classList.remove(className);
        void box.offsetWidth;
        box.classList.add(className);
        setTimeout(() => box.classList.remove(className), duration);
    }

    function triggerDaysHeartBurst(textElement) {
        const box = textElement.closest('.time-box');
        if (!box) return;
        const rect = box.getBoundingClientRect();
        const x = rect.width / 2;
        const y = rect.height / 2;
        
        for (let i = 0; i < 3; i++) {
            const span = document.createElement("span");
            span.textContent = "💖";
            span.style.position = "absolute";
            span.style.left = `${x}px`;
            span.style.top = `${y}px`;
            span.style.fontSize = "1.2rem";
            span.style.pointerEvents = "none";
            span.style.zIndex = "20";
            span.style.transition = "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
            span.style.opacity = "1";
            box.appendChild(span);

            const angle = Math.random() * Math.PI * 2;
            const distance = 20 + Math.random() * 30;
            const destX = x + Math.cos(angle) * distance;
            const destY = y + Math.sin(angle) * distance - 20;

            requestAnimationFrame(() => {
                span.style.transform = `translate(${destX - x}px, ${destY - y}px) scale(0.5)`;
                span.style.opacity = "0";
            });

            setTimeout(() => {
                if (span.parentNode) span.parentNode.removeChild(span);
            }, 800);
        }
    }

    /* ──────────────────────────────────────────
       SUBTLE ROSE PETAL GENERATOR
       ────────────────────────────────────────── */
    const petalSVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="M50 90 C 20 90, 10 60, 20 30 C 30 10, 70 10, 80 30 C 90 60, 80 90, 50 90 Z" fill="url(#petalGradient)" opacity="0.65"/><defs><linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff758c"/><stop offset="100%" stop-color="#ff7eb3"/></linearGradient></defs></svg>`;
    
    let petalInterval = null;
    
    function startFloatingPetals() {
        if (petalInterval) clearInterval(petalInterval);
        
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) return;

        const timerSection = document.getElementById("timerSection");
        if (!timerSection) return;
        
        let petalContainer = document.getElementById("petalContainer");
        if (!petalContainer) {
            petalContainer = document.createElement("div");
            petalContainer.id = "petalContainer";
            petalContainer.style.position = "absolute";
            petalContainer.style.inset = "0";
            petalContainer.style.pointerEvents = "none";
            petalContainer.style.overflow = "hidden";
            petalContainer.style.zIndex = "1";
            timerSection.appendChild(petalContainer);
            timerSection.style.position = "relative";
        }
        
        petalInterval = setInterval(() => {
            if (isCelebrating || prefersReducedMotion.matches) return;
            if (petalContainer.childElementCount >= 5) return;
            
            const petal = document.createElement("div");
            petal.innerHTML = petalSVG;
            petal.style.position = "absolute";
            petal.style.top = "-30px";
            petal.style.left = `${Math.random() * 100}%`;
            petal.style.opacity = "0";
            petal.style.transform = `translate3d(0, 0, 0) rotate3d(1, 1, 1, 0deg)`;
            
            const duration = 12000 + Math.random() * 8000;
            petal.style.transition = `transform ${duration}ms linear, opacity ${duration/4}ms ease-in-out`;
            
            petalContainer.appendChild(petal);
            void petal.offsetWidth;
            
            const destY = timerSection.offsetHeight + 50;
            const destX = (Math.random() - 0.5) * 150;
            const destRotate = Math.random() * 360;
            
            petal.style.opacity = "1";
            petal.style.transform = `translate3d(${destX}px, ${destY}px, 0) rotate3d(1, 1, 1, ${destRotate}deg)`;
            
            setTimeout(() => { petal.style.opacity = "0"; }, duration * 0.75);
            setTimeout(() => { if (petal.parentNode) petal.parentNode.removeChild(petal); }, duration);
            
        }, 3000);
    }

    function startLiveTimer() {
        stopCelebration();
        isCelebrating = false;
        
        if (simulateBtn) simulateBtn.style.display = "inline-flex";
        if (resetTimerBtn) resetTimerBtn.style.display = "none";
        if (timerStatusText) {
            timerStatusText.textContent = `Counting down to ${targetDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}...`;
        }

        if (countdownInterval) clearInterval(countdownInterval);
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
        
        startStatusRotation();
        startFloatingPetals();
    }


    /* ──────────────────────────────────────────
       2. CELEBRATION OVERLAY & SIMULATION
       ────────────────────────────────────────── */
    function startCelebration() {
        if (isCelebrating) return;
        isCelebrating = true;
        if (countdownInterval) clearInterval(countdownInterval);
        if (statusInterval) clearInterval(statusInterval);

        if (simulateBtn) simulateBtn.style.display = "none";
        if (resetTimerBtn) resetTimerBtn.style.display = "inline-flex";
        if (timerStatusText) timerStatusText.textContent = "✨ Celebrating Girlfriend's Day! ✨";

        const celebrateAgainWrapper = document.getElementById("celebrateAgainWrapper");
        if (celebrateAgainWrapper) celebrateAgainWrapper.style.display = "block";

        if (celebrationScreen) {
            celebrationScreen.style.display = "flex";
            celebrationScreen.setAttribute("aria-hidden", "false");
        }

        // Launch engines
        startFireworks();
        startConfetti();
        startFloatingHearts();
    }

    function stopCelebration() {
        isCelebrating = false; // Prevent memory leaks in rAF loops
        if (fireworksId) cancelAnimationFrame(fireworksId);
        if (confettiId) cancelAnimationFrame(confettiId);
        if (heartsInterval) clearInterval(heartsInterval);
        if (petalInterval) clearInterval(petalInterval);
        
        if (celebrationHearts) celebrationHearts.innerHTML = "";
        const petalContainer = document.getElementById("petalContainer");
        if (petalContainer) petalContainer.innerHTML = "";
        
        // Clear canvases directly for immediate cleanup
        const fCanvas = document.getElementById("fireworksCanvas");
        if (fCanvas) fCanvas.getContext("2d").clearRect(0, 0, fCanvas.width, fCanvas.height);
        const cCanvas = document.getElementById("confettiCanvas");
        if (cCanvas) cCanvas.getContext("2d").clearRect(0, 0, cCanvas.width, cCanvas.height);

        if (celebrationScreen) {
            // Apply a quick fade out transition before hiding
            celebrationScreen.style.transition = "opacity 0.5s ease";
            celebrationScreen.style.opacity = "0";
            setTimeout(() => {
                celebrationScreen.style.display = "none";
                celebrationScreen.style.opacity = "";
                celebrationScreen.style.transition = "";
                celebrationScreen.setAttribute("aria-hidden", "true");
            }, 500);
        }
    }

    if (simulateBtn) {
        simulateBtn.addEventListener("click", () => {
            // Set digits to 00 and launch celebration
            setNumberWithPop(daysEl, "00", true);
            setNumberWithPop(hoursEl, "00", true);
            setNumberWithPop(minutesEl, "00", true);
            setNumberWithPop(secondsEl, "00", true);
            startCelebration();
            
            const celebrateAgainWrapper = document.getElementById("celebrateAgainWrapper");
            if (celebrateAgainWrapper) celebrateAgainWrapper.style.display = "block";
        });
    }

    if (resetTimerBtn) {
        resetTimerBtn.addEventListener("click", () => {
            startLiveTimer();
            const celebrateAgainWrapper = document.getElementById("celebrateAgainWrapper");
            if (celebrateAgainWrapper) celebrateAgainWrapper.style.display = "none";
        });
    }

    if (closeCelebrationBtn) {
        closeCelebrationBtn.addEventListener("click", () => {
            stopCelebration();
        });
    }

    // --- CELEBRATE AGAIN FEATURE ---
    const celebrateAgainBtn = document.getElementById("celebrateAgainBtn");
    if (celebrateAgainBtn) {
        celebrateAgainBtn.addEventListener("click", () => {
            celebrateAgainBtn.disabled = true;
            celebrateAgainBtn.innerHTML = "❤️ Replaying the celebration...";
            
            window.scrollTo({ top: 0, behavior: "smooth" });
            
            // Handle Music Reset while preserving user preferences
            const audio = document.getElementById("bgMusic");
            if (audio) {
                const prevVol = audio.volume;
                const prevMute = audio.muted;
                audio.currentTime = 0;
                
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => { /* Respect autoplay restrictions */ });
                }
                
                // Restore settings
                audio.volume = prevVol;
                audio.muted = prevMute;
            }

            // Stop any currently running celebration and reset
            stopCelebration();
            
            // Short delay to let DOM settle, then restart
            setTimeout(() => {
                startCelebration();
                
                // Replay CSS Entrance Animations
                const animClasses = [".animate-fade-in", ".animate-card-entrance", ".reveal-scale", ".navbar"];
                const elements = document.querySelectorAll(animClasses.join(", "));
                let longestDuration = 0;
                let longestElement = null;

                elements.forEach(el => {
                    // Temporarily remove classes to reset animation
                    const hadFade = el.classList.contains("animate-fade-in");
                    const hadCard = el.classList.contains("animate-card-entrance");
                    const hadReveal = el.classList.contains("reveal-scale");
                    
                    if (hadFade) el.classList.remove("animate-fade-in");
                    if (hadCard) el.classList.remove("animate-card-entrance");
                    if (hadReveal) el.classList.remove("reveal-scale");

                    // Trigger reflow
                    void el.offsetWidth;
                    
                    // Re-add classes
                    if (hadFade) el.classList.add("animate-fade-in");
                    if (hadCard) el.classList.add("animate-card-entrance");
                    if (hadReveal) el.classList.add("reveal-scale");
                    
                    // Dynamically calculate the longest animation to re-enable the button safely
                    const computedStyle = window.getComputedStyle(el);
                    const duration = parseFloat(computedStyle.animationDuration || "0") * 1000;
                    const delay = parseFloat(computedStyle.animationDelay || "0") * 1000;
                    if (duration + delay > longestDuration) {
                        longestDuration = duration + delay;
                        longestElement = el;
                    }
                });

                // Re-enable button after longest animation completes
                const enableBtn = () => {
                    celebrateAgainBtn.innerHTML = "💖 Celebrate Again";
                    celebrateAgainBtn.disabled = false;
                    if (longestElement) {
                        longestElement.removeEventListener("animationend", enableBtn);
                    }
                };

                if (longestElement && longestDuration > 0) {
                    longestElement.addEventListener("animationend", enableBtn, { once: true });
                    // Fallback timeout in case event is missed
                    setTimeout(enableBtn, longestDuration + 500);
                } else {
                    setTimeout(enableBtn, 2000);
                }
                
            }, 500);
        });
    }

    // Start timer on page load
    startLiveTimer();


    /* ──────────────────────────────────────────
       3. CANVAS FIREWORKS ENGINE
       ────────────────────────────────────────── */
    function startFireworks() {
        const canvas = document.getElementById("fireworksCanvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        if (!canvas.dataset.resizeBound) {
            window.addEventListener("resize", () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                const cCanvas = document.getElementById("confettiCanvas");
                if (cCanvas) {
                    cCanvas.width = window.innerWidth;
                    cCanvas.height = window.innerHeight;
                }
            });
            canvas.dataset.resizeBound = "true";
        }

        const particles = [];
        const colors = [
            "hsl(340, 100%, 60%)", // Rose
            "hsl(50, 100%, 55%)",  // Gold
            "hsl(310, 100%, 65%)", // Magenta
            "hsl(0, 100%, 65%)",   // Red
            "hsl(280, 100%, 70%)"  // Violet
        ];

        function createBurst(x, y) {
            const count = 55 + Math.floor(Math.random() * 25);
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 2 + Math.random() * 6;
                particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color: color,
                    alpha: 1,
                    decay: 0.012 + Math.random() * 0.015,
                    size: 2 + Math.random() * 2.5
                });
            }
        }

        // Create random fireworks bursts via rAF loop instead of setInterval
        let lastBurstTime = performance.now();
        function rAFBurstLoop(time) {
            if (!isCelebrating) return;
            if (time - lastBurstTime >= 650) {
                if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                    const x = 100 + Math.random() * (canvas.width - 200);
                    const y = 80 + Math.random() * (canvas.height * 0.5);
                    createBurst(x, y);
                }
                lastBurstTime = time;
            }
            requestAnimationFrame(rAFBurstLoop);
        }
        requestAnimationFrame(rAFBurstLoop);

        // Initial burst
        createBurst(canvas.width * 0.3, canvas.height * 0.35);
        createBurst(canvas.width * 0.7, canvas.height * 0.35);

        function renderFireworks() {
            if (!isCelebrating) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }

            // Trailing fade effect
            ctx.fillStyle = "rgba(15, 2, 25, 0.18)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.08; // Gravity
                p.vx *= 0.98; // Air resistance
                p.alpha -= p.decay;

                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 8;
                ctx.shadowColor = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            fireworksId = requestAnimationFrame(renderFireworks);
        }

        renderFireworks();
    }


    /* ──────────────────────────────────────────
       4. CANVAS CONFETTI ENGINE
       ────────────────────────────────────────── */
    function startConfetti() {
        const canvas = document.getElementById("confettiCanvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const confettiCount = 130;
        const confetti = [];
        const colors = ["#ff4081", "#ffd700", "#e91e63", "#f8bbd0", "#ffffff", "#ea80fc"];

        for (let i = 0; i < confettiCount; i++) {
            confetti.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                w: 6 + Math.random() * 8,
                h: 10 + Math.random() * 12,
                color: colors[Math.floor(Math.random() * colors.length)],
                vy: 2 + Math.random() * 3.5,
                vx: -1.5 + Math.random() * 3,
                angle: Math.random() * 360,
                vAngle: -3 + Math.random() * 6
            });
        }

        function renderConfetti() {
            if (!isCelebrating) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < confetti.length; i++) {
                const c = confetti[i];
                c.y += c.vy;
                c.x += Math.sin(c.angle * Math.PI / 180) * 1.5;
                c.angle += c.vAngle;

                if (c.y > canvas.height) {
                    c.y = -20;
                    c.x = Math.random() * canvas.width;
                }

                ctx.save();
                ctx.translate(c.x, c.y);
                ctx.rotate(c.angle * Math.PI / 180);
                ctx.fillStyle = c.color;
                ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
                ctx.restore();
            }

            confettiId = requestAnimationFrame(renderConfetti);
        }

        renderConfetti();
    }


    /* ──────────────────────────────────────────
       5. FLOATING CELEBRATION HEARTS
       ────────────────────────────────────────── */
    function startFloatingHearts() {
        if (!celebrationHearts) return;

        const emojis = ["💖", "👑", "🌹", "✨", "💕", "💘", "🎉"];

        function spawnHeart() {
            if (!isCelebrating || !celebrationHearts || celebrationHearts.children.length >= 15 || window.matchMedia("(prefers-reduced-motion: reduce)").matches || (window.isContainerVisible && !window.isContainerVisible(celebrationHearts))) return;
            
            const heart = document.createElement("span");
            heart.className = "floating-petal"; // Reuse smooth fall/float keyframe
            heart.style.position = "absolute";
            heart.style.bottom = "-50px";
            heart.style.top = "auto";
            heart.style.left = `${Math.random() * 95}%`;
            heart.style.fontSize = `${1.5 + Math.random() * 1.5}rem`;
            heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

            // Float upward animation
            const duration = 6 + Math.random() * 5;
            heart.style.transition = `transform ${duration}s linear, opacity ${duration}s ease`;
            
            celebrationHearts.appendChild(heart);

            requestAnimationFrame(() => {
                heart.style.transform = `translate3d(0, -${window.innerHeight + 100}px, 0) rotate(${Math.random() * 360}deg)`;
                heart.style.opacity = "0";
            });

            setTimeout(() => {
                if (heart.parentNode) heart.parentNode.removeChild(heart);
            }, duration * 1000 + 100);
        }

        spawnHeart();
        let lastHeartTime = performance.now();
        function rAFCountdownHeartLoop(time) {
            if (!isCelebrating) return;
            if (time - lastHeartTime >= 500) {
                spawnHeart();
                lastHeartTime = time;
            }
            requestAnimationFrame(rAFCountdownHeartLoop);
        }
        requestAnimationFrame(rAFCountdownHeartLoop);
        for (let i = 0; i < 6; i++) {
            setTimeout(spawnHeart, i * 200);
        }
    }
});
