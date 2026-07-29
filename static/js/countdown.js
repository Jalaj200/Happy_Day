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

    // Previous values to animate only changed numbers
    let prevDays = -1;
    let prevHours = -1;
    let prevMinutes = -1;
    let prevSeconds = -1;


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

        // Update DOM with micro pop animation on change
        if (days !== prevDays) {
            setNumberWithPop(daysEl, daysStr, prevDays !== -1);
            prevDays = days;
        }
        if (hours !== prevHours) {
            setNumberWithPop(hoursEl, hoursStr, prevHours !== -1);
            prevHours = hours;
        }
        if (minutes !== prevMinutes) {
            setNumberWithPop(minutesEl, minStr, prevMinutes !== -1);
            prevMinutes = minutes;
        }
        if (seconds !== prevSeconds) {
            setNumberWithPop(secondsEl, secStr, prevSeconds !== -1);
            prevSeconds = seconds;
        }
    }

    function setNumberWithPop(element, text, animate) {
        if (!element) return;
        element.textContent = text;
        if (animate) {
            element.classList.remove("pop-tick");
            void element.offsetWidth; // Trigger reflow
            element.classList.add("pop-tick");
            setTimeout(() => {
                element.classList.remove("pop-tick");
            }, 300);
        }
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
    }


    /* ──────────────────────────────────────────
       2. CELEBRATION OVERLAY & SIMULATION
       ────────────────────────────────────────── */
    function startCelebration() {
        if (isCelebrating) return;
        isCelebrating = true;
        if (countdownInterval) clearInterval(countdownInterval);

        if (simulateBtn) simulateBtn.style.display = "none";
        if (resetTimerBtn) resetTimerBtn.style.display = "inline-flex";
        if (timerStatusText) timerStatusText.textContent = "✨ Celebrating Girlfriend's Day! ✨";

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
        if (fireworksId) cancelAnimationFrame(fireworksId);
        if (confettiId) cancelAnimationFrame(confettiId);
        if (heartsInterval) clearInterval(heartsInterval);
        
        if (celebrationHearts) celebrationHearts.innerHTML = "";
        if (celebrationScreen) {
            celebrationScreen.style.display = "none";
            celebrationScreen.setAttribute("aria-hidden", "true");
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
        });
    }

    if (resetTimerBtn) {
        resetTimerBtn.addEventListener("click", () => {
            startLiveTimer();
        });
    }

    if (closeCelebrationBtn) {
        closeCelebrationBtn.addEventListener("click", () => {
            stopCelebration();
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

        window.addEventListener("resize", () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

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
