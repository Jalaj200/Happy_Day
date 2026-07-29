css2 = """
/* ──────────────────────────────────────────────
   3. MEMORY CARDS
   ────────────────────────────────────────────── */
.glass-card-apple {
    background: rgba(18, 5, 12, 0.6);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease;
    overflow: hidden;
}

.glass-card-apple:hover {
    box-shadow: 0 15px 45px rgba(233, 30, 99, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
}

.memory-card__glow {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0 0 20px rgba(255, 64, 129, 0);
    transition: box-shadow 0.5s ease;
    pointer-events: none;
    z-index: 10;
}

.glass-card-apple:hover .memory-card__glow {
    box-shadow: inset 0 0 25px rgba(255, 64, 129, 0.2);
}

.glass-img-frame {
    width: 100%;
    margin-bottom: 1.2rem;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    aspect-ratio: 4/3;
    background: #000;
}

.glass-img-frame::after {
    content: '';
    position: absolute;
    inset: 0;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1);
    border-radius: 16px;
    pointer-events: none;
    z-index: 2;
}

.memory-card__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease;
    filter: brightness(0.9) contrast(1.1);
}

.glass-card-apple:hover .memory-card__img {
    transform: scale(1.08) rotate(1deg);
    filter: brightness(1.05) contrast(1.1);
}

/* Fallback Gradients for Missing Images */
.memory-card__img-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.gradient-card-1 { background: linear-gradient(135deg, #2a0845 0%, #6441A5 100%); }
.gradient-card-2 { background: linear-gradient(135deg, #42275a 0%, #734b6d 100%); }
.gradient-card-3 { background: linear-gradient(135deg, #1f1c2c 0%, #928DAB 100%); }
.gradient-card-4 { background: linear-gradient(135deg, #23074d 0%, #cc5333 100%); }

.memory-fallback-emoji {
    font-size: 5rem;
    filter: drop-shadow(0 0 15px rgba(255,255,255,0.5));
    animation: floatingEmoji 3s ease-in-out infinite alternate;
}

@keyframes floatingEmoji {
    0% { transform: translateY(0); }
    100% { transform: translateY(-10px); }
}

.glass-card-apple:hover .memory-card__img-fallback {
    transform: scale(1.05);
}

.memory-title-row {
    margin-bottom: 0.8rem;
}

.memory-title {
    font-size: 1.6rem;
    font-weight: 600;
    color: #ffffff;
    line-height: 1.3;
}

.memory-title-emoji {
    font-size: 1.4rem;
}

/* ──────────────────────────────────────────────
   4. METADATA & PILLS
   ────────────────────────────────────────────── */
.glass-pill {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.memory-date-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.4rem 1rem;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #ff80ab;
    letter-spacing: 0.5px;
    background: rgba(233, 30, 99, 0.1);
    border: 1px solid rgba(233, 30, 99, 0.3);
}

.memory-meta-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.35rem 0.9rem;
    border-radius: 50px;
    font-size: 0.82rem;
    color: #e0e0e0;
    transition: background 0.3s ease, transform 0.2s ease;
}

.memory-meta-pill:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.centered-desc {
    color: #b0b0b0;
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 1.2rem;
}

/* ──────────────────────────────────────────────
   5. BUTTONS
   ────────────────────────────────────────────── */
.btn-glass {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    padding: 0.6rem 1.5rem;
    border-radius: 50px;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn-glass:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
    color: #fff;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

/* ──────────────────────────────────────────────
   6. PAGINATION
   ────────────────────────────────────────────── */
.pagination-container .pagination {
    margin: 0;
}

.pagination-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 45px;
    height: 45px;
    padding: 0 1rem;
    color: #ffffff;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.pagination-btn:hover {
    background: rgba(233, 30, 99, 0.2);
    border-color: rgba(233, 30, 99, 0.4);
    color: #ff80ab;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(233, 30, 99, 0.3);
}

.page-link--active {
    background: linear-gradient(135deg, rgba(233, 30, 99, 0.7), rgba(255, 64, 129, 0.9));
    border-color: rgba(255, 255, 255, 0.4);
    color: #fff !important;
    box-shadow: 0 5px 15px rgba(233, 30, 99, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.2);
}

/* ──────────────────────────────────────────────
   7. MODAL (FULL STORY)
   ────────────────────────────────────────────── */
.memory-modal {
    background: rgba(15, 5, 20, 0.85) !important;
    backdrop-filter: blur(35px) !important;
    -webkit-backdrop-filter: blur(35px) !important;
    border: 1px solid rgba(255, 105, 180, 0.3) !important;
    border-radius: 24px;
    box-shadow: 0 25px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.2) !important;
    overflow: hidden;
}

.modal-header {
    border-bottom: 1px solid rgba(255,255,255,0.05) !important;
    padding: 1.5rem 2rem !important;
}

.modal-title {
    font-size: 1.8rem;
    margin: 0;
}

.modal-title-emoji {
    font-size: 1.5rem;
}

.btn-close-white {
    filter: invert(1) grayscale(100%) brightness(200%);
    opacity: 0.6;
    transition: opacity 0.3s, transform 0.3s;
}

.btn-close-white:hover {
    opacity: 1;
    transform: rotate(90deg);
}

.modal-image-wrap {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.1);
}

.modal-img {
    width: 100%;
    max-height: 500px;
    object-fit: cover;
    display: block;
}

.glass-special-card {
    background: linear-gradient(135deg, rgba(233, 30, 99, 0.05), rgba(255, 105, 180, 0.1));
    border: 1px solid rgba(255, 105, 180, 0.2);
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: inset 0 0 20px rgba(255, 105, 180, 0.05);
}

.reason-heart-icon {
    font-size: 1.2rem;
    animation: heartBeat 1.5s ease-in-out infinite;
    display: inline-block;
}

@keyframes heartBeat {
    0%, 100% { transform: scale(1); }
    15% { transform: scale(1.2); }
    30% { transform: scale(1); }
    45% { transform: scale(1.2); }
}

.reason-title {
    font-size: 1.4rem;
    color: #ff80ab;
    margin-bottom: 0;
}

.reason-body {
    color: rgba(255,255,255,0.85);
    font-size: 1.05rem;
}

/* ──────────────────────────────────────────────
   8. BOTTOM CTA SECTION
   ────────────────────────────────────────────── */
.memories-cta-section {
    padding: 4rem 0 6rem;
    position: relative;
    z-index: 2;
}

.memories-cta {
    max-width: 700px;
    margin: 0 auto;
    padding: 3rem 2rem;
    border-radius: 24px;
    box-shadow: 0 15px 45px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
}

.memories-cta-emoji {
    font-size: 3rem;
    display: block;
    margin-bottom: 1rem;
    animation: floatingEmoji 4s ease-in-out infinite alternate;
}

.memories-cta-title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.memories-cta-text {
    color: #b0b0b0;
    font-size: 1.1rem;
    margin-bottom: 2rem;
    line-height: 1.6;
}

/* Fixes requested by user */
.custom-premium-btn {
    -webkit-appearance: none;
    appearance: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.85rem 2.2rem;
    font-size: 0.98rem;
    font-weight: 600;
    color: #ffffff !important;
    text-decoration: none;
    background: linear-gradient(135deg, rgba(233, 30, 99, 0.6) 0%, rgba(255, 64, 129, 0.8) 50%, rgba(194, 24, 91, 0.6) 100%);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50px;
    box-shadow: 0 8px 25px rgba(233, 30, 99, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.2);
    overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, background 0.3s ease;
    cursor: pointer;
    width: auto;
    max-width: 100%;
    white-space: nowrap;
    outline: none;
}

.custom-premium-btn:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(233, 30, 99, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.3);
}

.custom-premium-btn::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: width 0.6s ease-out, height 0.6s ease-out, opacity 0.6s ease-out;
}

.custom-premium-btn:active::after {
    width: 300px;
    height: 300px;
    opacity: 1;
    transition: 0s;
}

.custom-modal-content {
    max-height: 90vh;
    display: flex;
    flex-direction: column;
}

.custom-modal-body {
    overflow-y: auto;
}
"""

with open('static/css/memories.css', 'a', encoding='utf-8') as f:
    f.write(css2)
print("Appended css2.")
