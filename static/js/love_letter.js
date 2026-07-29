/* ═══════════════════════════════════════════════════════════
   Forever Us — Handwritten Love Letter Interactivity
   ═══════════════════════════════════════════════════════════
   Features:
     1. Typewriter letter typing with human handwriting rhythm
     2. Instant Reveal & Replay controls
     3. Animated signature reveal with ink underline
     4. Floating rose petals DOM generator (auto-cleanup)
     5. Web Audio API romantic music box / background music toggle
   ═══════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const typewriterBody = document.getElementById("typewriterBody");
    const typewriterCursor = document.getElementById("typewriterCursor");
    const letterFooter = document.getElementById("letterFooter");
    const letterPs = document.getElementById("letterPs");
    const typewriterStatus = document.getElementById("typewriterStatus");
    const skipBtn = document.getElementById("skipBtn");
    const replayBtn = document.getElementById("replayBtn");
    const musicBtn = document.getElementById("musicBtn");
    const musicBtnText = document.getElementById("musicBtnText");
    const petalsContainer = document.getElementById("petalsContainer");

    // 1. Get paragraphs data from Django JSON script
    let paragraphs = [];
    const paragraphsDataEl = document.getElementById("paragraphs-data");
    if (paragraphsDataEl) {
        try {
            paragraphs = JSON.parse(paragraphsDataEl.textContent);
        } catch (e) {
            console.error("Error parsing paragraphs data:", e);
        }
    }

    if (paragraphs.length === 0) {
        paragraphs = [
            "My dearest love, you are the sweetest blessing in my life.",
            "I promise to love you today, tomorrow, and for all eternity."
        ];
    }

    let isTyping = false;
    let typingTimeout = null;
    let currentParaIdx = 0;
    let currentCharIdx = 0;
    let currentParaEl = null;


    /* ──────────────────────────────────────────
       1. TYPEWRITER ANIMATION LOGIC
       ────────────────────────────────────────── */
    function startTypewriter() {
        // Clear previous state
        if (typingTimeout) clearTimeout(typingTimeout);
        if (typewriterBody) typewriterBody.innerHTML = "";
        
        currentParaIdx = 0;
        currentCharIdx = 0;
        isTyping = true;
        
        if (typewriterCursor) typewriterCursor.classList.remove("is-hidden");
        if (letterFooter) {
            letterFooter.style.opacity = "0";
            letterFooter.classList.remove("is-revealed");
        }
        if (letterPs) letterPs.style.opacity = "0";
        if (typewriterStatus) typewriterStatus.textContent = "Writing love letter...";
        if (skipBtn) skipBtn.disabled = false;

        createNewParagraph();
        typeNextCharacter();
    }

    function createNewParagraph() {
        if (!typewriterBody) return;
        currentParaEl = document.createElement("p");
        currentParaEl.className = "letter-paragraph font-handwritten";
        typewriterBody.appendChild(currentParaEl);
    }

    function typeNextCharacter() {
        if (!isTyping) return;

        if (currentParaIdx < paragraphs.length) {
            const currentParaText = paragraphs[currentParaIdx];

            if (currentCharIdx < currentParaText.length) {
                // Type character
                const char = currentParaText.charAt(currentCharIdx);
                currentParaEl.textContent += char;
                currentCharIdx++;

                // Human-like handwriting speed jitter (20ms to 45ms)
                let delay = 22 + Math.random() * 25;
                if (char === "." || char === "," || char === "—") {
                    delay += 150; // Pause at punctuation
                }

                typingTimeout = setTimeout(typeNextCharacter, delay);
            } else {
                // Paragraph finished, move to next after pause
                currentParaIdx++;
                currentCharIdx = 0;
                if (currentParaIdx < paragraphs.length) {
                    createNewParagraph();
                    typingTimeout = setTimeout(typeNextCharacter, 380);
                } else {
                    // All paragraphs finished!
                    finishTypewriter();
                }
            }
        }
    }

    function finishTypewriter() {
        isTyping = false;
        if (typingTimeout) clearTimeout(typingTimeout);
        if (typewriterCursor) typewriterCursor.classList.add("is-hidden");

        // Reveal signature with underline
        if (letterFooter) {
            letterFooter.style.opacity = "1";
            letterFooter.classList.add("is-revealed");
        }

        // Reveal P.S. note
        if (letterPs) {
            setTimeout(() => {
                letterPs.style.opacity = "1";
            }, 500);
        }

        if (typewriterStatus) typewriterStatus.textContent = "Letter complete 💕";
        if (skipBtn) skipBtn.disabled = true;
    }


    /* ──────────────────────────────────────────
       2. CONTROLS: INSTANT REVEAL & REPLAY
       ────────────────────────────────────────── */
    if (skipBtn) {
        skipBtn.addEventListener("click", () => {
            if (!isTyping) return;
            isTyping = false;
            if (typingTimeout) clearTimeout(typingTimeout);

            // Output all paragraphs instantly
            if (typewriterBody) {
                typewriterBody.innerHTML = "";
                paragraphs.forEach((text) => {
                    const p = document.createElement("p");
                    p.className = "letter-paragraph font-handwritten";
                    p.textContent = text;
                    typewriterBody.appendChild(p);
                });
            }

            finishTypewriter();
        });
    }

    if (replayBtn) {
        replayBtn.addEventListener("click", () => {
            startTypewriter();
        });
    }

    // Start animation on page load
    setTimeout(startTypewriter, 600);


    /* ──────────────────────────────────────────
       3. FLOATING ROSE PETALS GENERATOR
       ────────────────────────────────────────── */
    function createFloatingPetal() {
        if (!petalsContainer || petalsContainer.children.length >= 15 || window.matchMedia("(prefers-reduced-motion: reduce)").matches || (window.isContainerVisible && !window.isContainerVisible(petalsContainer))) return;

        const emojis = ["🌹", "🌸", "🌺", "🥀", "💖", "🌷"];
        const petal = document.createElement("span");
        petal.className = "floating-petal";
        petal.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        // Randomize horizontal starting position and size
        petal.style.left = `${Math.random() * 95}%`;
        petal.style.fontSize = `${1.2 + Math.random() * 0.9}rem`;

        // Randomize fall duration (10s to 16s)
        const duration = 10 + Math.random() * 6;
        petal.style.animationDuration = `${duration}s`;

        petalsContainer.appendChild(petal);

        // Remove from DOM when animation ends
        setTimeout(() => {
            if (petal.parentNode) petal.parentNode.removeChild(petal);
        }, duration * 1000 + 100);
    }

    // Spawn petal every 750ms via rAF loop instead of setInterval
    let lastPetalSpawn = performance.now();
    function rAFPetalLoop(time) {
        if (time - lastPetalSpawn >= 750) {
            createFloatingPetal();
            lastPetalSpawn = time;
        }
        requestAnimationFrame(rAFPetalLoop);
    }
    requestAnimationFrame(rAFPetalLoop);
    // Spawn 5 initial petals immediately
    for (let i = 0; i < 5; i++) {
        setTimeout(createFloatingPetal, i * 300);
    }


    /* ──────────────────────────────────────────
       4. MUSIC BOX / BACKGROUND AUDIO TOGGLE
       ────────────────────────────────────────── */
    let isMusicPlaying = false;
    let audioCtx = null;
    let musicInterval = null;

    /**
     * Web Audio API synthesized romantic music box chimes
     * Plays gentle arpeggiated love chords if no MP3 file is attached!
     */
    function startMusicBox() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!audioCtx) audioCtx = new AudioContext();
            if (audioCtx.state === "suspended") audioCtx.resume();

            // Romantic pentatonic chord notes (C major / A minor pentatonic frequencies in Hz)
            const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];

            function playChime() {
                if (!isMusicPlaying || !audioCtx) return;
                
                const freq = notes[Math.floor(Math.random() * notes.length)];
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

                // Gentle envelope (attack and long bell decay)
                gain.gain.setValueAtTime(0, audioCtx.currentTime);
                gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.0);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start();
                osc.stop(audioCtx.currentTime + 3.0);
            }

            playChime();
            musicInterval = setInterval(playChime, 1800);
        } catch (e) {
            console.log("Web Audio API not available or blocked:", e);
        }
    }

    function stopMusicBox() {
        if (musicInterval) clearInterval(musicInterval);
        if (audioCtx && audioCtx.state === "running") {
            audioCtx.suspend();
        }
    }

    if (musicBtn) {
        musicBtn.addEventListener("click", () => {
            const bgAudio = document.getElementById("bgMusic") || document.getElementById("letterAudio");
            
            isMusicPlaying = !isMusicPlaying;

            if (isMusicPlaying) {
                musicBtn.classList.add("is-playing");
                if (musicBtnText) musicBtnText.textContent = "Pause Music";
                musicBtn.innerHTML = '<i class="fa-solid fa-volume-high me-1"></i> <span id="musicBtnText">Pause Music</span>';

                // Try playing audio element first, fall back to synthesized music box
                if (bgAudio && bgAudio.querySelector("source")) {
                    bgAudio.play().catch(() => startMusicBox());
                } else {
                    startMusicBox();
                }
            } else {
                musicBtn.classList.remove("is-playing");
                if (musicBtnText) musicBtnText.textContent = "Play Music";
                musicBtn.innerHTML = '<i class="fa-solid fa-music me-1"></i> <span id="musicBtnText">Play Music</span>';

                if (bgAudio) bgAudio.pause();
                stopMusicBox();
            }
        });
    }
});
