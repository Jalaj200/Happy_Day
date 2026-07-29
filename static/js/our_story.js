/* ═══════════════════════════════════════════════════════════
   Forever Us — Our Story Timeline Interactivity
   ═══════════════════════════════════════════════════════════
   Features:
     1. Scroll-triggered card reveal animations
     2. Timeline progress line (fills as you scroll)
     3. Click-to-expand card content
     4. Timeline end marker reveal
   ═══════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* ──────────────────────────────────────────
       1. SCROLL-TRIGGERED TIMELINE CARD REVEAL
       ────────────────────────────────────────── */
    const timelineItems = document.querySelectorAll(".timeline-item");
    const timelineEnd = document.querySelector(".timeline-end");

    if (timelineItems.length > 0) {
        const itemObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Stagger reveal based on item index
                        const index = parseInt(
                            entry.target.getAttribute("data-index") || "1",
                            10
                        );
                        const delay = Math.min(index * 100, 600);

                        setTimeout(() => {
                            entry.target.classList.add("revealed");
                        }, delay);

                        itemObserver.unobserve(entry.target);
                    }
                });
            },
            {
                root: null,
                rootMargin: "0px 0px -100px 0px",
                threshold: 0.15,
            }
        );

        timelineItems.forEach((item) => itemObserver.observe(item));
    }

    // Reveal the "To Be Continued" end marker
    if (timelineEnd) {
        const endObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("revealed");
                        endObserver.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: "0px 0px -50px 0px",
                threshold: 0.3,
            }
        );

        endObserver.observe(timelineEnd);
    }


    /* ──────────────────────────────────────────
       2. TIMELINE PROGRESS LINE
       ────────────────────────────────────────── */
    const timelineWrapper = document.getElementById("timelineWrapper");
    const timelineProgress = document.getElementById("timelineProgress");

    /**
     * Update the progress line height based on scroll position
     * relative to the timeline section.
     */
    function updateTimelineProgress() {
        if (!timelineWrapper || !timelineProgress) return;

        const rect = timelineWrapper.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // How far the user has scrolled through the timeline
        const totalHeight = rect.height;
        const scrolledPast = windowHeight - rect.top;
        const progress = Math.max(0, Math.min(scrolledPast / totalHeight, 1));

        timelineProgress.style.height = (progress * 100) + "%";
    }

    // Optimized scroll handler with requestAnimationFrame
    let progressTicking = false;

    function onScrollProgress() {
        if (!progressTicking) {
            window.requestAnimationFrame(() => {
                updateTimelineProgress();
                progressTicking = false;
            });
            progressTicking = true;
        }
    }

    window.addEventListener("scroll", onScrollProgress, { passive: true });
    updateTimelineProgress(); // Initial call


    /* ──────────────────────────────────────────
       3. CLICK-TO-EXPAND CARD CONTENT
       ────────────────────────────────────────── */
    const toggleButtons = document.querySelectorAll(".timeline-card-toggle");

    toggleButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();

            const targetId = btn.getAttribute("data-target");
            const expandSection = document.getElementById(targetId);
            const card = btn.closest(".timeline-card");

            if (!expandSection) return;

            const isExpanded = btn.getAttribute("aria-expanded") === "true";

            if (isExpanded) {
                // ── Collapse ──
                expandSection.classList.remove("expanded");
                btn.setAttribute("aria-expanded", "false");
                btn.querySelector(".toggle-text").textContent = "Read More";
                if (card) card.classList.remove("active");
            } else {
                // ── Expand ──
                expandSection.classList.add("expanded");
                btn.setAttribute("aria-expanded", "true");
                btn.querySelector(".toggle-text").textContent = "Read Less";
                if (card) card.classList.add("active");
            }
        });
    });

    // Also allow clicking anywhere on the card to toggle
    const timelineCards = document.querySelectorAll(".timeline-card");

    timelineCards.forEach((card) => {
        card.addEventListener("click", () => {
            const toggleBtn = card.querySelector(".timeline-card-toggle");
            if (toggleBtn) {
                toggleBtn.click();
            }
        });
    });


    /* ──────────────────────────────────────────
       4. KEYBOARD ACCESSIBILITY
       ────────────────────────────────────────── */
    timelineCards.forEach((card) => {
        // Make cards focusable
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");

        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const toggleBtn = card.querySelector(".timeline-card-toggle");
                if (toggleBtn) {
                    toggleBtn.click();
                }
            }
        });
    });
});
