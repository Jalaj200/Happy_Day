import os

html = """{% extends "base.html" %}
{% load static %}

{% block title %}{{ site_name }} — Cherished Memories 📸💖{% endblock %}

{% block extra_css %}
<link rel="stylesheet" href="{% static 'css/memories.css' %}?v=rebuild_final_v5">
{% endblock %}

{% block content %}

<!-- ═══════════════════════════════════════════════
     MEMORIES HERO SECTION
     ═══════════════════════════════════════════════ -->
<section class="memories-hero" id="memoriesHero">
    <div class="memories-hero-bg" aria-hidden="true">
        <div class="memories-hero-gradient"></div>
        <div class="memories-hero-particles"></div>
        <div class="memories-ambient-glow glow-1"></div>
        <div class="memories-ambient-glow glow-2"></div>
    </div>
    
    <div class="container position-relative" style="z-index: 5;">
        <div class="memories-hero-content text-center">
            
            <!-- 1. Small Script Text -->
            <div class="memories-hero-script font-cursive animate-fade-in" data-delay="1">
                ❤️ Relive The Moments
            </div>

            <!-- 2. Large Heading -->
            <h1 class="memories-hero-title font-romantic animate-fade-in" data-delay="2">
                Our Beautiful Memories
            </h1>
            
            <!-- 3. Decorative Glowing Divider -->
            <div class="memories-hero-divider animate-fade-in" data-delay="3" aria-hidden="true">
                <span class="divider-swirl">~</span>
                <span class="divider-heart pulse-glow">❤️</span>
                <span class="divider-swirl">~</span>
            </div>
            
            <!-- 4. Subtitle -->
            <p class="memories-hero-subtitle font-elegant animate-fade-in" data-delay="4">
                Every photograph holds a story. Every story holds a piece of my heart.<br>Let's relive the moments that made us who we are today.
            </p>
            
        </div>
    </div>
</section>


<!-- ═══════════════════════════════════════════════
     MEMORIES CARDS GRID
     ═══════════════════════════════════════════════ -->
<section class="memories-section">
    <div class="container timeline-container-wrap">
        
        {% if memories %}
        <div class="timeline-container" id="memoriesGrid">
            <!-- Central Glowing Vertical Line -->
            <div class="timeline-line"></div>
            
            {% for memory in memories %}
            <!-- Alternating Timeline Row: Even rows (Image Left/Content Right), Odd rows (Content Left/Image Right) -->
            <div class="timeline-row {% if forloop.counter|divisibleby:2 %}timeline-row-even{% else %}timeline-row-odd{% endif %} animate-card-enter" style="--card-idx: {{ forloop.counter0 }};">
                
                <!-- Central Heart Node on the Timeline -->
                <div class="timeline-node pulse-glow">❤️</div>

                <!-- Single Premium Glass Card wrapping both Image and Content -->
                <div class="memory-card premium-timeline-card glass-card-apple w-100 d-flex">
                    
                    <!-- Image Column -->
                    <div class="timeline-image-col">
                        <div class="glass-img-frame">
                            {% if memory.image %}
                                <img src="{{ memory.image.url }}" alt="{{ memory.title }}" class="memory-card__img" loading="lazy" decoding="async">
                                <!-- Camera icon overlay -->
                                <div class="camera-icon-overlay"><i class="fa-solid fa-camera"></i></div>
                            {% else %}
                                <div class="memory-card__img-fallback {{ memory.gradient_class|default:'gradient-card-1' }}">
                                    <span class="memory-fallback-emoji">{{ memory.emoji|default:'💕' }}</span>
                                </div>
                            {% endif %}
                        </div>
                    </div>

                    <!-- Content Column -->
                    <div class="timeline-content-col d-flex flex-column align-items-center text-center justify-content-center">
                        
                        <!-- Date Badge (Centered at top of content) -->
                        <div class="memory-card-header-date w-100 d-flex justify-content-center mb-3">
                            <span class="memory-date-badge memory-date-pill glass-pill">
                                <i class="fa-solid fa-calendar-day me-1"></i>
                                {{ memory.date_label }}
                            </span>
                        </div>

                        <!-- Card Body -->
                        <div class="memory-card__body w-100 d-flex flex-column align-items-center">
                            
                            <!-- Title -->
                            <div class="memory-title-row d-flex justify-content-center align-items-center gap-2 mb-2 w-100">
                                <span class="memory-title-emoji">{{ memory.emoji|default:'💖' }}</span>
                                <h3 class="memory-title font-romantic mb-0">{{ memory.title }}</h3>
                            </div>
                            
                            <!-- Location, Time & Mood Badges in one row -->
                            <div class="memory-meta-grid d-flex justify-content-center align-items-center gap-2 flex-wrap my-3 w-100">
                                {% if memory.location %}
                                <div class="memory-meta-pill glass-pill">
                                    <i class="fa-solid fa-location-dot text-pink me-1"></i>
                                    <span>{{ memory.location }}</span>
                                </div>
                                {% endif %}
                                {% if memory.time %}
                                <div class="memory-meta-pill glass-pill">
                                    <i class="fa-solid fa-clock text-gold me-1"></i>
                                    <span>{{ memory.time }}</span>
                                </div>
                                {% endif %}
                                {% if memory.mood %}
                                <div class="memory-meta-pill glass-pill">
                                    <i class="fa-solid fa-sparkles text-accent me-1"></i>
                                    <span>{{ memory.mood }}</span>
                                </div>
                                {% endif %}
                            </div>

                            <!-- Description -->
                            <p class="memory-desc font-elegant text-center centered-desc">{{ memory.description|truncatewords:20 }}</p>

                            <!-- Premium Action Button -->
                            <div class="memory-card__footer mt-auto pt-3 w-100 d-flex justify-content-center">
                                <button type="button" class="custom-premium-btn" data-bs-toggle="modal" data-bs-target="#memoryModal{{ memory.id }}">
                                    ❤️ Read Full Story &rarr;
                                </button>
                            </div>
                        </div>
                        
                    </div>
                    
                    <!-- Soft Glow for the whole card -->
                    <div class="memory-card__glow" aria-hidden="true"></div>
                </div>
            </div>
            {% endfor %}
        </div>

        <!-- ── MODAL FOR FULL STORY ── -->
        {% for memory in memories %}
        <div class="modal fade" id="memoryModal{{ memory.id }}" tabindex="-1" aria-labelledby="memoryModalLabel{{ memory.id }}" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
                <div class="modal-content glass-strong memory-modal custom-modal-content">
                    
                    <div class="modal-header border-0 pb-0">
                        <div class="d-flex align-items-center gap-2">
                            <span class="modal-title-emoji">{{ memory.emoji|default:'💖' }}</span>
                            <h4 class="modal-title font-romantic text-gradient" id="memoryModalLabel{{ memory.id }}">
                                {{ memory.title }}
                            </h4>
                        </div>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body py-4 px-4 px-md-5 custom-modal-body">
                        {% if memory.image %}
                        <div class="modal-image-wrap mb-4">
                            <img src="{{ memory.image.url }}" alt="{{ memory.title }}" class="modal-img" loading="lazy" decoding="async">
                        </div>
                        {% endif %}
                        
                        <div class="modal-meta mb-4 d-flex align-items-center justify-content-center gap-3 flex-wrap">
                            <span class="memory-meta-pill glass-pill">
                                <i class="fa-solid fa-calendar-check text-accent me-1"></i>
                                {{ memory.date_label }}
                            </span>
                            {% if memory.location %}
                            <span class="memory-meta-pill glass-pill">
                                <i class="fa-solid fa-location-dot text-pink me-1"></i>
                                {{ memory.location }}
                            </span>
                            {% endif %}
                            {% if memory.time %}
                            <span class="memory-meta-pill glass-pill">
                                <i class="fa-solid fa-clock text-gold me-1"></i>
                                {{ memory.time }}
                            </span>
                            {% endif %}
                            {% if memory.mood %}
                            <span class="memory-meta-pill glass-pill">
                                <i class="fa-solid fa-sparkles text-accent me-1"></i>
                                {{ memory.mood }}
                            </span>
                            {% endif %}
                        </div>

                        <div class="modal-story-text font-elegant text-center">
                            <p class="lead text-white mb-4" style="line-height: 1.8;">{{ memory.description }}</p>
                            
                            {% if memory.expanded_content %}
                            <div class="expanded-story-box glass-card p-4 mt-3 mb-4 text-start">
                                <p class="mb-0" style="line-height: 1.85;">{{ memory.expanded_content|linebreaksbr }}</p>
                            </div>
                            {% endif %}

                            {% if memory.special_reason %}
                            <div class="memory-special-reason-box glass-special-card mt-4 mb-2 mx-auto" style="max-width: 95%;">
                                <div class="reason-header d-flex align-items-center justify-content-center gap-2 mb-2">
                                    <span class="reason-heart-icon">❤️</span>
                                    <span class="reason-title font-romantic">Why This Is Special</span>
                                </div>
                                <p class="reason-body font-italic mb-0 text-center">"{{ memory.special_reason }}"</p>
                            </div>
                            {% endif %}
                        </div>
                    </div>

                    <div class="modal-footer border-0 pt-0 justify-content-between align-items-center">
                        <span class="text-muted small">
                            <i class="fa-solid fa-heart text-primary me-1"></i> Forever Us Memory #{{ memory.id|default:forloop.counter }}
                        </span>
                        <button type="button" class="btn-glass" data-bs-dismiss="modal">
                            <i class="fa-solid fa-heart me-1"></i> Cherish Forever
                        </button>
                    </div>

                </div>
            </div>
        </div>
        {% endfor %}

        <!-- ═══════════════════════════════════════════════
             PAGINATION CONTROLS
             ═══════════════════════════════════════════════ -->
        {% if is_paginated %}
        <div class="pagination-container text-center mt-5 mb-5 pb-4">
            <nav aria-label="Memories pagination">
                <ul class="pagination justify-content-center align-items-center gap-3">
                    {% if page_obj.has_previous %}
                    <li class="page-item">
                        <a class="page-link pagination-btn glass-pill btn-ripple" href="?page={{ page_obj.previous_page_number }}" aria-label="Previous">
                            &larr; Previous
                        </a>
                    </li>
                    {% endif %}

                    {% for num in page_obj.paginator.page_range %}
                        {% if page_obj.number == num %}
                        <li class="page-item active" aria-current="page">
                            <span class="page-link pagination-btn glass-pill page-link--active btn-ripple">{{ num }}</span>
                        </li>
                        {% elif num > page_obj.number|add:'-3' and num < page_obj.number|add:'3' %}
                        <li class="page-item">
                            <a class="page-link pagination-btn glass-pill btn-ripple" href="?page={{ num }}">{{ num }}</a>
                        </li>
                        {% endif %}
                    {% endfor %}

                    {% if page_obj.has_next %}
                    <li class="page-item">
                        <a class="page-link pagination-btn glass-pill btn-ripple" href="?page={{ page_obj.next_page_number }}" aria-label="Next">
                            Next &rarr;
                        </a>
                    </li>
                    {% endif %}
                </ul>
            </nav>
        </div>
        {% endif %}

        {% else %}
        <!-- EMPTY STATE (Should never appear due to robust fallback) -->
        <div class="text-center py-5 my-5 glass-card reveal-scale">
            <span class="d-block font-size-4rem mb-3" aria-hidden="true">💌</span>
            <h3 class="font-romantic text-gradient">No Memories Created Yet</h3>
            <p class="text-secondary max-w-500 mx-auto">
                Head over to the Django Admin panel to upload your first romantic photo memory!
            </p>
            <a href="{% url 'love:home' %}" class="btn-romantic mt-3">Return Home</a>
        </div>
        {% endif %}

    </div>
</section>


<!-- ═══════════════════════════════════════════════
     BOTTOM CTA SECTION
     ═══════════════════════════════════════════════ -->
<section class="memories-cta-section">
    <div class="container">
        <div class="memories-cta glass-card text-center reveal-scale">
            <span class="memories-cta-emoji" aria-hidden="true">🌹</span>
            <h2 class="memories-cta-title font-romantic text-gradient">Our Journey Is Just Beginning</h2>
            <p class="memories-cta-text">
                Every single day adds another beautiful page to our story. Let's look at the photo gallery or read our handwritten love letter next.
            </p>
            <div class="d-flex justify-content-center gap-3 flex-wrap">
                <a href="{% url 'love:gallery' %}" class="btn-romantic">
                    <i class="fa-solid fa-images me-2"></i>
                    Photo Gallery
                </a>
                <a href="{% url 'love:love_letter' %}" class="btn-glass">
                    <i class="fa-solid fa-envelope-heart me-2"></i>
                    Love Letter
                </a>
            </div>
        </div>
    </div>
</section>

{% endblock %}

{% block extra_js %}
<script src="{% static 'js/memories.js' %}" defer></script>
{% endblock %}
"""

with open('templates/love/memories.html', 'w', encoding='utf-8') as f:
    f.write(html)
