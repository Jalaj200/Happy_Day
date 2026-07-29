/* ═══════════════════════════════════════════════════════════
   Forever Us — 20 Reasons I Love You Interactivity
   ═══════════════════════════════════════════════════════════
   Features:
     1. Click/Tap to Flip cards (essential for mobile & accessibility)
     2. Discovered Reasons Counter (tracks how many unique cards seen)
     3. "Flip All" wave animation with staggered delays
     4. "Reset All" button to unflip all cards
     5. Romantic sparkle / heart burst on card reveal
   ═══════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const reasonCards = document.querySelectorAll(".reason-card");
    const flipCountEl = document.getElementById("flipCount");
    const flipAllBtn = document.getElementById("flipAllBtn");
    const resetAllBtn = document.getElementById("resetAllBtn");
    
    const discoveredSet = new Set();
    const totalCards = reasonCards.length;
    let isAllFlipped = false;

    /**
     * Update the discovered counter in the UI.
     */
    function updateCounter() {
        if (!flipCountEl) return;
        
        // Count cards that are currently flipped OR were previously discovered
        let currentFlippedCount = 0;
        reasonCards.forEach((card) => {
            if (card.classList.contains("is-flipped") || card.matches(":hover")) {
                const id = card.getAttribute("data-reason-id");
                if (id) discoveredSet.add(id);
            }
        });

        const count = discoveredSet.size;
        flipCountEl.textContent = count.toString();

        // Add a gentle pop animation to the number when it changes
        flipCountEl.style.transform = "scale(1.3)";
        flipCountEl.style.transition = "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)";
        setTimeout(() => {
            flipCountEl.style.transform = "scale(1)";
        }, 200);
    }


    /* ──────────────────────────────────────────
       1. CARD HOVER / CLICK FLIP LOGIC
       ────────────────────────────────────────── */
    reasonCards.forEach((card) => {
        const id = card.getAttribute("data-reason-id");

        // Track when hovered (desktop)
        card.addEventListener("mouseenter", () => {
            if (id) discoveredSet.add(id);
            updateCounter();
        }, { passive: true });

        // Click / Tap toggle (essential for mobile devices & tablets)
        card.addEventListener("click", (e) => {
            e.stopPropagation();
            const wasFlipped = card.classList.contains("is-flipped");
            
            if (!wasFlipped) {
                card.classList.add("is-flipped");
                if (id) discoveredSet.add(id);
                createHeartBurst(e, card);
            } else {
                card.classList.remove("is-flipped");
            }
            updateCounter();
        });

        // Keyboard accessibility (Space or Enter to flip)
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", "Flip card to reveal reason");

        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                card.click();
            }
        });
    });


    /* ──────────────────────────────────────────
       2. FLIP ALL BUTTON (Staggered Wave Effect)
       ────────────────────────────────────────── */
    if (flipAllBtn) {
        flipAllBtn.addEventListener("click", () => {
            if (isAllFlipped) {
                // If already all flipped, reset
                resetAllCards();
                return;
            }

            flipAllBtn.disabled = true;
            flipAllBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Revealing...';

            reasonCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add("is-flipped");
                    const id = card.getAttribute("data-reason-id");
                    if (id) discoveredSet.add(id);
                    
                    if (index === totalCards - 1) {
                        updateCounter();
                        isAllFlipped = true;
                        flipAllBtn.disabled = false;
                        flipAllBtn.innerHTML = '<i class="fa-solid fa-check-double me-1"></i> All Revealed';
                        flipAllBtn.classList.replace("control-btn", "control-btn--outline");
                    }
                }, index * 60); // 60ms stagger ripple
            });
        });
    }


    /* ──────────────────────────────────────────
       3. RESET ALL BUTTON
       ────────────────────────────────────────── */
    function resetAllCards() {
        if (flipAllBtn) {
            flipAllBtn.disabled = false;
            flipAllBtn.innerHTML = '<i class="fa-solid fa-layer-group me-1"></i> Flip All Cards';
            if (flipAllBtn.classList.contains("control-btn--outline")) {
                flipAllBtn.classList.replace("control-btn--outline", "control-btn");
            }
        }
        isAllFlipped = false;

        reasonCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.remove("is-flipped");
            }, index * 35);
        });

        // Reset discovered count after animation
        setTimeout(() => {
            discoveredSet.clear();
            if (flipCountEl) flipCountEl.textContent = "0";
        }, totalCards * 35 + 100);
    }

    if (resetAllBtn) {
        resetAllBtn.addEventListener("click", resetAllCards);
    }


    /* ──────────────────────────────────────────
       4. HEART BURST MICRO-ANIMATION ON FLIP
       ────────────────────────────────────────── */
    function createHeartBurst(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX ? (e.clientX - rect.left) : (rect.width / 2);
        const y = e.clientY ? (e.clientY - rect.top) : (rect.height / 2);

        const emojis = ["💖", "✨", "💕", "🌸"];
        
        for (let i = 0; i < 4; i++) {
            const span = document.createElement("span");
            span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            span.style.position = "absolute";
            span.style.left = `${x}px`;
            span.style.top = `${y}px`;
            span.style.fontSize = "1.2rem";
            span.style.pointerEvents = "none";
            span.style.zIndex = "20";
            span.style.transition = "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
            span.style.opacity = "1";

            card.appendChild(span);

            // Random angle and distance
            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 40;
            const destX = x + Math.cos(angle) * distance;
            const destY = y + Math.sin(angle) * distance - 20;

            requestAnimationFrame(() => {
                span.style.transform = `translate(${destX - x}px, ${destY - y}px) scale(0.5)`;
                span.style.opacity = "0";
            });

            setTimeout(() => {
                if (span.parentNode) span.parentNode.removeChild(span);
            }, 600);
        }
    }
});
