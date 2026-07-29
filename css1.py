css = '''/* ═══════════════════════════════════════════════════════════
   Forever Us — Cherished Memories Page Stylesheet
   ═══════════════════════════════════════════════════════════
   Features:
     1. Premium glassmorphism memory card grid with soft shadows
     2. Smooth image zoom-in hover animations & 3D lift
     3. Fallback luxury gradient headers with pulsing emojis
     4. Glassmorphism full-story dialog modals
     5. MySQL pagination bar styling
   ═══════════════════════════════════════════════════════════ */


/* ──────────────────────────────────────────────
   1. HERO BANNER
   ────────────────────────────────────────────── */
.memories-hero {
    position: relative;
    padding: calc(var(--navbar-height) + 12px) 0 1rem !important;
    margin-top: 0 !important;
    overflow: hidden;
    text-align: center;
    z-index: 2 !important;
    min-height: 48vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.memories-hero-bg {
    position: absolute;
    inset: 0;
    z-index: 1;
}

.memories-hero-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        155deg,
        #0e0118 0%,
        #240930 25%,
        #44133c 50%,
        #72194b 75%,
        #c2185b 100%
    );
}

.memories-hero-stars {
    position: absolute;
    inset: 0;
    background-image:
        radial-gradient(1.5px 1.5px at 25% 20%, rgba(255,255,255,0.7), transparent),
        radial-gradient(1px 1px at 60% 65%, rgba(255,255,255,0.5), transparent),
        radial-gradient(2px 2px at 80% 30%, rgba(255,255,255,0.8), transparent),
        radial-gradient(1.2px 1.2px at 30% 80%, rgba(255,255,255,0.4), transparent);
    animation: twinkle 4s ease-in-out infinite alternate;
}

.memories-ambient-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    pointer-events: none;
    opacity: 0.35;
    animation: ambientFloat 8s ease-in-out infinite alternate;
}

.glow-1 {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, #ff4081, transparent 70%);
    top: 5%;
    left: 10%;
}

.glow-2 {
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, #7c4dff, transparent 70%);
    bottom: 5%;
    right: 10%;
    animation-delay: -4s;
}

@keyframes ambientFloat {
    0%   { transform: translate(0, 0) scale(1); }
    100% { transform: translate(20px, -20px) scale(1.1); }
}

@keyframes twinkle {
    0%   { opacity: 0.6; }
    100% { opacity: 1; }
}

/* ── Fade-in Utility (staggered entrance for hero content) ── */
.animate-fade-in {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in[data-delay="1"] { animation-delay: 0.15s; }
.animate-fade-in[data-delay="2"] { animation-delay: 0.3s; }
.animate-fade-in[data-delay="3"] { animation-delay: 0.45s; }
.animate-fade-in[data-delay="4"] { animation-delay: 0.6s; }
.animate-fade-in[data-delay="5"] { animation-delay: 0.75s; }
.animate-fade-in[data-delay="6"] { animation-delay: 0.9s; }

@keyframes fadeInUp {
    to { opacity: 1; transform: translateY(0); }
}

.memories-hero-content {
    max-width: 880px;
    margin: 0 auto;
}

.memories-hero-script {
    font-size: clamp(1.2rem, 2.5vw, 1.8rem);
    color: #ff80ab;
    margin-bottom: 0.5rem;
    text-shadow: 0 0 15px rgba(255,128,171,0.6);
    letter-spacing: 1px;
}

.memories-hero-title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    color: #ffffff;
    margin-top: 0 !important;
    margin-bottom: 0.8rem;
    text-shadow: 0 2px 20px rgba(0,0,0,0.5), 0 0 35px rgba(233,30,99,0.5);
}

.memories-hero-subtitle {
    font-size: clamp(1rem, 1.8vw, 1.15rem);
    color: rgba(255, 255, 255, 0.85);
    max-width: 720px;
    margin: 0 auto 1.5rem;
    line-height: 1.6;
    text-shadow: 0 1px 10px rgba(0,0,0,0.3);
}

/* ── Decorative Glowing Divider ── */
.memories-hero-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin: 1.5rem auto 1.8rem;
    color: #ff80ab;
}

.divider-swirl {
    font-size: 1.5rem;
    opacity: 0.7;
}

.divider-heart {
    font-size: 1.4rem;
    filter: drop-shadow(0 0 12px rgba(255,105,180,0.9));
}

.pulse-glow {
    animation: heartPulseGlow 2s ease-in-out infinite;
}

@keyframes heartPulseGlow {
    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 8px rgba(255,105,180,0.7)); }
    50% { transform: scale(1.15); filter: drop-shadow(0 0 20px rgba(255,105,180,1)); }
}

/* ──────────────────────────────────────────────
   1.5. TIMELINE LAYOUT (NEW ZIG-ZAG DESIGN)
   ────────────────────────────────────────────── */
.timeline-container-wrap {
    padding-top: 2rem;
    padding-bottom: 4rem;
}

.timeline-container {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 0;
}

/* Central Glowing Timeline Line */
.timeline-line {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 3px;
    background: linear-gradient(180deg, transparent, rgba(255, 105, 180, 0.8), transparent);
    transform: translateX(-50%);
    box-shadow: 0 0 15px rgba(255, 105, 180, 0.6);
    z-index: 1;
}

/* Timeline Row Container */
.timeline-row {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6rem;
    width: 100%;
    z-index: 2;
}

.timeline-row:last-child {
    margin-bottom: 2rem;
}

/* Alternating flex directions */
.timeline-row-odd {
    flex-direction: row !important;
}

.timeline-row-even {
    flex-direction: row !important;
}

/* Timeline Heart Node */
.timeline-node {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 44px;
    height: 44px;
    background: #1a0f2e;
    border: 2px solid #ff80ab;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    z-index: 10;
    box-shadow: 0 0 20px rgba(233, 30, 99, 0.5), inset 0 0 10px rgba(255, 105, 180, 0.3);
}

/* Premium Glass Timeline Card */
.premium-timeline-card {
    width: calc(100% - 40px); /* Leave space around the center */
    margin: 0 auto;
    flex-direction: row !important;
    gap: 0;
    padding: 0;
}

/* Split Image and Content Columns inside the card */
.timeline-image-col {
    width: 50%;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.timeline-content-col {
    width: 50%;
    padding: 3rem 4rem 3rem 3rem;
}

/* Reverse internal layout for odd rows (Content Left, Image Right) */
.timeline-row-odd .premium-timeline-card {
    flex-direction: row !important;
}

/* Camera overlay icon */
.camera-icon-overlay {
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background: rgba(26, 5, 37, 0.8);
    border: 1px solid rgba(255, 105, 180, 0.4);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ff80ab;
    backdrop-filter: blur(8px);
    z-index: 10;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

/* Make images perfectly fit their side */
.timeline-image-col .glass-img-frame {
    width: 100%;
    height: 100%;
    max-height: 450px;
    margin: 0 !important;
}

.timeline-image-col .memory-card__img {
    height: 100%;
    max-height: 420px;
}

/* Responsive Tablet & Mobile Timeline */
@media (max-width: 992px) {
    .timeline-container {
        padding-left: 2rem;
    }
    
    .timeline-line {
        left: 0;
        transform: none;
    }
    
    .timeline-node {
        left: 0;
        transform: translate(-50%, -50%);
    }
    
    .timeline-row, .timeline-row-even, .timeline-row-odd {
        flex-direction: column !important;
        align-items: flex-start;
        padding-left: 2rem;
        margin-bottom: 4rem;
    }
    
    .premium-timeline-card {
        flex-direction: column !important;
        width: 100%;
    }
    
    .timeline-row-odd .premium-timeline-card {
        flex-direction: column !important;
    }

    .timeline-image-col, .timeline-content-col {
        width: 100%;
    }
    
    .timeline-content-col {
        padding: 1.5rem;
    }
}
'''