/* ═══════════════════════════════════════════════════════════════════════════
   Forever Us — Premium Floating Glassmorphism Navigation Script
   Reference Style: Apple, Linear, Framer, Luxury SaaS Landing Pages
   ═══════════════════════════════════════════════════════════════════════════
   Features:
     1. Smart Scroll: Hide on scroll down, Appear on scroll up
     2. Mobile Hamburger Menu & Glass Drawer Controller
     3. Dark Mode Theme Switcher (with localStorage persistence)
     4. Music Serenade Toggle (synchronized across buttons)
     5. Favourite Button Love Explosion (floating heart shower)
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const headerEl = document.getElementById("appleFloatingHeader");
    const hamburgerBtn = document.getElementById("appleHamburgerBtn");
    const drawerEl = document.getElementById("appleMobileDrawer");
    const drawerCloseBtn = document.getElementById("appleDrawerCloseBtn");
    const drawerBackdrop = document.getElementById("appleDrawerBackdrop");

    /* ──────────────────────────────────────────
       1. SMART SCROLL: HIDE ON DOWN, SHOW ON UP
       ────────────────────────────────────────── */
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    let ticking = false;

    if (headerEl) {
        window.addEventListener("scroll", () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
                    const scrollDelta = currentScrollY - lastScrollY;

                    // If scrolling down > 10px and below top threshold, hide navbar
                    if (scrollDelta > 8 && currentScrollY > 70) {
                        headerEl.classList.add("is-hidden");
                    } 
                    // If scrolling up > 8px or at the very top, show navbar
                    else if (scrollDelta < -8 || currentScrollY <= 50) {
                        headerEl.classList.remove("is-hidden");
                    }

                    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }


    /* ──────────────────────────────────────────
       2. MOBILE HAMBURGER & DRAWER MENU
       ────────────────────────────────────────── */
    function openDrawer() {
        if (!drawerEl) return;
        drawerEl.classList.add("is-open");
        if (hamburgerBtn) {
            hamburgerBtn.classList.add("is-active");
            hamburgerBtn.setAttribute("aria-expanded", "true");
        }
        document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    function closeDrawer() {
        if (!drawerEl) return;
        drawerEl.classList.remove("is-open");
        if (hamburgerBtn) {
            hamburgerBtn.classList.remove("is-active");
            hamburgerBtn.setAttribute("aria-expanded", "false");
        }
        document.body.style.overflow = "";
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener("click", () => {
            if (drawerEl && drawerEl.classList.contains("is-open")) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });
    }

    if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener("click", closeDrawer);

    // Close drawer when clicking any nav link inside it
    document.querySelectorAll(".drawer-link").forEach((link) => {
        link.addEventListener("click", () => {
            closeDrawer();
        });
    });
    
    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && drawerEl && drawerEl.classList.contains("is-open")) {
            closeDrawer();
        }
    });


    /* ──────────────────────────────────────────
       3. DARK MODE THEME SWITCHER
       ────────────────────────────────────────── */
    const navThemeBtn = document.getElementById("navThemeBtn");
    const drawerThemeBtn = document.getElementById("drawerThemeBtn");
    const htmlEl = document.documentElement;

    function toggleTheme() {
        const currentTheme = htmlEl.getAttribute("data-theme") || "light";
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        htmlEl.setAttribute("data-theme", newTheme);
        try {
            localStorage.setItem("forever_us_theme", newTheme);
        } catch (err) {}
        updateThemeIcons(newTheme);
    }

    function updateThemeIcons(theme) {
        const isDark = theme === "dark";
        [navThemeBtn, drawerThemeBtn].forEach((btn) => {
            if (!btn) return;
            const icon = btn.querySelector("i");
            if (!icon) return;
            if (isDark) {
                icon.className = "fa-solid fa-sun text-warning";
                btn.title = "Switch to Light Mode";
            } else {
                icon.className = "fa-solid fa-moon";
                btn.title = "Switch to Dark Mode";
            }
        });
    }

    // Initialize theme from localStorage
    try {
        const savedTheme = localStorage.getItem("forever_us_theme") || "light";
        htmlEl.setAttribute("data-theme", savedTheme);
        updateThemeIcons(savedTheme);
    } catch (err) {}

    if (navThemeBtn) navThemeBtn.addEventListener("click", toggleTheme);
    if (drawerThemeBtn) drawerThemeBtn.addEventListener("click", toggleTheme);


    /* ──────────────────────────────────────────
       4. MUSIC SERENADE TOGGLE
       ────────────────────────────────────────── */
    const navMusicBtn = document.getElementById("navMusicBtn");
    const drawerMusicBtn = document.getElementById("drawerMusicBtn");
    const globalAudio = document.getElementById("bgMusic");

    function toggleMusic() {
        if (!globalAudio) return;
        if (globalAudio.paused) {
            if (window.foreverUsFadeIn) window.foreverUsFadeIn();
            else globalAudio.play().catch(()=>{});
        } else {
            if (window.foreverUsFadeOut) window.foreverUsFadeOut();
            else globalAudio.pause();
        }
    }

    if (navMusicBtn) navMusicBtn.addEventListener("click", toggleMusic);
    if (drawerMusicBtn) drawerMusicBtn.addEventListener("click", toggleMusic);

    document.addEventListener("foreverus:playstate", (e) => {
        const isPlaying = e.detail.playing;
        [navMusicBtn, drawerMusicBtn].forEach((btn) => {
            if (!btn) return;
            if (isPlaying) {
                btn.classList.add("playing");
                const icon = btn.querySelector("i");
                if (icon) icon.className = "fa-solid fa-pause";
            } else {
                btn.classList.remove("playing");
                const icon = btn.querySelector("i");
                if (icon) icon.className = "fa-solid fa-play";
            }
        });
    });

    if (globalAudio && !globalAudio.paused) {
        [navMusicBtn, drawerMusicBtn].forEach((btn) => {
            if (!btn) return;
            btn.classList.add("playing");
            const icon = btn.querySelector("i");
            if (icon) icon.className = "fa-solid fa-pause";
        });
    }


    /* ──────────────────────────────────────────
       5. FAVOURITE BUTTON LOVE EXPLOSION
       ────────────────────────────────────────── */
    const navFavBtn = document.getElementById("navFavBtn");
    const drawerFavBtn = document.getElementById("drawerFavBtn");

    function triggerFavHeartExplosion(e) {
        const btn = e.currentTarget;
        if (!btn) return;

        // Visual pulse
        btn.style.transform = "scale(1.3)";
        setTimeout(() => { btn.style.transform = ""; }, 250);

        // Spawn 12 floating glowing hearts around the button
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const hearts = ["💖", "💕", "💗", "❤️", "🌹", "✨"];
        for (let i = 0; i < 12; i++) {
            const heartSpan = document.createElement("span");
            heartSpan.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heartSpan.style.position = "fixed";
            heartSpan.style.left = `${centerX}px`;
            heartSpan.style.top = `${centerY}px`;
            heartSpan.style.fontSize = `${1 + Math.random() * 0.8}rem`;
            heartSpan.style.pointerEvents = "none";
            heartSpan.style.zIndex = "999999";
            heartSpan.style.filter = "drop-shadow(0 0 8px #ff4081)";
            heartSpan.style.transition = "all 1s cubic-bezier(0.16, 1, 0.3, 1)";
            
            document.body.appendChild(heartSpan);

            const angle = (Math.PI * 2 / 12) * i + (Math.random() - 0.5);
            const distance = 60 + Math.random() * 80;
            const destX = centerX + Math.cos(angle) * distance;
            const destY = centerY + Math.sin(angle) * distance - 40;

            requestAnimationFrame(() => {
                heartSpan.style.transform = `translate3d(${destX - centerX}px, ${destY - centerY}px, 0) scale(1.2)`;
                heartSpan.style.opacity = "0";
            });

            setTimeout(() => {
                if (heartSpan.parentNode) heartSpan.remove();
            }, 1000);
        }
    }

    if (navFavBtn) navFavBtn.addEventListener("click", triggerFavHeartExplosion);
    if (drawerFavBtn) drawerFavBtn.addEventListener("click", triggerFavHeartExplosion);
});
