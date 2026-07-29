/* ═══════════════════════════════════════════════════════════
   Forever Us — Gallery Page Interactivity
   ═══════════════════════════════════════════════════════════
   Features:
     1. Lightbox — open, close, navigate, info display
     2. Image Zoom — in, out, reset, scroll wheel, double-click
     3. Image Drag / Pan when zoomed
     4. Keyboard Navigation — arrows, escape, +/-
     5. Lazy Loading — IntersectionObserver fade-in
     6. Touch Swipe — mobile prev/next
   ═══════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* ──────────────────────────────────────────
       0. GALLERY IMAGE COLLECTION
       ────────────────────────────────────────── */
    const allImages = document.querySelectorAll(".gallery-card-img");
    const imageData = [];

    allImages.forEach((img) => {
        imageData.push({
            src: img.getAttribute("data-full-src") || img.src,
            title: img.getAttribute("data-title") || "",
            caption: img.getAttribute("data-caption") || "",
            date: img.getAttribute("data-date") || "",
        });
    });


    /* ──────────────────────────────────────────
       1. LIGHTBOX — CORE
       ────────────────────────────────────────── */
    const lightbox        = document.getElementById("lightbox");
    const lightboxBackdrop = document.getElementById("lightboxBackdrop");
    const lightboxClose   = document.getElementById("lightboxClose");
    const lightboxPrev    = document.getElementById("lightboxPrev");
    const lightboxNext    = document.getElementById("lightboxNext");
    const lightboxImg     = document.getElementById("lightboxImg");
    const lightboxImgWrap = document.getElementById("lightboxImgWrapper");
    const lightboxTitle   = document.getElementById("lightboxTitle");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxDate    = document.getElementById("lightboxDate");
    const lightboxCounter = document.getElementById("lightboxCounter");
    const zoomInBtn       = document.getElementById("lightboxZoomIn");
    const zoomOutBtn      = document.getElementById("lightboxZoomOut");
    const zoomResetBtn    = document.getElementById("lightboxZoomReset");

    let currentIndex = 0;
    let currentZoom = 1;
    let isDragging = false;
    let startX = 0, startY = 0;
    let translateX = 0, translateY = 0;

    const MIN_ZOOM = 1;
    const MAX_ZOOM = 4;
    const ZOOM_STEP = 0.5;

    /**
     * Open the lightbox at the given image index.
     */
    function openLightbox(index) {
        if (!lightbox || index < 0 || index >= imageData.length) return;

        currentIndex = index;
        currentZoom = 1;
        translateX = 0;
        translateY = 0;

        updateLightboxImage();

        lightbox.hidden = false;
        // Force reflow for transition
        void lightbox.offsetHeight;
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    /**
     * Close the lightbox.
     */
    function closeLightbox() {
        if (!lightbox) return;

        lightbox.classList.remove("active");
        document.body.style.overflow = "";

        setTimeout(() => {
            lightbox.hidden = true;
            resetZoom();
        }, 300);
    }

    /**
     * Navigate to the previous or next image.
     */
    function navigate(direction) {
        currentIndex = (currentIndex + direction + imageData.length) % imageData.length;
        resetZoom();
        updateLightboxImage();
    }

    /**
     * Update the lightbox image and info panel.
     */
    function updateLightboxImage() {
        const data = imageData[currentIndex];
        if (!data || !lightboxImg) return;

        // Fade out
        lightboxImg.style.opacity = "0";

        setTimeout(() => {
            lightboxImg.src = data.src;
            lightboxImg.alt = data.title;

            if (lightboxTitle)   lightboxTitle.textContent = data.title;
            if (lightboxCaption) lightboxCaption.textContent = data.caption;
            if (lightboxDate)    lightboxDate.textContent = data.date;
            if (lightboxCounter) lightboxCounter.textContent = `${currentIndex + 1} / ${imageData.length}`;

            // Show/hide caption & date
            if (lightboxCaption) lightboxCaption.style.display = data.caption ? "block" : "none";
            if (lightboxDate)    lightboxDate.style.display = data.date ? "inline" : "none";

            // Show/hide nav buttons
            if (lightboxPrev) lightboxPrev.style.display = imageData.length > 1 ? "flex" : "none";
            if (lightboxNext) lightboxNext.style.display = imageData.length > 1 ? "flex" : "none";

            // Fade in once loaded
            lightboxImg.onload = () => {
                lightboxImg.style.opacity = "1";
            };

            // Fallback if already cached
            if (lightboxImg.complete) {
                lightboxImg.style.opacity = "1";
            }
        }, 150);
    }


    /* ──────────────────────────────────────────
       2. ZOOM CONTROLS
       ────────────────────────────────────────── */
    function applyZoom() {
        if (!lightboxImg) return;
        lightboxImg.style.transform = `scale(${currentZoom}) translate(${translateX}px, ${translateY}px)`;
        lightboxImg.style.cursor = currentZoom > 1 ? "grab" : "default";
    }

    function zoomIn() {
        currentZoom = Math.min(currentZoom + ZOOM_STEP, MAX_ZOOM);
        applyZoom();
    }

    function zoomOut() {
        currentZoom = Math.max(currentZoom - ZOOM_STEP, MIN_ZOOM);
        if (currentZoom === MIN_ZOOM) {
            translateX = 0;
            translateY = 0;
        }
        applyZoom();
    }

    function resetZoom() {
        currentZoom = 1;
        translateX = 0;
        translateY = 0;
        applyZoom();
    }


    /* ──────────────────────────────────────────
       3. IMAGE DRAG / PAN (when zoomed)
       ────────────────────────────────────────── */
    if (lightboxImgWrap) {
        lightboxImgWrap.addEventListener("mousedown", (e) => {
            if (currentZoom <= 1) return;
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            lightboxImg.style.cursor = "grabbing";
            e.preventDefault();
        });

        let dragTicking = false;
        document.addEventListener("mousemove", (e) => {
            if (!isDragging || dragTicking || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
            dragTicking = true;
            requestAnimationFrame(() => {
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                applyZoom();
                dragTicking = false;
            });
        }, { passive: true });

        document.addEventListener("mouseup", () => {
            if (isDragging) {
                isDragging = false;
                if (lightboxImg) lightboxImg.style.cursor = currentZoom > 1 ? "grab" : "default";
            }
        });
    }


    /* ──────────────────────────────────────────
       4. EVENT LISTENERS
       ────────────────────────────────────────── */

    // Open lightbox from gallery cards
    document.querySelectorAll(".gallery-card-img, .gallery-card-zoom-btn").forEach((el) => {
        el.addEventListener("click", (e) => {
            e.stopPropagation();
            const index = parseInt(el.getAttribute("data-index"), 10);
            if (!isNaN(index)) openLightbox(index);
        });
    });

    // Also allow clicking the whole card
    document.querySelectorAll(".gallery-card").forEach((card) => {
        card.addEventListener("click", () => {
            const img = card.querySelector(".gallery-card-img");
            if (img) {
                const index = parseInt(img.getAttribute("data-index"), 10);
                if (!isNaN(index)) openLightbox(index);
            }
        });
    });

    // Close
    if (lightboxClose)   lightboxClose.addEventListener("click", closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);

    // Navigation
    if (lightboxPrev) lightboxPrev.addEventListener("click", () => navigate(-1));
    if (lightboxNext) lightboxNext.addEventListener("click", () => navigate(1));

    // Zoom buttons
    if (zoomInBtn)    zoomInBtn.addEventListener("click", zoomIn);
    if (zoomOutBtn)   zoomOutBtn.addEventListener("click", zoomOut);
    if (zoomResetBtn) zoomResetBtn.addEventListener("click", resetZoom);

    // Double-click to zoom
    if (lightboxImg) {
        lightboxImg.addEventListener("dblclick", () => {
            if (currentZoom > 1) {
                resetZoom();
            } else {
                currentZoom = 2;
                applyZoom();
            }
        });
    }

    // Scroll wheel zoom
    if (lightboxImgWrap) {
        lightboxImgWrap.addEventListener("wheel", (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                zoomIn();
            } else {
                zoomOut();
            }
        }, { passive: false });
    }


    /* ──────────────────────────────────────────
       5. KEYBOARD NAVIGATION
       ────────────────────────────────────────── */
    document.addEventListener("keydown", (e) => {
        if (!lightbox || !lightbox.classList.contains("active")) return;

        switch (e.key) {
            case "Escape":
                closeLightbox();
                break;
            case "ArrowLeft":
                navigate(-1);
                break;
            case "ArrowRight":
                navigate(1);
                break;
            case "+":
            case "=":
                e.preventDefault();
                zoomIn();
                break;
            case "-":
                e.preventDefault();
                zoomOut();
                break;
            case "0":
                resetZoom();
                break;
        }
    });


    /* ──────────────────────────────────────────
       6. TOUCH SWIPE (mobile prev/next)
       ────────────────────────────────────────── */
    let touchStartX = 0;
    let touchStartY = 0;

    if (lightboxImgWrap) {
        lightboxImgWrap.addEventListener("touchstart", (e) => {
            if (currentZoom > 1) return; // Don't swipe when zoomed
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        lightboxImgWrap.addEventListener("touchend", (e) => {
            if (currentZoom > 1) return;
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;

            // Only swipe if horizontal movement is dominant
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    navigate(1); // Swipe left → next
                } else {
                    navigate(-1); // Swipe right → prev
                }
            }
        }, { passive: true });
    }


    /* ──────────────────────────────────────────
       7. LAZY LOADING ANIMATIONS
       ────────────────────────────────────────── */
    const lazyItems = document.querySelectorAll(".masonry-item");

    if (lazyItems.length > 0) {
        const lazyObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationPlayState = "running";
                        lazyObserver.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: "100px",
                threshold: 0.1,
            }
        );

        lazyItems.forEach((item) => {
            item.style.animationPlayState = "paused";
            lazyObserver.observe(item);
        });
    }
});
