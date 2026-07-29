import os

html_content = '''{% extends "base.html" %}
{% load static %}

{% block title %}{{ site_name }} — Cherished Memories 📸💖{% endblock %}

{% block extra_css %}
<link rel="stylesheet" href="{% static 'css/memories.css' %}?v=cinematic_bg_final">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Great+Vibes&family=Manrope:wght@600&family=Playfair+Display:wght@700&family=Poppins:wght@400&display=swap" rel="stylesheet">
{% endblock %}

{% block content %}
<section class="memories-section">
    <div class="memories-header text-center">
        <h2 class="memories-subtitle font-cursive">❤️ Relive The Moments ❤️</h2>
        <h1 class="memories-title font-serif">Our Beautiful Memories</h1>
        <div class="memories-divider">
            <span class="divider-line"></span>
            <span class="divider-icon">❤️</span>
            <span class="divider-line"></span>
        </div>
        <p class="memories-intro">
            Every photograph holds a story. Every story holds a piece of my heart.<br>
            Let's relive the moments that made us who we are today.
        </p>
    </div>

    <div class="timeline-wrapper">
        <div class="timeline-line"></div>
        
        {% if memories %}
        {% for memory in memories %}
        <div class="timeline-item">
            <div class="timeline-heart">
                <i class="fa-solid fa-heart"></i>
            </div>
            
            <div class="memory-card {% if forloop.counter|divisibleby:2 %}reverse-layout{% endif %}">
                <div class="memory-card-image">
                    {% if memory.image %}
                    <img src="{{ memory.image.url }}" alt="{{ memory.title }}">
                    {% else %}
                    <div class="fallback-img">{{ memory.emoji|default:'💕' }}</div>
                    {% endif %}
                </div>
                
                <div class="memory-card-content">
                    <div class="memory-date-badge">
                        <i class="fa-regular fa-calendar"></i> {{ memory.date_label }}
                    </div>
                    <h3 class="memory-title-card font-serif">✨ {{ memory.title }}</h3>
                    
                    <div class="memory-meta">
                        {% if memory.location %}
                        <span class="meta-pill"><i class="fa-solid fa-location-dot"></i> {{ memory.location }}</span>
                        {% endif %}
                        {% if memory.time %}
                        <span class="meta-pill"><i class="fa-regular fa-clock"></i> {{ memory.time }}</span>
                        {% endif %}
                        {% if memory.mood %}
                        <span class="meta-pill"><i class="fa-solid fa-sparkles"></i> {{ memory.mood }}</span>
                        {% endif %}
                    </div>
                    
                    <div class="memory-summary">
                        {{ memory.description|truncatewords:30 }}
                    </div>
                    
                    <div class="memory-action">
                        <button class="custom-premium-btn" data-bs-toggle="modal" data-bs-target="#modal-{{ memory.id }}">
                            <i class="fa-solid fa-heart me-1"></i> Read Full Story &rarr;
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {% endfor %}
        {% else %}
        <div class="text-center py-5">
            <h3 class="font-serif text-white">No Memories Created Yet</h3>
        </div>
        {% endif %}
    </div>

    {% if is_paginated %}
    <div class="pagination-container">
        <div class="pagination-wrapper">
            {% if page_obj.has_previous %}
            <a href="?page={{ page_obj.previous_page_number }}" class="page-nav">&lt; Previous</a>
            {% else %}
            <span class="page-nav disabled">&lt; Previous</span>
            {% endif %}
            
            {% for num in page_obj.paginator.page_range %}
            {% if page_obj.number == num %}
            <span class="page-num active">{{ num }}</span>
            {% else %}
            <a href="?page={{ num }}" class="page-num">{{ num }}</a>
            {% endif %}
            {% endfor %}
            
            {% if page_obj.has_next %}
            <a href="?page={{ page_obj.next_page_number }}" class="page-nav">Next &gt;</a>
            {% else %}
            <span class="page-nav disabled">Next &gt;</span>
            {% endif %}
        </div>
    </div>
    {% endif %}

    <!-- MODALS LOOP (OUTSIDE TIMELINE SO IT DOESNT BREAK SCROLL/LAYOUT) -->
    {% for memory in memories %}
    <div class="modal fade custom-modal" id="modal-{{ memory.id }}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable custom-modal-dialog">
            <div class="modal-content custom-modal-content">
                <button type="button" class="btn-close-modal" data-bs-dismiss="modal">&times;</button>
                
                <div class="modal-body custom-modal-body">
                    {% if memory.image %}
                    <img src="{{ memory.image.url }}" alt="{{ memory.title }}" class="modal-image">
                    {% endif %}
                    
                    <div class="text-center mt-3 mb-2">
                        <div class="memory-date-badge d-inline-block">
                            <i class="fa-regular fa-calendar"></i> {{ memory.date_label }}
                        </div>
                    </div>
                    
                    <h3 class="modal-title-card font-serif text-center">✨ {{ memory.title }}</h3>
                    
                    <div class="memory-meta justify-content-center mb-4">
                        {% if memory.location %}
                        <span class="meta-pill"><i class="fa-solid fa-location-dot"></i> {{ memory.location }}</span>
                        {% endif %}
                        {% if memory.time %}
                        <span class="meta-pill"><i class="fa-regular fa-clock"></i> {{ memory.time }}</span>
                        {% endif %}
                        {% if memory.mood %}
                        <span class="meta-pill"><i class="fa-solid fa-sparkles"></i> {{ memory.mood }}</span>
                        {% endif %}
                    </div>
                    
                    <div class="modal-section-title">
                        <i class="fa-solid fa-comment-dots text-pink"></i> Our Story
                    </div>
                    <p class="modal-text">{{ memory.description }}</p>
                    {% if memory.expanded_content %}
                    <p class="modal-text">{{ memory.expanded_content|linebreaksbr }}</p>
                    {% endif %}
                    
                    {% if memory.special_reason %}
                    <div class="modal-special-box">
                        <div class="special-title"><i class="fa-solid fa-heart text-pink"></i> Why This Is Special</div>
                        <p class="special-text">{{ memory.special_reason }}</p>
                    </div>
                    {% endif %}
                    
                    <div class="text-center mt-4 mb-2">
                        <button class="custom-premium-btn close-btn" data-bs-dismiss="modal">
                            Close <i class="fa-solid fa-heart ms-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {% endfor %}
    
    <!-- THE JOURNEY CONTINUES SECTION -->
    <div class="memories-ending text-center">
        <div class="ending-divider">
            <span class="ending-line"></span>
            <span class="ending-icon"><i class="fa-solid fa-heart"></i></span>
            <span class="ending-line"></span>
        </div>
        <h2 class="ending-title">❤️ The Journey Continues ❤️</h2>
        <p class="ending-quote">
            "Every memory we've created has become a chapter of our story.<br>
            The best pages are still waiting to be written together."
        </p>
        <div class="ending-decorations">
            <i class="fa-solid fa-heart float-heart float-heart-1"></i>
            <i class="fa-solid fa-heart float-heart float-heart-2"></i>
            <i class="fa-solid fa-star-of-life float-sparkle float-sparkle-1"></i>
            <i class="fa-solid fa-star-of-life float-sparkle float-sparkle-2"></i>
        </div>
        <a href="{% url 'love:home' %}" class="custom-premium-btn ending-btn">
            ✨ Our Next Chapter &rarr;
        </a>
    </div>
</section>
{% endblock %}

{% block extra_js %}
<script src="{% static 'js/memories.js' %}"></script>
{% endblock %}
'''

