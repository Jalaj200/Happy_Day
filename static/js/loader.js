/* ═══════════════════════════════════════════════════════════════════════════
   Forever Us — Premium Full-Screen Romantic Loader Script (Reference Match)
   ═══════════════════════════════════════════════════════════════════════════
   Features:
     1. Rotating romantic loading messages (smooth fade transition)
     2. 60 FPS smooth progress incrementing via requestAnimationFrame
     3. Waits for window 'load' event (disappears only after website is loaded)
     4. Seamless page transition handling for Django links
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const loaderEl = document.getElementById("premiumLoader");
    const msgTextEl = document.getElementById("loaderMessageText");
    const percentEl = document.getElementById("loaderPercentDisplay");
    const progressFillEl = document.getElementById("loaderProgressFill");

    if (!loaderEl) return;

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


    /* ──────────────────────────────────────────
       4. DJANGO SAME-ORIGIN PAGE TRANSITIONS
       ────────────────────────────────────────── */
    document.querySelectorAll("a[href]").forEach((link) => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (!href || href.startsWith("#") || href.startsWith("javascript:") || link.target === "_blank" || link.hasAttribute("download")) {
                return;
            }
            try {
                const targetUrl = new URL(link.href, window.location.origin);
                if (targetUrl.origin === window.location.origin && targetUrl.pathname !== window.location.pathname) {
                    e.preventDefault();
                    document.body.style.opacity = "0";
                    document.body.style.transition = "opacity 0.35s ease";
                    setTimeout(() => {
                        window.location.href = link.href;
                    }, 350);
                }
            } catch (err) {
                // Ignore invalid URLs
            }
        });
    });
});
