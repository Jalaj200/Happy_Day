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
    const openAllBtn = document.getElementById("openAllBtn");
    const resetAllBtn = document.getElementById("resetAllBtn");
    
    const discoveredSet = new Set();
    const totalCards = reasonCards.length;
    let isAllDiscovered = false;
    let isBulkOpening = false;
    let hasCelebrated = false;
    let currentModalCardIndex = -1;
    let loveNoteModalInstance = null;
    let celebrationModalInstance = null;

    if (document.getElementById("loveNoteModal")) {
        // Initialize without auto-show
        loveNoteModalInstance = new bootstrap.Modal(document.getElementById("loveNoteModal"));
    }

    if (document.getElementById("celebrationModal")) {
        celebrationModalInstance = new bootstrap.Modal(document.getElementById("celebrationModal"));
    }

    /**
     * Update the discovered counter in the UI.
     */
    function updateCounter() {
        if (!flipCountEl) return;
        
        // Count cards that are currently flipped OR were previously discovered
        let currentDiscoveredCount = 0;
        reasonCards.forEach((card) => {
            if (card.classList.contains("is-discovered") || card.matches(":hover")) {
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

        // Check for natural completion
        if (count === totalCards && !isBulkOpening && !hasCelebrated && celebrationModalInstance) {
            hasCelebrated = true;
            setTimeout(() => {
                // If love note modal is open, close it first before celebration
                if (loveNoteModalInstance) {
                    const loveNoteEl = document.getElementById("loveNoteModal");
                    if (loveNoteEl.classList.contains("show")) {
                        loveNoteModalInstance.hide();
                    }
                }
                
                // Allow a small beat before celebration pops up
                setTimeout(() => {
                    celebrationModalInstance.show();
                }, 400);
            }, 600);
        }
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
            const wasDiscovered = card.classList.contains("is-discovered");
            
            if (!wasDiscovered) {
                card.classList.add("is-discovered");
                if (id) discoveredSet.add(id);
                createHeartBurst(e, card);
                updateCounter();
            }
            
            // Wait 200ms before opening modal for a premium feel
            setTimeout(() => {
                openLoveNote(card);
            }, 200);
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
       2. LOVE NOTE MODAL LOGIC
       ────────────────────────────────────────── */
    function openLoveNote(card) {
        if (!loveNoteModalInstance) return;
        
        currentModalCardIndex = Array.from(reasonCards).indexOf(card);
        
        document.getElementById("modalReasonNumber").textContent = "#" + card.getAttribute("data-order");
        document.getElementById("modalReasonEmoji").textContent = card.getAttribute("data-emoji");
        document.getElementById("modalReasonTitle").textContent = card.getAttribute("data-title");
        document.getElementById("modalReasonDesc").textContent = card.getAttribute("data-desc");
        
        const prevBtn = document.getElementById("modalPrevBtn");
        const nextBtn = document.getElementById("modalNextBtn");
        
        if (prevBtn) prevBtn.style.visibility = (currentModalCardIndex <= 0) ? "hidden" : "visible";
        if (nextBtn) nextBtn.style.visibility = (currentModalCardIndex >= totalCards - 1) ? "hidden" : "visible";
        
        loveNoteModalInstance.show();
    }

    const prevBtn = document.getElementById("modalPrevBtn");
    const nextBtn = document.getElementById("modalNextBtn");
    
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentModalCardIndex > 0) {
                const prevCard = reasonCards[currentModalCardIndex - 1];
                if (!prevCard.classList.contains("is-discovered")) {
                    prevCard.classList.add("is-discovered");
                    const id = prevCard.getAttribute("data-reason-id");
                    if (id) discoveredSet.add(id);
                    updateCounter();
                }
                openLoveNote(prevCard);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentModalCardIndex < totalCards - 1) {
                const nextCard = reasonCards[currentModalCardIndex + 1];
                if (!nextCard.classList.contains("is-discovered")) {
                    nextCard.classList.add("is-discovered");
                    const id = nextCard.getAttribute("data-reason-id");
                    if (id) discoveredSet.add(id);
                    updateCounter();
                }
                openLoveNote(nextCard);
            }
        });
    }

    /* ──────────────────────────────────────────
       3. BULK OPEN BUTTON (Staggered Wave Effect)
       ────────────────────────────────────────── */
    if (openAllBtn) {
        openAllBtn.addEventListener("click", () => {
            if (isAllDiscovered) {
                // If already all discovered, reset
                resetAllCards();
                return;
            }

            isBulkOpening = true;
            openAllBtn.disabled = true;
            openAllBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Opening Notes...';

            reasonCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add("is-discovered");
                    const id = card.getAttribute("data-reason-id");
                    if (id) discoveredSet.add(id);
                    
                    if (index === totalCards - 1) {
                        updateCounter();
                        isAllDiscovered = true;
                        openAllBtn.disabled = false;
                        openAllBtn.innerHTML = '<i class="fa-solid fa-check-double me-1"></i> All Opened';
                        openAllBtn.classList.replace("control-btn", "control-btn--outline");
                        isBulkOpening = false;
                    }
                }, index * 60); // 60ms stagger ripple
            });
        });
    }


    /* ──────────────────────────────────────────
       4. RESET ALL BUTTON
       ────────────────────────────────────────── */
    function resetAllCards() {
        if (openAllBtn) {
            openAllBtn.disabled = false;
            openAllBtn.innerHTML = '<i class="fa-solid fa-envelope-open-text me-1"></i> Open Every Love Note';
            if (openAllBtn.classList.contains("control-btn--outline")) {
                openAllBtn.classList.replace("control-btn--outline", "control-btn");
            }
        }
        isAllDiscovered = false;
        hasCelebrated = false;

        reasonCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.remove("is-discovered");
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
