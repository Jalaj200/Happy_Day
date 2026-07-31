/* ═══════════════════════════════════════════════════════════
   Forever Us — Unified Background Music Player Engine
   ═══════════════════════════════════════════════════════════
   Features:
     1. Play / Pause & Disc Rotation Animation
     2. Volume Slider & Mute Toggle with LocalStorage Persistence
     3. Cross-Page Playback State & Time Memory (localStorage)
     4. Smooth Audio Fade-In and Fade-Out Transitions
     5. Respects Browser Autoplay Policies (Starts on User Interaction)
     6. Reusable Progress Bar Component (shared across all players)
     7. Global Play/Pause Sync (all player UIs stay in lockstep)
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
        const icons = [document.getElementById("musicVolumeIcon"), document.getElementById("homeVolumeIcon")];
        icons.forEach(icon => {
            if (!icon) return;
            icon.className = "fa-solid";
            if (audio.muted || vol === 0) {
                icon.classList.add("fa-volume-xmark");
            } else if (vol < 0.4) {
                icon.classList.add("fa-volume-low");
            } else {
                icon.classList.add("fa-volume-high");
            }
        });
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

    function toggleMute() {
        audio.muted = !audio.muted;
        localStorage.setItem(MUTED_KEY, audio.muted ? "true" : "false");
        if (!audio.muted) {
            audio.volume = currentVolume;
        }
        updateVolumeIcon(audio.muted ? 0 : currentVolume);
    }

    const mutes = [document.getElementById("musicMuteBtn"), document.getElementById("homeMuteBtn")];
    mutes.forEach(btn => {
        if (btn) btn.addEventListener("click", toggleMute);
    });

    // Wire up Next/Prev/Repeat to a simple toast for now
    ["homePrevBtn", "homeNextBtn", "homeRepeatBtn"].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener("click", () => {
            // Can add toast here if desired, or just pulse the button
            btn.style.transform = "scale(0.9)";
            setTimeout(() => btn.style.transform = "", 150);
        });
    });

    /* ──────────────────────────────────────────
       2. GLOBAL PLAY/PAUSE UI SYNC
       ────────────────────────────────────────── */
    // Internal floating-player UI update
    function setPlayingUI(playing) {
        if (playing) {
            if (discWrap) discWrap.classList.add("is-playing");
            if (toggleIcon) {
                toggleIcon.classList.remove("fa-play");
                toggleIcon.classList.add("fa-pause");
            }
            if (toggleBtn) toggleBtn.setAttribute("title", "Pause Music");

            // Reveal drag handle once playback starts
            const dragHandle = document.getElementById("musicDragHandle");
            if (dragHandle) dragHandle.classList.remove("d-none");
        } else {
            if (discWrap) discWrap.classList.remove("is-playing");
            if (toggleIcon) {
                toggleIcon.classList.remove("fa-pause");
                toggleIcon.classList.add("fa-play");
            }
            if (toggleBtn) toggleBtn.setAttribute("title", "Play Music");
        }
    }

    // Broadcast play/pause to ALL registered external players via audio events
    audio.addEventListener("play", () => {
        setPlayingUI(true);
        document.dispatchEvent(new CustomEvent("foreverus:playstate", { detail: { playing: true } }));
    });
    audio.addEventListener("pause", () => {
        setPlayingUI(false);
        document.dispatchEvent(new CustomEvent("foreverus:playstate", { detail: { playing: false } }));
    });

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
                localStorage.setItem(STATE_KEY, "paused");
                isFading = false;
                if (!audio.muted) audio.volume = currentVolume; // Restore for next play
                if (callback) callback();
            }
        }, stepTime);
    }

    // Expose fade functions globally so external players can use them
    window.foreverUsFadeIn = () => fadeInAudio(audio.muted ? 0 : currentVolume, 800);
    window.foreverUsFadeOut = () => fadeOutAudio(600);

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

    /* ──────────────────────────────────────────
       7. REUSABLE PROGRESS BAR COMPONENT & MANAGER
       ────────────────────────────────────────── */
    function formatTime(seconds) {
        if (!isFinite(seconds) || seconds < 0) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ":" + (secs < 10 ? "0" : "") + secs;
    }

    const ProgressManager = {
        bars: [],
        isScrubbing: false,

        register(els) {
            if (!els.trackEl || !els.fillEl) return;
            this.bars.push(els);
            this.bindEvents(els);
        },

        updateAllFromAudio() {
            if (this.isScrubbing) return;
            const dur = audio.duration;
            if (!isFinite(dur) || dur === 0) return;
            const pct = (audio.currentTime / dur) * 100;
            const timeStr = formatTime(audio.currentTime);
            
            this.bars.forEach(b => {
                b.fillEl.style.width = pct + "%";
                if (b.thumbEl) b.thumbEl.style.left = pct + "%";
                if (b.currentEl) b.currentEl.textContent = timeStr;
                b.trackEl.setAttribute("aria-valuenow", Math.round(pct));
            });
        },

        updateAllToPreview(ratio) {
            const dur = audio.duration;
            if (!isFinite(dur) || dur === 0) return;
            const pct = ratio * 100;
            const timeStr = formatTime(ratio * dur);

            this.bars.forEach(b => {
                b.fillEl.style.width = pct + "%";
                if (b.thumbEl) b.thumbEl.style.left = pct + "%";
                if (b.currentEl) b.currentEl.textContent = timeStr;
                b.trackEl.setAttribute("aria-valuenow", Math.round(pct));
            });
        },

        updateDuration() {
            if (isFinite(audio.duration) && audio.duration > 0) {
                const totalStr = formatTime(audio.duration);
                this.bars.forEach(b => {
                    if (b.totalEl) b.totalEl.textContent = totalStr;
                    if (b.wrapEl) b.wrapEl.classList.remove("d-none");
                });
                this.updateAllFromAudio();
            }
        },

        bindEvents(b) {
            const getRatio = (clientX) => {
                const rect = b.trackEl.getBoundingClientRect();
                let ratio = (clientX - rect.left) / rect.width;
                return Math.max(0, Math.min(1, ratio));
            };

            b.trackEl.addEventListener("pointerdown", (e) => {
                if (e.button !== 0 && e.pointerType !== "touch") return;
                if (!isFinite(audio.duration) || audio.duration === 0) return;

                this.isScrubbing = true;
                this.bars.forEach(bar => {
                    const wrap = bar.wrapEl || bar.trackEl.closest(".music-progress-wrap, .symphony-scrubber");
                    if (wrap) wrap.classList.add("is-seeking");
                });
                
                b.trackEl.setPointerCapture(e.pointerId);
                e.preventDefault();

                this.updateAllToPreview(getRatio(e.clientX));
            });

            b.trackEl.addEventListener("pointermove", (e) => {
                if (!this.isScrubbing) return;
                e.preventDefault();
                this.updateAllToPreview(getRatio(e.clientX));
            });

            const onSeekEnd = (e) => {
                if (!this.isScrubbing) return;
                this.isScrubbing = false;
                
                this.bars.forEach(bar => {
                    const wrap = bar.wrapEl || bar.trackEl.closest(".music-progress-wrap, .symphony-scrubber");
                    if (wrap) wrap.classList.remove("is-seeking");
                });
                b.trackEl.releasePointerCapture(e.pointerId);

                // Commit the seek to the audio element exactly once
                const ratio = getRatio(e.clientX);
                if (isFinite(audio.duration)) {
                    audio.currentTime = ratio * audio.duration;
                }
            };

            b.trackEl.addEventListener("pointerup", onSeekEnd);
            b.trackEl.addEventListener("pointercancel", onSeekEnd);

            b.trackEl.addEventListener("keydown", (e) => {
                if (!isFinite(audio.duration) || audio.duration === 0) return;
                if (e.key === "ArrowLeft") {
                    audio.currentTime = Math.max(0, audio.currentTime - 5);
                    e.preventDefault();
                } else if (e.key === "ArrowRight") {
                    audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
                    e.preventDefault();
                }
            });
        }
    };

    // Eagerly reveal if metadata already available
    if (audio.readyState >= 1) ProgressManager.updateDuration();

    audio.addEventListener("loadedmetadata", () => ProgressManager.updateDuration());
    audio.addEventListener("durationchange", () => ProgressManager.updateDuration());
    audio.addEventListener("timeupdate", () => ProgressManager.updateAllFromAudio());
    audio.addEventListener("seeked", () => ProgressManager.updateAllFromAudio());
    audio.addEventListener("ended", () => {
        ProgressManager.bars.forEach(b => {
            b.fillEl.style.width = "100%";
            if (b.thumbEl) b.thumbEl.style.left = "100%";
            if (b.currentEl) b.currentEl.textContent = formatTime(audio.duration);
        });
    });

    // ── Bind floating mini-player progress bar ──
    ProgressManager.register({
        trackEl: document.getElementById("musicProgressTrack"),
        fillEl:  document.getElementById("musicProgressFill"),
        thumbEl: document.getElementById("musicProgressThumb"),
        currentEl: document.getElementById("musicTimeCurrent"),
        totalEl:   document.getElementById("musicTimeTotal"),
        wrapEl:    document.getElementById("musicProgressWrap"),
    });

    // ── Bind homepage symphony scrubber (if present on this page) ──
    ProgressManager.register({
        trackEl: document.getElementById("homeScrubberTrack"),
        fillEl:  document.getElementById("homeScrubberFill"),
        thumbEl: document.getElementById("homeScrubberThumb"),
        currentEl: document.getElementById("homeScrubberCurrent"),
        totalEl:   document.getElementById("homeScrubberTotal"),
        wrapEl:    document.getElementById("homeSymphonyScrubber"),
    });

    /* ──────────────────────────────────────────
       8. FLOATING PLAYER DRAG & REPOSITION
       ────────────────────────────────────────── */
    const dragHandle = document.getElementById("musicDragHandle");
    const POS_KEY = "forever_us_music_pos";

    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;
    let rafId = null;

    const enforceBounds = () => {
        if (!widget) return;
        const rect = widget.getBoundingClientRect();
        // Safe margin from viewport edges (avoid scroll to top button, etc)
        const safeMarginX = 20;
        const safeMarginY = 20;
        
        // Read current computed top/left
        let currentLeft = parseFloat(widget.style.left) || rect.left;
        let currentTop = parseFloat(widget.style.top) || rect.top;

        // Clamp horizontally
        if (currentLeft < safeMarginX) currentLeft = safeMarginX;
        if (currentLeft + rect.width > window.innerWidth - safeMarginX) {
            currentLeft = window.innerWidth - rect.width - safeMarginX;
        }
        
        // Clamp vertically
        if (currentTop < safeMarginY) currentTop = safeMarginY;
        if (currentTop + rect.height > window.innerHeight - safeMarginY) {
            currentTop = window.innerHeight - rect.height - safeMarginY;
        }

        widget.style.left = currentLeft + 'px';
        widget.style.top = currentTop + 'px';
        widget.style.bottom = 'auto'; // Disable CSS bottom constraint

        // Save position for persistence across pages
        localStorage.setItem(POS_KEY, JSON.stringify({ x: currentLeft, y: currentTop }));
    };

    const loadPosition = () => {
        const savedPos = localStorage.getItem(POS_KEY);
        if (savedPos) {
            try {
                const pos = JSON.parse(savedPos);
                if (typeof pos.x === 'number' && typeof pos.y === 'number') {
                    // Temporarily apply to check bounds against current viewport size
                    widget.style.transition = 'none'; // prevent sweep animation
                    widget.style.left = pos.x + 'px';
                    widget.style.top = pos.y + 'px';
                    widget.style.bottom = 'auto';
                    
                    // Force reflow and restore transition
                    void widget.offsetWidth; 
                    widget.style.transition = '';
                    
                    enforceBounds();
                }
            } catch (e) {
                // Ignore parse errors
            }
        }
    };

    if (dragHandle && widget) {
        loadPosition();

        dragHandle.addEventListener("pointerdown", (e) => {
            // Only allow main button (left click / touch)
            if (e.button !== 0 && e.pointerType !== "touch") return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = widget.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            
            // Set explicit inline left/top so transform can be relative to it
            widget.style.left = initialLeft + 'px';
            widget.style.top = initialTop + 'px';
            widget.style.bottom = 'auto';

            widget.classList.add("is-dragging");
            dragHandle.setPointerCapture(e.pointerId);
            e.preventDefault(); // Prevents selection
        });

        dragHandle.addEventListener("pointermove", (e) => {
            if (!isDragging) return;
            e.preventDefault(); // Prevents scroll on touch
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                // Use hardware accelerated transform for 60fps drag
                widget.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(1.02)`;
            });
        });

        const onDragEnd = (e) => {
            if (!isDragging) return;
            isDragging = false;
            dragHandle.releasePointerCapture(e.pointerId);
            
            if (rafId) cancelAnimationFrame(rafId);
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            // Apply final position to layout props
            widget.style.left = (initialLeft + dx) + 'px';
            widget.style.top = (initialTop + dy) + 'px';
            widget.style.transform = ''; // clear drag transform
            
            widget.classList.remove("is-dragging");
            
            // Re-clamp bounds and save
            enforceBounds();
        };

        dragHandle.addEventListener("pointerup", onDragEnd);
        dragHandle.addEventListener("pointercancel", onDragEnd);
        
        let resizeTimeout;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // If it was moved by user, it has inline style left. Enforce bounds on resize.
                if (widget.style.left) enforceBounds();
            }, 250);
        });
    }

});
