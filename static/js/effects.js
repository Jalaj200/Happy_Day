/* ═══════════════════════════════════════════════════════════
   Forever Us — Website-Wide Visual Effects & Interactivity Engine
   ═══════════════════════════════════════════════════════════
   Features:
     1. AOS (Animate On Scroll) Initialization
     2. Romantic Glass Preloader Fade-out & Page Transitions
     3. Unified HTML5 Canvas Engine (Falling Hearts ❤️ & Sparkles ✨)
     4. Subtle Custom Cursor Dot (Pink Glow, No Particles)
     5. Respects 'prefers-reduced-motion' Accessibility Settings
   ═══════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* ──────────────────────────────────────────
       1. AOS (ANIMATE ON SCROLL) INITIALIZATION
       ────────────────────────────────────────── */
    if (typeof window.AOS !== "undefined") {
        window.AOS.init({
            duration: 750,
            easing: "ease-out-cubic",
            once: true,
            mirror: false,
            offset: 40,
        });
    }

    /* ──────────────────────────────────────────
       2. PREMIUM CINEMATIC PRELOADER CONTROLLER
       ────────────────────────────────────────── */
    const preloader = document.getElementById("sitePreloader");
    const preloaderMsgEl = document.getElementById("preloaderMessage");
    const preloaderPercentEl = document.getElementById("preloaderPercent");
    const preloaderBarFillEl = document.getElementById("preloaderBarFill");

    if (preloader) {
        // Rotating Loading Messages
        const loadingMessages = [
            "Loading beautiful memories...",
            "Preparing our love story...",
            "Collecting precious moments...",
            "Creating today's surprise...",
            "Weaving our forever dreams...",
        ];
        let msgIdx = 0;
        const msgTimer = setInterval(() => {
            if (!preloaderMsgEl || preloader.classList.contains("is-loaded")) {
                clearInterval(msgTimer);
                return;
            }
            preloaderMsgEl.style.opacity = "0";
            preloaderMsgEl.style.transform = "translateY(-4px)";
            setTimeout(() => {
                msgIdx = (msgIdx + 1) % loadingMessages.length;
                if (preloaderMsgEl) {
                    preloaderMsgEl.textContent = loadingMessages[msgIdx];
                    preloaderMsgEl.style.opacity = "1";
                    preloaderMsgEl.style.transform = "translateY(0)";
                }
            }, 300);
        }, 1100);

        // 60 FPS Smooth Progress Bar via requestAnimationFrame
        let currentProgress = 0;
        let targetProgress = 88; // Hold at 88% until window load event
        let isPageLoaded = false;
        let isFinished = false;

        function updatePreloaderFrame() {
            if (isFinished) return;

            if (isPageLoaded) {
                targetProgress = 100;
                currentProgress += (targetProgress - currentProgress) * 0.15;
                if (currentProgress > 99.2) currentProgress = 100;
            } else {
                currentProgress += (targetProgress - currentProgress) * 0.04;
            }

            const dispVal = Math.floor(currentProgress);
            if (preloaderPercentEl) preloaderPercentEl.textContent = `${dispVal}%`;
            if (preloaderBarFillEl) preloaderBarFillEl.style.width = `${currentProgress}%`;

            if (currentProgress >= 100 && !isFinished) {
                isFinished = true;
                clearInterval(msgTimer);
                if (preloaderPercentEl) preloaderPercentEl.textContent = "100%";
                if (preloaderBarFillEl) preloaderBarFillEl.style.width = "100%";
                
                // Pause briefly at 100% to let user admire the completed state
                setTimeout(() => {
                    preloader.classList.add("is-loaded");
                    setTimeout(() => {
                        if (preloader.parentNode) preloader.style.display = "none";
                    }, 800);
                }, 400);
            } else {
                requestAnimationFrame(updatePreloaderFrame);
            }
        }

        requestAnimationFrame(updatePreloaderFrame);

        // Trigger full completion when page resources finish loading
        window.addEventListener("load", () => {
            isPageLoaded = true;
        });

        // Fallback max duration to prevent infinite stalling if an external asset hangs
        setTimeout(() => {
            isPageLoaded = true;
        }, 4000);
    }

    // Intercept navigation links for smooth CSS fade-out transition
    document.querySelectorAll("a[href]").forEach((link) => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (!href || href.startsWith("#") || href.startsWith("javascript:") || link.target === "_blank" || link.hasAttribute("download")) {
                return;
            }
            // Check if link is same-origin
            try {
                const targetUrl = new URL(link.href, window.location.origin);
                if (targetUrl.origin === window.location.origin && targetUrl.pathname !== window.location.pathname) {
                    e.preventDefault();
                    document.body.classList.add("page-transitioning-out");
                    setTimeout(() => {
                        window.location.href = link.href;
                    }, 350);
                }
            } catch (err) {
                // Ignore invalid URLs
            }
        });
    });

    /* ──────────────────────────────────────────
       3. UNIFIED HIGH-PERFORMANCE CANVAS ENGINE
       (Background Falling Hearts & Sparkles + Subtle Cursor Dot)
       ────────────────────────────────────────── */
    const canvas = document.getElementById("globalEffectsCanvas");
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let resizeTimeout = null;
    window.addEventListener("resize", () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }, 150);
    }, { passive: true });

    const isMobileDevice = window.innerWidth < 768 || navigator.maxTouchPoints > 0;

    // ── Subtle Custom Cursor Dot (No Particles, Smooth Movement) ──
    if (!isMobileDevice) {
        const cursorDot = document.createElement("div");
        cursorDot.className = "subtle-custom-cursor-dot";
        document.body.appendChild(cursorDot);

        let dotX = -100, dotY = -100;
        let targetX = -100, targetY = -100;

        window.addEventListener("mousemove", (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
        }, { passive: true });

        function animateCursorDot() {
            dotX += (targetX - dotX) * 0.22;
            dotY += (targetY - dotY) * 0.22;
            cursorDot.style.transform = `translate3d(${dotX.toFixed(1)}px, ${dotY.toFixed(1)}px, 0)`;
            requestAnimationFrame(animateCursorDot);
        }
        requestAnimationFrame(animateCursorDot);
    }

    // ── Decorative Background Particles (Only Floating Hearts & Small Sparkles) ──
    // Ensure all DOM fallback particles (if any render from legacy templates) strictly use ❤️ and ✨
    document.querySelectorAll(".fallback-sparkles, .fallback-particles, #particles-bg span").forEach((el) => {
        if (el.textContent && (el.textContent.includes("💖") || el.textContent.includes("💕") || el.textContent.includes("💗") || el.textContent.includes("🌸") || el.textContent.includes("🌹"))) {
            el.textContent = el.textContent.replace(/💖|💕|💗|🌸|🌹/g, "❤️");
        }
    });

    const fallingParticles = [];
    // Keep ONLY two decorative particle types per specifications
    const particleEmojis = ["❤️", "✨"];

    // Capped to 35 visible particles (~50% reduction, maintaining target 30-40 visible at 60 FPS)
    const maxParticles = isMobileDevice ? 20 : 35;
    for (let i = 0; i < maxParticles; i++) {
        fallingParticles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 12 + 10,             // Random sizes (10px - 22px)
            speedY: Math.random() * 0.7 + 0.35,        // Slowly drift downward (different speeds)
            speedX: (Math.random() - 0.5) * 0.3,       // Gentle horizontal movement
            offset: Math.random() * Math.PI * 2,
            emoji: particleEmojis[Math.floor(Math.random() * particleEmojis.length)],
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 0.15,    // Never rotate excessively
            maxOpacity: Math.random() * 0.35 + 0.15,   // Random opacity (soft and calming)
        });
    }

    // ── Unified RequestAnimationFrame Render Loop (60 FPS) ──
    let isRendering = true;
    document.addEventListener("visibilitychange", () => {
        isRendering = !document.hidden;
        if (isRendering) requestAnimationFrame(renderLoop);
    });

    function renderLoop() {
        if (!isRendering) return;
        ctx.clearRect(0, 0, width, height);

        const now = Date.now() * 0.001;

        fallingParticles.forEach((p) => {
            p.y += p.speedY;
            p.x += p.speedX + Math.sin(now * 0.8 + p.offset) * 0.22;
            p.rotation += p.rotSpeed;

            // Screen wrap recycling (spawn only from top without bouncing)
            if (p.y > height + 30) {
                p.y = -25;
                p.x = Math.random() * width;
            }
            if (p.x < -30) p.x = width + 20;
            if (p.x > width + 30) p.x = -20;

            // Smooth fade in near top and fade out near bottom
            let currentOpacity = p.maxOpacity;
            if (p.y < 80) {
                currentOpacity *= Math.max(0, (p.y + 25) / 105);
            } else if (p.y > height - 120) {
                currentOpacity *= Math.max(0, (height - p.y) / 120);
            }

            ctx.globalAlpha = currentOpacity;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.font = `${Math.round(p.size)}px serif`;
            ctx.fillText(p.emoji, 0, 0);
            ctx.restore();
        });

        ctx.globalAlpha = 1.0;
        requestAnimationFrame(renderLoop);
    }

    renderLoop();

    /* ──────────────────────────────────────────
       4. VIEWPORT INTERSECTION OBSERVER
       (Pause animations & particle spawning outside viewport)
       ────────────────────────────────────────── */
    window.isContainerVisible = (el) => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < window.innerHeight;
    };

    if ("IntersectionObserver" in window) {
        const animObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove("animation-paused");
                    entry.target.style.animationPlayState = "running";
                } else {
                    entry.target.classList.add("animation-paused");
                    entry.target.style.animationPlayState = "paused";
                }
            });
        }, { rootMargin: "60px 0px 60px 0px" });

        const observeElements = () => {
            document.querySelectorAll("#particles-bg, #floatingHeartsContainer, #petalsContainer, #secretHeartsContainer, #surpriseHeartsContainer, #surpriseFireworksCanvas, #hero, .memory-card, .gallery-card, .reason-card, .preloader-heart, .sparkle, .floating-heart, .floating-petal, .secret-floating-heart, .surprise-floating-heart").forEach((el) => {
                if (!el.dataset.observed) {
                    el.dataset.observed = "true";
                    animObserver.observe(el);
                }
            });
        };

        observeElements();
        // Periodically check for new dynamically spawned cards/elements without MutationObserver overhead
        setInterval(observeElements, 2500);
    }

    /* ──────────────────────────────────────────
       5. SMART NAVBAR SCROLL CONTROLLER (60 FPS)
       ────────────────────────────────────────── */
    const mainHeader = document.getElementById("mainHeader");
    const mainNavbar = document.getElementById("mainNavbar");
    let lastScrollY = window.scrollY;
    let scrollTicking = false;

    window.addEventListener("scroll", () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                if (mainNavbar) {
                    if (currentScrollY > 40) {
                        mainNavbar.classList.add("scrolled");
                    } else {
                        mainNavbar.classList.remove("scrolled");
                    }
                }
                if (mainHeader) {
                    // Hide header when scrolling down past 80px, reveal on scroll up
                    if (currentScrollY > lastScrollY && currentScrollY > 80) {
                        mainHeader.classList.add("navbar--hidden");
                    } else if (currentScrollY < lastScrollY) {
                        mainHeader.classList.remove("navbar--hidden");
                    }
                }
                lastScrollY = currentScrollY;
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    /* ──────────────────────────────────────────
       6. ACTIVE LINK HIGHLIGHTER FALLBACK
       ────────────────────────────────────────── */
    const currentPath = window.location.pathname;
    document.querySelectorAll("#desktopNavLinks .nav-link, .mobile-nav-links .mobile-link").forEach((link) => {
        const href = link.getAttribute("href");
        if (href && (currentPath === href || (href !== "/" && currentPath.startsWith(href)))) {
            link.classList.add("active");
        }
    });

    /* ──────────────────────────────────────────
       7. MOBILE FULLSCREEN DRAWER CONTROLLER
       ────────────────────────────────────────── */
    const mobileDrawer = document.getElementById("mobileNavDrawer");
    const mobileOpenBtn = document.getElementById("mobileMenuOpenBtn");
    const mobileCloseBtn = document.getElementById("mobileMenuCloseBtn");
    const mobileBackdrop = document.getElementById("mobileNavBackdrop");

    function openMobileMenu() {
        if (mobileDrawer) {
            mobileDrawer.classList.add("is-open");
            mobileDrawer.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden"; // Lock scroll
        }
    }

    function closeMobileMenu() {
        if (mobileDrawer) {
            mobileDrawer.classList.remove("is-open");
            mobileDrawer.setAttribute("aria-hidden", "true");
            document.body.style.overflow = ""; // Unlock scroll
        }
    }

    if (mobileOpenBtn) mobileOpenBtn.addEventListener("click", openMobileMenu);
    if (mobileCloseBtn) mobileCloseBtn.addEventListener("click", closeMobileMenu);
    if (mobileBackdrop) mobileBackdrop.addEventListener("click", closeMobileMenu);
    document.querySelectorAll(".mobile-nav-links .mobile-link").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    /* ──────────────────────────────────────────
       8. ❤️ FAVOURITE UTILITY ICON INTERACTIVITY
       ────────────────────────────────────────── */
    const favBtn = document.getElementById("favouriteToggleBtn");
    if (favBtn) {
        favBtn.addEventListener("click", (e) => {
            // Create celebratory floating heart burst
            const rect = favBtn.getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;
            const emojis = ["❤️", "💖", "💕", "✨"];

            for (let i = 0; i < 14; i++) {
                const burstEl = document.createElement("span");
                burstEl.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                burstEl.style.position = "fixed";
                burstEl.style.left = `${startX}px`;
                burstEl.style.top = `${startY}px`;
                burstEl.style.fontSize = `${1 + Math.random() * 0.8}rem`;
                burstEl.style.pointerEvents = "none";
                burstEl.style.zIndex = "3000";
                burstEl.style.transition = "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
                document.body.appendChild(burstEl);

                const angle = Math.random() * Math.PI * 2;
                const distance = 40 + Math.random() * 90;
                const destX = startX + Math.cos(angle) * distance;
                const destY = startY + Math.sin(angle) * distance - 40;

                requestAnimationFrame(() => {
                    burstEl.style.transform = `translate(${destX - startX}px, ${destY - startY}px) scale(1.4)`;
                    burstEl.style.opacity = "0";
                });

                setTimeout(() => burstEl.remove(), 1200);
            }

            // Button bounce animation
            favBtn.style.transform = "scale(1.3)";
            setTimeout(() => { favBtn.style.transform = ""; }, 300);
        });
    }
});
