/* ═══════════════════════════════════════════════════════════
   Forever Us — Cherished Memories Interactivity
   ═══════════════════════════════════════════════════════════
   Features:
     1. 3D Tilt perspective animation on memory cards during mouse move
     2. Interactive floating sparkle micro-animations on card hover
     3. Smooth entrance and modal transition handling
   ═══════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const memoryCards = document.querySelectorAll(".memory-card[data-tilt]");

    /* ──────────────────────────────────────────
       1. 3D TILT EFFECT ON MOUSE MOVE
       ────────────────────────────────────────── */
    memoryCards.forEach((card) => {
        let ticking = false;
        card.addEventListener("mousemove", (e) => {
            if (ticking || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
            ticking = true;
            requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -6; // Max 6 deg tilt
                const rotateY = ((x - centerX) / centerX) * 6;

                card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(0, -10px, 0) scale(1.025)`;
                ticking = false;
            });
        }, { passive: true });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0) scale(1)";
        }, { passive: true });

    });

    /* ──────────────────────────────────────────
       3. MODAL OPEN/CLOSE POLISH
       ────────────────────────────────────────── */
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
        modal.addEventListener("show.bs.modal", () => {
            const content = modal.querySelector(".modal-content");
            if (content) {
                content.style.opacity = "0";
                content.style.transform = "scale(0.85)";
                setTimeout(() => {
                    content.style.transition = "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
                    content.style.opacity = "1";
                    content.style.transform = "scale(1)";
                }, 10);
            }
        });
    });



    /* ──────────────────────────────────────────
       5. SMOOTH SCROLLING FOR STORY TRANSITIONS
       ────────────────────────────────────────── */
    const scrollLinks = document.querySelectorAll("#scrollToMemoriesBtn, #beginJourneyBtn, #beginJourneyArrowBtn, .scroll-indicator-link, .featured-scroll-link");
    scrollLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            if (targetId && targetId.startsWith("#")) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    const navbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--navbar-height"), 10) || 72;
                    const offsetTop = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight - 15;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: "smooth"
                    });
                }
            }
        });
    });
});
