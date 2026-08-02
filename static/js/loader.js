/* ═══════════════════════════════════════════════════════════════════════════
   Forever Us — Premium Full-Screen Romantic Loader Script
   ═══════════════════════════════════════════════════════════════════════════
   Responsibilities (loader ONLY — navigation transitions are in effects.js):
     1. Show the premium loader on the user's FIRST visit per browser session
     2. Skip the loader entirely on subsequent navigations / refreshes
     3. Rotating romantic loading messages (smooth fade transition)
     4. 60 FPS smooth progress incrementing via requestAnimationFrame
     5. Waits for window 'load' event (disappears only after website is loaded)
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const loaderEl = document.getElementById("premiumLoader");
    if (!loaderEl) return;

    /* ──────────────────────────────────────────
       0. SESSION-BASED LOADER GATE
       ────────────────────────────────────────── 
       Show the loader only on the user's very first visit per browser session.
       If the loader has already been shown, hide it immediately and skip
       all progress animation, message rotation, rAF loops, and timers. */
    if (sessionStorage.getItem("loaderShown")) {
        // Use visibility: hidden first to prevent any visual flash,
        // then display: none to remove from layout
        loaderEl.style.visibility = "hidden";
        loaderEl.style.display = "none";
        return; // Exit — skip ALL loader logic below
    }

    const msgTextEl = document.getElementById("loaderMessageText");
    const percentEl = document.getElementById("loaderPercentDisplay");
    const progressFillEl = document.getElementById("loaderProgressFill");

    /* ──────────────────────────────────────────
       1. ROTATING ROMANTIC LOADING MESSAGES
       ────────────────────────────────────────── */
    const loadingMessages = [
        "Loading beautiful memories...",
        "Preparing our love story...",
        "Collecting precious moments...",
        "Creating today's surprise..."
    ];

    let msgIndex = 0;
    const msgInterval = setInterval(() => {
        if (!msgTextEl) return;
        
        // Smooth fade-out and slide down
        msgTextEl.style.opacity = "0";
        msgTextEl.style.transform = "translateY(6px)";
        
        setTimeout(() => {
            msgIndex = (msgIndex + 1) % loadingMessages.length;
            if (msgTextEl) {
                msgTextEl.textContent = loadingMessages[msgIndex];
                // Smooth fade-in and slide up
                msgTextEl.style.opacity = "1";
                msgTextEl.style.transform = "translateY(0)";
            }
        }, 350);
    }, 2400);


    /* ──────────────────────────────────────────
       2. 60 FPS SMOOTH PROGRESS ENGINE
       ────────────────────────────────────────── */
    let currentProgress = 0;
    let targetProgress = 88; // Hold smoothly around 88% until window 'load' fires
    let isWebsiteLoaded = false;
    let isAnimationFinished = false;

    function animateProgressFrame() {
        if (isAnimationFinished) return;

        if (isWebsiteLoaded) {
            targetProgress = 100;
            // Faster interpolation toward 100% once assets are fully ready
            currentProgress += (targetProgress - currentProgress) * 0.18;
            if (currentProgress > 99.4) currentProgress = 100;
        } else {
            // Gentle organic easing while waiting for network assets
            currentProgress += (targetProgress - currentProgress) * 0.045;
        }

        const displayVal = Math.floor(currentProgress);
        if (percentEl) percentEl.textContent = `${displayVal}%`;
        if (progressFillEl) progressFillEl.style.width = `${currentProgress}%`;

        if (currentProgress >= 100 && !isAnimationFinished) {
            isAnimationFinished = true;
            clearInterval(msgInterval);
            if (percentEl) percentEl.textContent = "100%";
            if (progressFillEl) progressFillEl.style.width = "100%";

            // Brief pause at 100% so user admires completed heart & glossy shine
            setTimeout(() => {
                loaderEl.classList.add("is-finished");
                
                // Remove from DOM / hide after fade-out transition completes
                setTimeout(() => {
                    if (loaderEl.parentNode) {
                        loaderEl.style.display = "none";
                    }
                    // Mark loader as shown ONLY after the entire fade-out is complete.
                    // If the user refreshes mid-loader, they'll see the full experience again.
                    sessionStorage.setItem("loaderShown", "true");
                }, 900);
            }, 450);
        } else {
            requestAnimationFrame(animateProgressFrame);
        }
    }

    // Start 60 FPS loop
    requestAnimationFrame(animateProgressFrame);


    /* ──────────────────────────────────────────
       3. WINDOW LOAD & SAFETY FALLBACK
       ────────────────────────────────────────── */
    // Disappear only after the website has completely finished loading
    window.addEventListener("load", () => {
        isWebsiteLoaded = true;
    });

    // 4.5-second fallback in case third-party tracking or font asset hangs infinitely
    setTimeout(() => {
        isWebsiteLoaded = true;
    }, 4500);

    // NOTE: Section 4 (Django page transitions) has been REMOVED.
    // Page transitions are now solely managed by effects.js to prevent
    // duplicate event listeners and competing animations.
});
