/* ═══════════════════════════════════════════════════════════
   Forever Us — Website-Wide Background Music Player Engine
   ═══════════════════════════════════════════════════════════
   Features:
     1. Play / Pause & Disc Rotation Animation
     2. Volume Slider & Mute Toggle with LocalStorage Persistence
     3. Cross-Page Playback State & Time Memory (localStorage)
     4. Smooth Audio Fade-In and Fade-Out Transitions
     5. Respects Browser Autoplay Policies (Starts on User Interaction)
   ═══════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const audio = document.getElementById("bgMusic");
    const widget = document.getElementById("musicPlayerWidget");
    const discWrap = document.getElementById("musicDiscWrap");
    const toggleBtn = document.getElementById("musicToggleBtn");
    const toggleIcon = document.getElementById("musicToggleIcon");
    const muteBtn = document.getElementById("musicMuteBtn");
    const volumeIcon = document.getElementById("musicVolumeIcon");
    const volumeSlider = document.getElementById("musicVolumeSlider");

    if (!audio || !widget) return;

    // LocalStorage Keys
    const STATE_KEY = "forever_us_music_state";
    const TIME_KEY = "forever_us_music_time";
    const VOL_KEY = "forever_us_music_vol";
    const MUTED_KEY = "forever_us_music_muted";

    let isFading = false;
    let fadeInterval = null;

    /* ──────────────────────────────────────────
       1. VOLUME & MUTE INITIALIZATION
       ────────────────────────────────────────── */
    const savedVol = localStorage.getItem(VOL_KEY);
    const savedMuted = localStorage.getItem(MUTED_KEY) === "true";

    let currentVolume = savedVol !== null ? parseFloat(savedVol) : 0.75;
    if (isNaN(currentVolume) || currentVolume < 0 || currentVolume > 1) {
        currentVolume = 0.75;
    }

    if (volumeSlider) {
        volumeSlider.value = Math.round(currentVolume * 100);
    }

    audio.volume = savedMuted ? 0 : currentVolume;
    audio.muted = savedMuted;
    updateVolumeIcon(savedMuted ? 0 : currentVolume);

    function updateVolumeIcon(vol) {
        if (!volumeIcon) return;
        volumeIcon.className = "fa-solid";
        if (audio.muted || vol === 0) {
            volumeIcon.classList.add("fa-volume-xmark");
        } else if (vol < 0.4) {
            volumeIcon.classList.add("fa-volume-low");
        } else {
            volumeIcon.classList.add("fa-volume-high");
        }
    }

    if (volumeSlider) {
        volumeSlider.addEventListener("input", (e) => {
            const val = parseFloat(e.target.value) / 100;
            currentVolume = val;
            audio.muted = false;
            audio.volume = val;
            localStorage.setItem(VOL_KEY, val);
            localStorage.setItem(MUTED_KEY, "false");
            updateVolumeIcon(val);
        });
    }

    if (muteBtn) {
        muteBtn.addEventListener("click", () => {
            audio.muted = !audio.muted;
            localStorage.setItem(MUTED_KEY, audio.muted ? "true" : "false");
            if (!audio.muted) {
                audio.volume = currentVolume;
            }
            updateVolumeIcon(audio.muted ? 0 : currentVolume);
        });
    }

    /* ──────────────────────────────────────────
       2. UI PLAY / PAUSE STATE UPDATE
       ────────────────────────────────────────── */
    function setPlayingUI(playing) {
        if (playing) {
            if (discWrap) discWrap.classList.add("is-playing");
            if (toggleIcon) {
                toggleIcon.classList.remove("fa-play");
                toggleIcon.classList.add("fa-pause");
            }
            if (toggleBtn) toggleBtn.setAttribute("title", "Pause Music");
        } else {
            if (discWrap) discWrap.classList.remove("is-playing");
            if (toggleIcon) {
                toggleIcon.classList.remove("fa-pause");
                toggleIcon.classList.add("fa-play");
            }
            if (toggleBtn) toggleBtn.setAttribute("title", "Play Music");
        }
    }

    /* ──────────────────────────────────────────
       3. SMOOTH FADE IN AND FADE OUT
       ────────────────────────────────────────── */
    function fadeInAudio(targetVol, duration = 1000, callback) {
        if (isFading) clearInterval(fadeInterval);
        isFading = true;
        
        audio.volume = 0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                setPlayingUI(true);
                localStorage.setItem(STATE_KEY, "playing");
            }).catch((err) => {
                console.warn("Autoplay prevented:", err);
                setPlayingUI(false);
                isFading = false;
                return;
            });
        }

        const steps = 25;
        const stepTime = duration / steps;
        const volStep = targetVol / steps;
        let currentStep = 0;

        fadeInterval = setInterval(() => {
            currentStep++;
            if (!audio.muted) {
                audio.volume = Math.min(targetVol, currentStep * volStep);
            }
            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                isFading = false;
                if (!audio.muted) audio.volume = targetVol;
                if (callback) callback();
            }
        }, stepTime);
    }

    function fadeOutAudio(duration = 600, callback) {
        if (isFading) clearInterval(fadeInterval);
        isFading = true;

        const startVol = audio.volume;
        if (startVol === 0 || audio.paused) {
            audio.pause();
            setPlayingUI(false);
            isFading = false;
            if (callback) callback();
            return;
        }

        const steps = 20;
        const stepTime = duration / steps;
        const volStep = startVol / steps;
        let currentStep = 0;

        fadeInterval = setInterval(() => {
            currentStep++;
            if (!audio.muted) {
                audio.volume = Math.max(0, startVol - currentStep * volStep);
            }
            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                audio.pause();
                setPlayingUI(false);
                localStorage.setItem(STATE_KEY, "paused");
                isFading = false;
                if (!audio.muted) audio.volume = currentVolume; // Restore for next play
                if (callback) callback();
            }
        }, stepTime);
    }

    /* ──────────────────────────────────────────
       4. TOGGLE BUTTON CLICK HANDLER
       ────────────────────────────────────────── */
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            if (audio.paused) {
                fadeInAudio(audio.muted ? 0 : currentVolume, 800);
            } else {
                fadeOutAudio(600);
            }
        });
    }

    /* ──────────────────────────────────────────
       5. MEMORY ACROSS PAGES & AUTOPLAY POLICY
       ────────────────────────────────────────── */
    const savedTime = localStorage.getItem(TIME_KEY);
    const savedState = localStorage.getItem(STATE_KEY);

    if (savedTime && !isNaN(parseFloat(savedTime))) {
        try {
            audio.currentTime = parseFloat(savedTime);
        } catch (e) {
            // Ignore if audio not loaded yet
        }
    }

    // Save playback position periodically while playing
    setInterval(() => {
        if (!audio.paused && !audio.ended) {
            localStorage.setItem(TIME_KEY, audio.currentTime.toString());
        }
    }, 1000);

    // Save before navigating away
    window.addEventListener("beforeunload", () => {
        localStorage.setItem(TIME_KEY, audio.currentTime.toString());
        if (!audio.paused) {
            // Quick fade out on page unload
            localStorage.setItem(STATE_KEY, "playing");
        }
    });

    // Handle seamless transition out when our CSS page-transitioning triggers
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === "class" && document.body.classList.contains("page-transitioning-out")) {
                if (!audio.paused) {
                    fadeOutAudio(320);
                    localStorage.setItem(STATE_KEY, "playing"); // Keep state playing for next page!
                }
            }
        });
    });
    observer.observe(document.body, { attributes: true });

    /* ──────────────────────────────────────────
       6. USER INTERACTION TRIGGER (Browser Policy)
       ────────────────────────────────────────── */
    // If the music was marked as 'playing' on the previous page, try to autoplay or wait for interaction
    if (savedState === "playing") {
        const targetVol = audio.muted ? 0 : currentVolume;
        const attemptPlay = () => {
            audio.volume = 0;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setPlayingUI(true);
                    // Smooth fade in
                    let step = 0;
                    const steps = 15;
                    const intv = setInterval(() => {
                        step++;
                        if (!audio.muted) audio.volume = Math.min(targetVol, step * (targetVol / steps));
                        if (step >= steps) clearInterval(intv);
                    }, 50);
                }).catch(() => {
                    // Autoplay blocked: wait for first interaction
                    attachInteractionListener();
                });
            }
        };

        attemptPlay();
    }

    function attachInteractionListener() {
        const events = ["click", "keydown", "touchstart", "pointerdown"];
        const resumeMusic = () => {
            if (audio.paused && localStorage.getItem(STATE_KEY) === "playing") {
                fadeInAudio(audio.muted ? 0 : currentVolume, 1000);
            }
            events.forEach((evt) => window.removeEventListener(evt, resumeMusic, true));
        };
        events.forEach((evt) => window.addEventListener(evt, resumeMusic, { once: true, capture: true }));
    }
});
