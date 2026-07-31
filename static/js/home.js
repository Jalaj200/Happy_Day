/* ═══════════════════════════════════════════════════════════
   Forever Us — Home Page Interactivity
   ═══════════════════════════════════════════════════════════
   Features:
     1. Cinematic entrance animations (staggered)
     2. Typing effect with multiple phrases
     3. Floating hearts generator
     4. Scroll indicator click handler
     5. Card tilt effect on hover
   ═══════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* ──────────────────────────────────────────
       1. CINEMATIC ENTRANCE ANIMATIONS
       ────────────────────────────────────────── */
    const entranceElements = document.querySelectorAll(".animate-entrance");
    const STAGGER_DELAY = 300; // ms between each element
    const INITIAL_DELAY = 400; // ms before first element animates

    entranceElements.forEach((el) => {
        const delayIndex = parseInt(el.getAttribute("data-delay") || "0", 10);
        const totalDelay = INITIAL_DELAY + delayIndex * STAGGER_DELAY;

        setTimeout(() => {
            el.classList.add("animated");
        }, totalDelay);
    });


    /* ──────────────────────────────────────────
       2. TYPING EFFECT
       ────────────────────────────────────────── */
    const typingTextEl = document.getElementById("typingText");
    const typingCursorEl = document.getElementById("typingCursor");

    // Romantic phrases to cycle through
    const phrases = [
        "Every beautiful memory begins with you.",
        "You are my forever and always.",
        "My heart chose you, and it always will.",
        "With you, every day is Valentine's Day.",
        "You are the reason I believe in love.",
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    // Speed settings (ms)
    const TYPING_SPEED = 60;
    const DELETING_SPEED = 35;
    const PAUSE_AFTER_TYPING = 2500;
    const PAUSE_AFTER_DELETING = 500;
    const INITIAL_TYPING_DELAY = 2200; // Wait for entrance animations

    /**
     * Core typing loop — types one character, schedules next frame.
     */
    function typeLoop() {
        if (!typingTextEl) return;

        const currentPhrase = phrases[phraseIndex];

        if (isPaused) return;

        if (!isDeleting) {
            // ── Typing ──
            charIndex++;
            typingTextEl.textContent = currentPhrase.substring(0, charIndex);

            if (charIndex === currentPhrase.length) {
                // Finished typing — pause, then start deleting
                isPaused = true;
                setTimeout(() => {
                    isPaused = false;
                    isDeleting = true;
                    typeLoop();
                }, PAUSE_AFTER_TYPING);
                return;
            }

            setTimeout(typeLoop, TYPING_SPEED);

        } else {
            // ── Deleting ──
            charIndex--;
            typingTextEl.textContent = currentPhrase.substring(0, charIndex);

            if (charIndex === 0) {
                // Finished deleting — move to next phrase
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;

                isPaused = true;
                setTimeout(() => {
                    isPaused = false;
                    typeLoop();
                }, PAUSE_AFTER_DELETING);
                return;
            }

            setTimeout(typeLoop, DELETING_SPEED);
        }
    }

    // Start typing after entrance animations complete
    setTimeout(typeLoop, INITIAL_TYPING_DELAY);


    /* ──────────────────────────────────────────
       3. FLOATING HEARTS GENERATOR
       ────────────────────────────────────────── */
    const heartsContainer = document.getElementById("floatingHeartsContainer");

    const heartEmojis = ["❤️", "💕", "💖", "💗", "💓", "💘", "💝", "🩷", "🤍"];

    /**
     * Create a single floating heart element.
     */
    function createHeart() {
        if (!heartsContainer || window.getComputedStyle(heartsContainer).display === "none" || heartsContainer.children.length >= 15 || window.matchMedia("(prefers-reduced-motion: reduce)").matches || (window.isContainerVisible && !window.isContainerVisible(heartsContainer))) return;

        const heart = document.createElement("span");
        heart.classList.add("floating-heart");

        // Random emoji
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

        // Random horizontal position
        heart.style.left = Math.random() * 100 + "%";

        // Random size
        const size = 0.8 + Math.random() * 1.2;
        heart.style.fontSize = size + "rem";

        // Random duration (8s — 16s)
        const duration = 8 + Math.random() * 8;
        heart.style.animationDuration = duration + "s";

        // Random delay (0 — 2s)
        heart.style.animationDelay = Math.random() * 2 + "s";

        // Random opacity
        heart.style.setProperty("--max-opacity", (0.3 + Math.random() * 0.5).toString());

        heartsContainer.appendChild(heart);

        // Remove after animation ends to prevent DOM buildup
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, (duration + 2) * 1000);
    }

    /**
     * Generate hearts at intervals.
     */
    function startHeartGenerator() {
        if (!heartsContainer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        // Create initial batch
        for (let i = 0; i < 6; i++) {
            setTimeout(createHeart, i * 400);
        }

        // Continuously create hearts via rAF loop instead of setInterval
        let lastSpawn = performance.now();
        function rAFHeartLoop(time) {
            if (time - lastSpawn >= 1800) {
                createHeart();
                lastSpawn = time;
            }
            requestAnimationFrame(rAFHeartLoop);
        }
        requestAnimationFrame(rAFHeartLoop);
    }

    // Start generating hearts
    startHeartGenerator();


    /* ──────────────────────────────────────────
       4. SCROLL INDICATOR
       ────────────────────────────────────────── */
    const scrollIndicator = document.getElementById("scrollIndicator");
    const exploreSection = document.getElementById("explore-section");

    if (scrollIndicator && exploreSection) {
        scrollIndicator.addEventListener("click", () => {
            exploreSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    }

    // Fade out scroll indicator when user scrolls down
    let indicatorVisible = true;

    function handleScrollIndicatorVisibility() {
        if (!scrollIndicator) return;

        if (window.scrollY > 200 && indicatorVisible) {
            scrollIndicator.style.opacity = "0";
            scrollIndicator.style.pointerEvents = "none";
            indicatorVisible = false;
        } else if (window.scrollY <= 200 && !indicatorVisible) {
            scrollIndicator.style.opacity = "1";
            scrollIndicator.style.pointerEvents = "auto";
            indicatorVisible = true;
        }
    }

    window.addEventListener("scroll", handleScrollIndicatorVisibility, { passive: true });


    /* ──────────────────────────────────────────
       5. CARD TILT EFFECT ON HOVER (Optimized)
       ────────────────────────────────────────── */
    const tiltCards = document.querySelectorAll("[data-tilt], .tilt-interactive, .glass-card-apple");

    tiltCards.forEach((card) => {
        let rect = null;
        let ticking = false;

        card.addEventListener("mouseenter", () => {
            rect = card.getBoundingClientRect();
        }, { passive: true });

        card.addEventListener("mousemove", (e) => {
            if (ticking || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
            ticking = true;
            requestAnimationFrame(() => {
                if (!rect) rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const maxTilt = 8;
                const tiltX = ((y - centerY) / centerY) * -maxTilt;
                const tiltY = ((x - centerX) / centerX) * maxTilt;

                card.style.transform = `perspective(800px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translate3d(0, -8px, 0)`;
                ticking = false;
            });
        }, { passive: true });

        card.addEventListener("mouseleave", () => {
            rect = null;
            card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)";
        }, { passive: true });
    });


    /* ──────────────────────────────────────────
       6. PARALLAX MOUSE EFFECT ON HERO (Optimized)
       ────────────────────────────────────────── */
    const heroSection = document.getElementById("hero");
    const heroIllustration = document.querySelector(".hero-couple-img");

    if (heroSection && heroIllustration) {
        const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

        if (!isTouch) {
            let heroRect = null;
            let heroTicking = false;

            heroSection.addEventListener("mouseenter", () => {
                heroRect = heroSection.getBoundingClientRect();
            }, { passive: true });

            heroSection.addEventListener("mousemove", (e) => {
                if (heroTicking || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
                heroTicking = true;
                requestAnimationFrame(() => {
                    if (!heroRect) heroRect = heroSection.getBoundingClientRect();
                    const x = (e.clientX - heroRect.left) / heroRect.width - 0.5;
                    const y = (e.clientY - heroRect.top) / heroRect.height - 0.5;
                    const moveX = x * 16;
                    const moveY = y * 16;

                    heroIllustration.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0) scale(1)`;
                    heroTicking = false;
                });
            }, { passive: true });

            heroSection.addEventListener("mouseleave", () => {
                heroRect = null;
                heroIllustration.style.transform = "translate3d(0, 0, 0) scale(1)";
            }, { passive: true });
        }
    }


    /* ──────────────────────────────────────────
       7. LIVE DATE, TIME & GREETING UPDATER
       ────────────────────────────────────────── */
    const liveDateEl = document.getElementById("liveDate");
    const liveTimeEl = document.getElementById("liveTime");
    const liveGreetingEl = document.getElementById("liveGreeting");

    function updateClockAndGreeting() {
        const now = new Date();

        // Date format: e.g. Saturday, August 1, 2026
        if (liveDateEl) {
            const dateOptions = { weekday: "long", month: "long", day: "numeric", year: "numeric" };
            const newDateStr = now.toLocaleDateString("en-US", dateOptions);
            if (liveDateEl.textContent !== newDateStr) {
                liveDateEl.textContent = newDateStr;
            }
        }

        // Time format: e.g. 05:45:12 PM
        if (liveTimeEl) {
            const newTimeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
            if (liveTimeEl.textContent !== newTimeStr) {
                liveTimeEl.textContent = newTimeStr;
            }
        }

        // Dynamic greeting based on hour
        if (liveGreetingEl) {
            const hour = now.getHours();
            let greeting = "Good Evening, My Princess 💕";
            if (hour >= 5 && hour < 12) {
                greeting = "Good Morning, My Princess 💕";
            } else if (hour >= 12 && hour < 17) {
                greeting = "Good Afternoon, My Beautiful Princess 💕";
            } else if (hour >= 17 && hour < 22) {
                greeting = "Good Evening, My Princess 💕";
            } else {
                greeting = "Good Night, Dream of Us 💕";
            }
            if (liveGreetingEl.textContent !== greeting) {
                liveGreetingEl.textContent = greeting;
            }
        }
    }

    updateClockAndGreeting();
    setInterval(updateClockAndGreeting, 1000);


    /* ──────────────────────────────────────────
       8. LIVE COUNTDOWN TIMER TO NEXT CELEBRATION
       ────────────────────────────────────────── */
    const daysEl = document.getElementById("countDays");
    const hoursEl = document.getElementById("countHours");
    const minsEl = document.getElementById("countMins");
    const secsEl = document.getElementById("countSecs");

    function updateCountdown() {
        if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

        const now = new Date();
        let targetYear = now.getFullYear();
        // Target is August 1st of current year, or next year if August 1 has passed
        let targetDate = new Date(targetYear, 7, 1); // Month is 0-indexed (7 = August)

        if (now > targetDate) {
            targetDate = new Date(targetYear + 1, 7, 1);
        }

        const diffMs = targetDate - now;
        const totalSecs = Math.floor(diffMs / 1000);

        const days = Math.floor(totalSecs / (3600 * 24));
        const hours = Math.floor((totalSecs % (3600 * 24)) / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;

        daysEl.textContent = days < 10 ? "0" + days : days;
        hoursEl.textContent = hours < 10 ? "0" + hours : hours;
        minsEl.textContent = mins < 10 ? "0" + mins : mins;
        secsEl.textContent = secs < 10 ? "0" + secs : secs;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);


    /* ──────────────────────────────────────────
       9. MINI MUSIC PLAYER SHOWCASE LINK
       ────────────────────────────────────────── */
    const homeMusicBtn = document.getElementById("homeMusicBtn");
    const homeMusicIcon = document.getElementById("homeMusicIcon");
    const globalAudio = document.getElementById("bgMusic");
    const globalToggleBtn = document.getElementById("musicToggleBtn");

    if (homeMusicBtn) {
        homeMusicBtn.addEventListener("click", () => {
            if (!globalAudio) return;
            if (globalAudio.paused) {
                if (window.foreverUsFadeIn) window.foreverUsFadeIn();
                else globalAudio.play().catch(()=>{});
            } else {
                if (window.foreverUsFadeOut) window.foreverUsFadeOut();
                else globalAudio.pause();
            }
        });

        document.addEventListener("foreverus:playstate", (e) => {
            const isPlaying = e.detail.playing;
            if (!homeMusicBtn || !homeMusicIcon) return;
            const textSpan = homeMusicBtn.querySelector("span");
            
            if (isPlaying) {
                homeMusicIcon.classList.remove("fa-play");
                homeMusicIcon.classList.add("fa-pause");
                if (textSpan) textSpan.textContent = "Playing Serenade 🎶";
                homeMusicBtn.classList.add("playing");
            } else {
                homeMusicIcon.classList.remove("fa-pause");
                homeMusicIcon.classList.add("fa-play");
                if (textSpan) textSpan.textContent = "Listen Together";
                homeMusicBtn.classList.remove("playing");
            }
        });

        // Initialize state
        if (globalAudio && !globalAudio.paused) {
            homeMusicIcon.classList.remove("fa-play");
            homeMusicIcon.classList.add("fa-pause");
            const textSpan = homeMusicBtn.querySelector("span");
            if (textSpan) textSpan.textContent = "Playing Serenade 🎶";
            homeMusicBtn.classList.add("playing");
        }
    }
});
