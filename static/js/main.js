/* ═══════════════════════════════════════════════════════════
   Forever Us — Main JavaScript
   ═══════════════════════════════════════════════════════════
   Features:
     1. Dark Mode Toggle (persisted in localStorage)
     2. Scroll-to-Top Button
     3. Sticky Navbar scroll effects
     4. Background Music Toggle
     5. Scroll Reveal Animations
     6. Smooth Scroll for anchor links
     7. Active Nav Link highlighting
   ═══════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* ──────────────────────────────────────────
       1. DARK MODE TOGGLE
       ────────────────────────────────────────── */
    const darkModeToggle = document.getElementById("darkModeToggle");
    const darkModeIcon = document.getElementById("darkModeIcon");
    const htmlElement = document.documentElement;

    // Key for localStorage
    const THEME_KEY = "forever_us_theme";

    /**
     * Apply the given theme ("light" or "dark") to the page.
     * @param {string} theme - The theme to apply.
     */
    function applyTheme(theme) {
        htmlElement.setAttribute("data-theme", theme);

        if (darkModeIcon) {
            if (theme === "dark") {
                darkModeIcon.classList.remove("fa-moon");
                darkModeIcon.classList.add("fa-sun");
                darkModeToggle.setAttribute("title", "Switch to light mode");
            } else {
                darkModeIcon.classList.remove("fa-sun");
                darkModeIcon.classList.add("fa-moon");
                darkModeToggle.setAttribute("title", "Switch to dark mode");
            }
        }
    }

    // Load saved theme or default to "light"
    const savedTheme = localStorage.getItem(THEME_KEY) || "light";
    applyTheme(savedTheme);

    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", () => {
            const currentTheme = htmlElement.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";

            applyTheme(newTheme);
            localStorage.setItem(THEME_KEY, newTheme);

            // Micro-animation: spin the icon
            if (darkModeIcon) {
                darkModeIcon.style.transform = "rotate(360deg)";
                setTimeout(() => {
                    darkModeIcon.style.transform = "rotate(0deg)";
                }, 500);
            }
        });
    }


    /* ──────────────────────────────────────────
       2. SCROLL-TO-TOP BUTTON
       ────────────────────────────────────────── */
    const scrollToTopBtn = document.getElementById("scrollToTop");
    const SCROLL_THRESHOLD = 400;

    /**
     * Show or hide the scroll-to-top button based on scroll position.
     */
    function toggleScrollToTopButton() {
        if (!scrollToTopBtn) return;

        if (window.scrollY > SCROLL_THRESHOLD) {
            scrollToTopBtn.classList.add("visible");
        } else {
            scrollToTopBtn.classList.remove("visible");
        }
    }

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        });
    }


    /* ──────────────────────────────────────────
       3. STICKY NAVBAR SCROLL EFFECTS
       ────────────────────────────────────────── */
    const navbar = document.getElementById("mainNavbar");
    const NAVBAR_SCROLL_THRESHOLD = 50;

    /**
     * Add/remove "scrolled" class on navbar based on scroll position.
     */
    function handleNavbarScroll() {
        if (!navbar) return;

        if (window.scrollY > NAVBAR_SCROLL_THRESHOLD) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }


    /* ──────────────────────────────────────────
       4. BACKGROUND MUSIC TOGGLE
       ────────────────────────────────────────── */
    const musicToggle = document.getElementById("musicToggle");
    const musicIcon = document.getElementById("musicIcon");
    const bgMusic = document.getElementById("bgMusic");

    if (musicToggle && bgMusic) {
        musicToggle.addEventListener("click", () => {
            if (bgMusic.paused) {
                if (window.foreverUsFadeIn) window.foreverUsFadeIn();
                else bgMusic.play().catch(()=>{});
            } else {
                if (window.foreverUsFadeOut) window.foreverUsFadeOut();
                else bgMusic.pause();
            }
        });

        document.addEventListener("foreverus:playstate", (e) => {
            const isPlaying = e.detail.playing;
            if (musicIcon) {
                musicIcon.className = isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play";
            }
            if (isPlaying) {
                musicToggle.classList.add("playing");
                musicToggle.setAttribute("title", "Pause music");
            } else {
                musicToggle.classList.remove("playing");
                musicToggle.setAttribute("title", "Play music");
            }
        });
        
        // Initialize UI
        if (!bgMusic.paused) {
            if (musicIcon) musicIcon.className = "fa-solid fa-pause";
            musicToggle.classList.add("playing");
            musicToggle.setAttribute("title", "Pause music");
        }
    }


    /* ──────────────────────────────────────────
       5. SCROLL REVEAL ANIMATIONS
       ────────────────────────────────────────── */
    const revealElements = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );

    /**
     * IntersectionObserver callback to reveal elements on scroll.
     */
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("revealed");
                        // Stop observing once revealed
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                root: null,
                rootMargin: "0px 0px -80px 0px",
                threshold: 0.15,
            }
        );

        revealElements.forEach((el) => revealObserver.observe(el));
    }


    /* ──────────────────────────────────────────
       6. SMOOTH SCROLL FOR ANCHOR LINKS
       ────────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            const targetId = anchor.getAttribute("href");
            if (targetId === "#") return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });

                // Close mobile navbar if open
                const navbarCollapse = document.getElementById("navbarContent");
                if (navbarCollapse && navbarCollapse.classList.contains("show")) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }
            }
        });
    });


    /* ──────────────────────────────────────────
       7. ACTIVE NAV LINK HIGHLIGHTING
       ────────────────────────────────────────── */
    const navLinks = document.querySelectorAll(".glass-navbar .nav-link:not(.btn-icon)");
    const currentPath = window.location.pathname;

    navLinks.forEach((link) => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });


    /* ──────────────────────────────────────────
       8. UNIFIED SCROLL HANDLER (performance)
       ────────────────────────────────────────── */
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                toggleScrollToTopButton();
                handleNavbarScroll();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    // Run once on load
    toggleScrollToTopButton();
    handleNavbarScroll();


    /* ──────────────────────────────────────────
       9. CLOSE MOBILE NAV ON LINK CLICK
       ────────────────────────────────────────── */
    const navbarCollapse = document.getElementById("navbarContent");

    if (navbarCollapse) {
        navbarCollapse.querySelectorAll(".nav-link:not(.btn-icon)").forEach((link) => {
            link.addEventListener("click", () => {
                if (navbarCollapse.classList.contains("show")) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }
            });
        });
    }
});