css_content = '''/* Reset & Variables */
:root {
    --bg-dark: #070305;
    --card-bg: #12050c;
    --pink-glow: #e91e63;
    --pink-light: #ff4081;
    --text-muted: #a0a0a0;
    --font-cormorant: 'Cormorant Garamond', serif;
    --font-playfair: 'Playfair Display', serif;
    --font-greatvibes: 'Great Vibes', cursive;
    --font-poppins: 'Poppins', sans-serif;
    --font-manrope: 'Manrope', sans-serif;
}



.text-pink {
    color: var(--pink-light) !important;
}
.font-serif {
    font-family: var(--font-serif);
}
.font-cursive {
    font-family: var(--font-cursive);
}

.memories-section {
    padding: 100px 0 60px;
    background: transparent;
    color: #fff;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Header */
.memories-header {
    max-width: 800px;
    margin: 0 auto 60px;
}
.memories-subtitle {
    color: var(--pink-light);
    font-family: var(--font-greatvibes);
    font-size: 2.2rem;
    letter-spacing: 1px;
    margin-bottom: 10px;
    text-shadow: 0 0 12px rgba(255, 64, 129, 0.5);
}
.memories-title {
    font-family: var(--font-cormorant);
    font-weight: 700;
    font-size: 3.5rem;
    letter-spacing: 0.5px;
    line-height: 1.1;
    margin-bottom: 20px;
}
.memories-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin-bottom: 20px;
}
.divider-line {
    height: 1px;
    width: 60px;
    background: linear-gradient(90deg, transparent, var(--pink-light), transparent);
}
.divider-icon {
    font-size: 1.2rem;
    color: var(--pink-glow);
    filter: drop-shadow(0 0 8px var(--pink-glow));
}
.memories-intro {
    font-family: var(--font-poppins);
    font-weight: 400;
    font-size: 1.1rem;
    color: #e0e0e0;
    line-height: 1.8;
}

/* Timeline Layout */
.timeline-wrapper {
    max-width: 1000px;
    margin: 0 auto;
    position: relative;
    padding: 20px 0;
}

/* The vertical glowing pink line */
.timeline-line {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 20px;
    width: 2px;
    background: var(--pink-light);
    box-shadow: 0 0 25px 8px rgba(255, 79, 165, 0.3), 0 0 15px var(--pink-glow), 0 0 5px var(--pink-light);
    z-index: 1;
}

.timeline-item {
    position: relative;
    margin-bottom: 60px;
    padding-left: 60px; /* Space for the timeline line on the left */
    width: 100%;
}

.timeline-heart {
    position: absolute;
    left: 20px; /* Aligned with the timeline line */
    top: 50%;
    transform: translate(-50%, -50%);
    width: 32px;
    height: 32px;
    background-color: var(--bg-dark);
    border: 2px solid #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    color: var(--pink-light);
    z-index: 2;
    box-shadow: 0 0 15px var(--pink-light), inset 0 0 8px rgba(255, 255, 255, 0.5);
}

/* Card */
.memory-card {
    background: rgba(43, 13, 58, 0.45);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), 0 0 30px rgba(233, 30, 99, 0.05);
    display: flex;
    align-items: stretch;
    min-height: 350px;
    z-index: 3;
    position: relative;
    overflow: hidden;
}

/* Alternating Layout */
.memory-card.reverse-layout {
    flex-direction: row !important;
}

.memory-card-image {
    width: 50%;
    position: relative;
}
.memory-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.fallback-img {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 5rem;
    background: linear-gradient(135deg, #2a0845 0%, #6441A5 100%);
}

.memory-card-content {
    width: 50%;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
}

/* Card Content Elements */
.memory-date-badge {
    display: inline-block;
    background-color: var(--pink-glow);
    color: #fff;
    font-family: var(--font-manrope);
    font-size: 0.8rem;
    letter-spacing: 0.5px;
    font-weight: 600;
    padding: 6px 16px;
    border-radius: 50px;
    margin-bottom: 20px;
    align-self: flex-start;
}

.memory-title-card, .modal-title-card {
    font-family: var(--font-playfair);
    font-weight: 700;
    font-size: 2.2rem;
    margin-bottom: 15px;
    color: #fff;
}

.memory-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
}

.meta-pill {
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #d0d0d0;
    font-family: var(--font-manrope);
    font-size: 0.8rem;
    letter-spacing: 0.5px;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 50px;
}
.meta-pill i {
    color: var(--pink-light);
    margin-right: 4px;
}

.memory-summary {
    color: var(--text-muted);
    font-family: var(--font-poppins);
    font-weight: 400;
    font-size: 0.95rem;
    line-height: 1.8;
    margin-bottom: 30px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Button */
.memory-action {
    margin-top: auto;
}
.custom-premium-btn {
    -webkit-appearance: none;
    appearance: none;
    display: inline-block;
    padding: 10px 24px;
    font-size: 0.95rem;
    font-weight: 600;
    color: #ffffff !important;
    text-decoration: none;
    text-align: center;
    border: none;
    border-radius: 50px;
    background: linear-gradient(135deg, #ff4081 0%, #e91e63 100%);
    box-shadow: 0 4px 15px rgba(233, 30, 99, 0.4);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    outline: none;
}
.custom-premium-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(233, 30, 99, 0.6);
}
.custom-premium-btn.close-btn {
    padding: 10px 30px;
    font-size: 1rem;
}

/* Pagination */
.pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 60px;
}
.pagination-wrapper {
    display: flex;
    align-items: center;
    gap: 15px;
    background: rgba(255, 255, 255, 0.03);
    padding: 10px 20px;
    border-radius: 50px;
    border: 1px solid rgba(255, 255, 255, 0.05);
}
.page-nav {
    color: #fff;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 600;
}
.page-nav.disabled {
    color: #555;
}
.page-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
    border-radius: 8px;
    background: transparent;
    color: #fff;
    text-decoration: none;
    font-weight: 600;
    transition: 0.3s;
}
.page-num.active {
    background-color: var(--pink-glow);
    box-shadow: 0 0 10px rgba(233, 30, 99, 0.5);
}
.page-num:not(.active):hover {
    background: rgba(255, 255, 255, 0.1);
}

/* Modal */
.custom-modal.show {
    position: fixed !important;
    inset: 0 !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    padding: 2rem !important;
    z-index: 9999 !important;
}
.custom-modal-dialog {
    width: min(900px, 90vw) !important;
    max-width: none !important;
    max-height: 90vh !important;
    margin: 0 !important;
}
.custom-modal-content {
    background-color: #0d0409 !important;
    border: 1px solid rgba(255, 64, 129, 0.3) !important;
    border-radius: 20px !important;
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(233, 30, 99, 0.1) !important;
    max-height: 90vh;
}
.btn-close-modal {
    position: absolute;
    top: 20px;
    right: 20px;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 2rem;
    line-height: 1;
    z-index: 10;
    cursor: pointer;
    transition: color 0.3s;
}
.btn-close-modal:hover {
    color: var(--pink-light);
}

.custom-modal-body {
    padding: 40px !important;
    overflow-y: auto;
}
.custom-modal-body::-webkit-scrollbar {
    width: 8px;
}
.custom-modal-body::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
}
.custom-modal-body::-webkit-scrollbar-thumb {
    background: rgba(233, 30, 99, 0.5);
    border-radius: 10px;
}
.modal-image {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 20px;
}

.modal-section-title {
    font-family: var(--font-playfair);
    font-size: 1.2rem;
    font-weight: 700;
    margin-top: 30px;
    margin-bottom: 15px;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
}
.modal-text {
    color: #c0c0c0;
    font-family: var(--font-poppins);
    font-weight: 400;
    line-height: 1.8;
    font-size: 0.95rem;
}

.modal-special-box {
    background: rgba(255, 64, 129, 0.05);
    border: 1px solid rgba(255, 64, 129, 0.2);
    border-radius: 12px;
    padding: 25px;
    margin-top: 30px;
}
.special-title {
    color: #fff;
    font-family: var(--font-playfair);
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
}
.special-text {
    color: #e0e0e0;
    font-family: var(--font-poppins);
    font-weight: 400;
    line-height: 1.8;
    margin-bottom: 0;
    font-style: italic;
}

/* Modal Fade-in and scale animations */
.modal.fade .modal-dialog {
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s;
    transform: scale(0.95);
    opacity: 0;
}
.modal.show .modal-dialog {
    transform: scale(1);
    opacity: 1;
}

/* Modal backdrop blur */
.modal-backdrop.show {
    backdrop-filter: blur(10px) !important;
    background-color: rgba(7, 3, 5, 0.85) !important;
    opacity: 1 !important;
}

/* Responsive */
@media (max-width: 768px) {
    .memory-card, .memory-card.reverse-layout {
        flex-direction: column;
    }
    .memory-card-image, .memory-card-content {
        width: 100%;
    }
    .memory-card-image img {
        height: 250px;
    }
    .timeline-item {
        padding-left: 40px;
    }
    .timeline-heart {
        left: 10px;
        width: 24px;
        height: 24px;
        font-size: 0.6rem;
    }
    .timeline-line {
        left: 10px;
    }
    .custom-modal-body {
        padding: 20px !important;
    }
}

/* Ending Section */
.memories-ending {
    margin-top: 80px;
    padding-top: 60px;
    padding-bottom: 40px;
    position: relative;
    z-index: 10;
}
.ending-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin-bottom: 30px;
}
.ending-line {
    height: 1px;
    width: 80px;
    background: linear-gradient(90deg, transparent, var(--pink-light), transparent);
}
.ending-icon {
    font-size: 1.2rem;
    color: var(--pink-glow);
    filter: drop-shadow(0 0 8px var(--pink-glow));
}
.ending-title {
    font-family: var(--font-greatvibes);
    font-size: 2.8rem;
    color: var(--pink-light);
    letter-spacing: 1px;
    margin-bottom: 15px;
    text-shadow: 0 0 12px rgba(255, 64, 129, 0.5);
}
.ending-quote {
    font-family: var(--font-poppins);
    font-weight: 400;
    font-size: 1.15rem;
    color: #e0e0e0;
    line-height: 1.8;
    max-width: 600px;
    margin: 0 auto 40px;
    font-style: italic;
}
.ending-btn {
    padding: 12px 30px;
    font-size: 1.05rem;
}

/* Subtle Floating Decor */
.ending-decorations {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
}
.float-heart, .float-sparkle {
    position: absolute;
    opacity: 0.3;
    animation: floatGently 6s ease-in-out infinite alternate;
}
.float-heart { color: var(--pink-glow); font-size: 1.2rem; }
.float-sparkle { color: #ffd700; font-size: 0.8rem; }

.float-heart-1 { top: 20%; left: 20%; animation-delay: 0s; }
.float-heart-2 { top: 50%; right: 25%; animation-delay: 1s; }
.float-sparkle-1 { top: 30%; right: 20%; animation-delay: 0.5s; }
.float-sparkle-2 { top: 60%; left: 25%; animation-delay: 1.5s; }

@keyframes floatGently {
    0% { transform: translateY(0) scale(1); opacity: 0.2; }
    100% { transform: translateY(-15px) scale(1.1); opacity: 0.5; }
}

@media (max-width: 768px) {
    .ending-title { font-size: 2.2rem; }
    .ending-quote { font-size: 1rem; padding: 0 20px; }
}
'''

with open('templates/love/memories.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

with open('static/css/memories.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

print("Files rewritten completely.")
