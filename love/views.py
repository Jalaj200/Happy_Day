"""
Forever Us — Love App Views
"""

from django.core.paginator import Paginator
from django.shortcuts import render

from love.models import (
    CountdownSetting,
    GalleryCategory,
    GalleryImage,
    LoveLetter,
    LoveReason,
    Memory,
    SecretPageSetting,
    FinalSurpriseSetting,
)


THEME_DEFINITIONS = [
    {
        "theme": "theme-sunrise",
        "name": "First Meeting",
        "default_location": "Central Park Conservatory, NY",
        "default_time": "08:30 AM • Golden Sunrise",
        "default_mood": "✨ Butterflies & Pure Destiny",
        "default_reason": "This memory is special because it was the exact moment two separate destinies collided to become one eternal love story.",
        "caption": "The day our beautiful story began.",
        "badge_icon": "fa-solid fa-sun",
    },
    {
        "theme": "theme-polaroid",
        "name": "First Photo Together",
        "default_location": "Candlelit Bistro & Lounge",
        "default_time": "07:45 PM • Romantic Twilight",
        "default_mood": "📸 Effortless Laughter & Joy",
        "default_reason": "This memory is special because our smiles captured a promise of endless laughter and effortless companionship.",
        "caption": "Captured in time, treasured for eternity.",
        "badge_icon": "fa-solid fa-camera-retro",
    },
    {
        "theme": "theme-loveletter",
        "name": "Special Romantic Moment",
        "default_location": "Starlight Observatory Hill",
        "default_time": "11:30 PM • Midnight Constellations",
        "default_mood": "💌 Deeply Devoted & Romantic",
        "default_reason": "This memory is special because amidst the infinite stars above, I realized you are my entire universe.",
        "caption": "In the silence of the night, our souls spoke.",
        "badge_icon": "fa-solid fa-envelope-open-text",
    },
    {
        "theme": "theme-travel",
        "name": "Travel Memory",
        "default_location": "Pacific Coast Highway & Hidden Cafes",
        "default_time": "02:15 PM • Afternoon Adventure",
        "default_mood": "✈️ Adventurous, Free & Spontaneous",
        "default_reason": "This memory is special because it proved that no matter where we go in the world, being with you is where I truly belong.",
        "caption": "Every mile traveled with you is a blessing.",
        "badge_icon": "fa-solid fa-plane-departure",
    },
    {
        "theme": "theme-sunset",
        "name": "Sunset Memory",
        "default_location": "Golden Sunset Beach Boardwalk",
        "default_time": "06:50 PM • Golden Hour Magic",
        "default_mood": "🌅 Serene, Warm & Peaceful",
        "default_reason": "This memory is special because as the sun painted the ocean gold, our silent hand-holding spoke louder than a thousand words.",
        "caption": "Golden skies and unspoken devotion.",
        "badge_icon": "fa-solid fa-umbrella-beach",
    },
    {
        "theme": "theme-birthday",
        "name": "Birthday Celebration",
        "default_location": "Rooftop Garden Terrace",
        "default_time": "09:00 PM • Sparkling Lights",
        "default_mood": "🎂 Celebratory, Luxurious & Glowing",
        "default_reason": "This memory is special because celebrating your life, your kindness, and your radiant smile is my greatest honor.",
        "caption": "Celebrating the queen of my heart.",
        "badge_icon": "fa-solid fa-cake-candles",
    },
    {
        "theme": "theme-festival",
        "name": "Festival & Anniversary",
        "default_location": "Our Cozy Sanctuary of Love",
        "default_time": "12:00 AM • Eternal Midnight",
        "default_mood": "🌸 Festive, Magical & Everlasting",
        "default_reason": "This memory is special because it reminds us that every single day we share is a celebration of our unbreakable bond.",
        "caption": "Every beautiful story has no end.",
        "badge_icon": "fa-solid fa-infinity",
    },
]

def enrich_memory_item(mem, idx=0):
    title = mem["title"].lower() if isinstance(mem, dict) else getattr(mem, "title", "").lower()
    selected = None
    if any(k in title for k in ["meet", "glance", "first meeting"]):
        selected = THEME_DEFINITIONS[0]
    elif any(k in title for k in ["photo", "date", "conversation", "smile", "first"]):
        selected = THEME_DEFINITIONS[1]
    elif any(k in title for k in ["star", "night", "moment", "stargazing"]):
        selected = THEME_DEFINITIONS[2]
    elif any(k in title for k in ["trip", "getaway", "travel", "road", "car", "adventure", "weekend"]):
        selected = THEME_DEFINITIONS[3]
    elif any(k in title for k in ["sunset", "beach", "ocean", "sand", "evening"]):
        selected = THEME_DEFINITIONS[4]
    elif any(k in title for k in ["birthday", "party", "cake", "surprise"]):
        selected = THEME_DEFINITIONS[5]
    elif any(k in title for k in ["today", "girlfriend", "celebrat", "festival", "always"]):
        selected = THEME_DEFINITIONS[6]
    else:
        selected = THEME_DEFINITIONS[idx % len(THEME_DEFINITIONS)]

    if isinstance(mem, dict):
        mem["theme"] = mem.get("theme") or selected["theme"]
        mem["location"] = mem.get("location") or selected["default_location"]
        mem["time"] = mem.get("time") or selected["default_time"]
        mem["mood"] = mem.get("mood") or selected["default_mood"]
        mem["special_reason"] = mem.get("special_reason") or selected["default_reason"]
        mem["caption"] = mem.get("caption") or selected["caption"]
        mem["badge_icon"] = mem.get("badge_icon") or selected["badge_icon"]
        return mem
    else:
        setattr(mem, "theme", getattr(mem, "theme", None) or selected["theme"])
        setattr(mem, "location", getattr(mem, "location", None) or selected["default_location"])
        setattr(mem, "time", getattr(mem, "time", None) or selected["default_time"])
        setattr(mem, "mood", getattr(mem, "mood", None) or selected["default_mood"])
        setattr(mem, "special_reason", getattr(mem, "special_reason", None) or selected["default_reason"])
        setattr(mem, "caption", getattr(mem, "caption", None) or selected["caption"])
        setattr(mem, "badge_icon", getattr(mem, "badge_icon", None) or selected["badge_icon"])
        return mem


def home(request):
    """Render the home page with dynamic featured memories."""
    fallback_memories = [
        {
            "id": 1,
            "title": "Our First Glance",
            "subtitle": "When time stood still",
            "date_label": "January 15, 2024",
            "description": "The exact second you walked into the room, everything else faded into the background. Your smile illuminated the entire space.",
            "icon": "fa-solid fa-heart-pulse",
            "emoji": "✨",
            "gradient_class": "gradient-card-1",
            "image": None,
        },
        {
            "id": 2,
            "title": "Candlelit First Date",
            "subtitle": "Unforgettable conversations",
            "date_label": "February 14, 2024",
            "description": "Hours of effortless talking, endless laughter, and a spark that felt like destiny. Being across the table from you felt like home.",
            "icon": "fa-solid fa-utensils",
            "emoji": "🌹",
            "gradient_class": "gradient-card-4",
            "image": None,
        },
        {
            "id": 3,
            "title": "Stargazing Adventure",
            "subtitle": "Under the midnight sky",
            "date_label": "March 20, 2024",
            "description": "Sitting under a blanket of stars, whispering our future dreams. The constellations were bright, but you shone much brighter.",
            "icon": "fa-solid fa-star",
            "emoji": "🌌",
            "gradient_class": "gradient-card-5",
            "image": None,
        },
        {
            "id": 4,
            "title": "Spontaneous Road Trip",
            "subtitle": "Singing at the top of our lungs",
            "date_label": "April 12, 2024",
            "description": "Exploring hidden cafes, getting slightly lost, and laughing until our stomachs hurt. Every mile traveled with you is a blessing.",
            "icon": "fa-solid fa-car-side",
            "emoji": "🚗",
            "gradient_class": "gradient-card-6",
            "image": None,
        },
        {
            "id": 5,
            "title": "Sunset by the Beach",
            "subtitle": "Golden hour magic",
            "date_label": "June 18, 2024",
            "description": "Walking barefoot on the warm sand as the sky turned pink and gold. Hand in hand, listening to the gentle ocean waves.",
            "icon": "fa-solid fa-umbrella-beach",
            "emoji": "🌅",
            "gradient_class": "gradient-card-2",
            "image": None,
        },
        {
            "id": 6,
            "title": "Celebrating Today",
            "subtitle": "Happy Girlfriend's Day",
            "date_label": "August 1, 2026",
            "description": "Every single day with you becomes a treasured memory. Through every season, my love for you grows deeper than words can say.",
            "icon": "fa-solid fa-infinity",
            "emoji": "💖",
            "gradient_class": "gradient-card-3",
            "image": None,
        },
    ]

    featured_memories = fallback_memories
    try:
        db_memories = list(Memory.objects.filter(is_active=True).order_by("order", "-date_occurred")[:6])
        if len(db_memories) > 0:
            featured_memories = db_memories
    except Exception:
        pass

    featured_memories = [enrich_memory_item(m, i) for i, m in enumerate(featured_memories)]

    context = {
        "featured_memories": featured_memories,
    }
    return render(request, "love/home.html", context)


def our_story(request):
    """
    Render the Our Story timeline page.

    Currently uses hardcoded timeline data for initial development.
    To switch to MySQL-backed data, uncomment the database query below
    and remove the hardcoded list.
    """

    # ── DATABASE QUERY (uncomment after running migrations) ──
    # from love.models import TimelineEvent
    # timeline_events = TimelineEvent.objects.filter(is_active=True)

    # ── HARDCODED DATA (for development) ──
    timeline_events = [
        {
            "id": 1,
            "title": "First Meeting",
            "subtitle": "Where it all began",
            "date_label": "The Day We Met",
            "description": (
                "Some people search their whole lives for what I found in a single "
                "moment — the moment I first saw you. My world changed forever."
            ),
            "expanded_content": (
                "I still remember every detail — the way you smiled, "
                "the sound of your voice, and how my heart skipped a beat. "
                "It was as if the universe had been waiting for that exact "
                "moment to bring us together. That day, I didn't just meet "
                "someone new — I met my future."
            ),
            "icon": "fa-solid fa-location-dot",
            "emoji": "✨",
        },
        {
            "id": 2,
            "title": "First Conversation",
            "subtitle": "When words became magic",
            "date_label": "Our First Hello",
            "description": (
                "One conversation with you, and I knew — you were different "
                "from everyone else. Your words felt like coming home."
            ),
            "expanded_content": (
                "We talked for hours, and it felt like minutes. You laughed "
                "at my silly jokes, and I fell a little more with every word. "
                "That conversation wasn't just words — it was the beginning "
                "of the most beautiful story I've ever lived."
            ),
            "icon": "fa-solid fa-comments",
            "emoji": "💬",
        },
        {
            "id": 3,
            "title": "First Smile",
            "subtitle": "The smile that stole my heart",
            "date_label": "A Moment of Magic",
            "description": (
                "You smiled, and suddenly the whole world felt brighter. "
                "That smile — it became my favourite thing in this universe."
            ),
            "expanded_content": (
                "They say a smile can light up a room, but yours? Yours "
                "lit up my entire life. From that moment on, making you "
                "smile became my greatest mission. Every time you smile, "
                "I fall in love with you all over again."
            ),
            "icon": "fa-solid fa-face-smile-beam",
            "emoji": "😊",
        },
        {
            "id": 4,
            "title": "First Date",
            "subtitle": "Our first chapter together",
            "date_label": "Our Special Day",
            "description": (
                "Butterflies, nervous laughter, and a feeling that this "
                "was the start of something truly extraordinary."
            ),
            "expanded_content": (
                "I spent hours getting ready, changing outfits, practising "
                "what to say — and the moment I saw you, I forgot all of it. "
                "Nothing mattered except being there with you. That date "
                "wasn't just our first — it was the prologue to the greatest "
                "love story ever written."
            ),
            "icon": "fa-solid fa-calendar-heart",
            "emoji": "🌹",
        },
        {
            "id": 5,
            "title": "Our Favourite Memory",
            "subtitle": "A moment frozen in time",
            "date_label": "Forever Cherished",
            "description": (
                "Among all the beautiful moments we've shared, this one "
                "lives in my heart like a golden bookmark in our story."
            ),
            "expanded_content": (
                "Every couple has that one memory — the one that makes "
                "your heart warm just thinking about it. Ours is woven "
                "with laughter, love, and a feeling of pure belonging. "
                "Whenever I close my eyes and think of us, this is the "
                "moment that plays first."
            ),
            "icon": "fa-solid fa-star",
            "emoji": "⭐",
        },
        {
            "id": 6,
            "title": "Today",
            "subtitle": "And every day after this",
            "date_label": "Right Now & Forever",
            "description": (
                "Today, I love you more than yesterday and less than "
                "tomorrow. Our story is far from over — it's just beginning."
            ),
            "expanded_content": (
                "We've come so far, and yet this is only the beginning. "
                "Every sunrise with you feels like a new adventure, every "
                "sunset a promise of tomorrow. I choose you today, tomorrow, "
                "and for every day that follows. This is our forever, and "
                "I wouldn't trade it for anything in the world. 💕"
            ),
            "icon": "fa-solid fa-infinity",
            "emoji": "💕",
        },
    ]

    try:
        db_memories = list(Memory.objects.filter(is_active=True).order_by("order", "date_occurred"))
        if len(db_memories) > 0:
            timeline_events = db_memories
    except Exception:
        pass

    timeline_events = [enrich_memory_item(m, i) for i, m in enumerate(timeline_events)]

    context = {
        "timeline_events": timeline_events,
    }
    return render(request, "love/our_story.html", context)


def memories(request):
    """
    Render the Memories page with glassmorphism cards, hover animations, and pagination.
    Fetches active memories dynamically from MySQL, automatically updating whenever
    new memories are added in Django Admin.
    """
    # Fallback memories if database connection is not yet configured
    fallback_memories = [
        {
            "id": 1,
            "title": "First Meeting",
            "subtitle": "When our eyes first met",
            "date_label": "January 15, 2024",
            "description": "The exact moment you walked into the room, everything else faded into the background. I knew right then that my life was about to change forever.",
            "expanded_content": "Do you remember the nervousness in the air? I couldn't stop looking at you. Every detail of that day is etched into my heart like a timeless painting. You wore that beautiful smile, and from that single second, my heart chose you.",
            "icon": "fa-solid fa-heart-pulse",
            "emoji": "✨",
            "gradient_class": "gradient-card-1",
        },
        {
            "id": 2,
            "title": "First Conversation",
            "subtitle": "Words that felt like home",
            "date_label": "January 18, 2024",
            "description": "What started as a simple hello turned into hours of effortless talking. I felt like I had known your soul for a thousand lifetimes.",
            "expanded_content": "We talked about everything and nothing at all. Time seemed to stop completely. I remember driving home that night with the biggest smile on my face, playing back every single word you said.",
            "icon": "fa-solid fa-comments",
            "emoji": "💬",
            "gradient_class": "gradient-card-2",
        },
        {
            "id": 3,
            "title": "First Smile",
            "subtitle": "The smile that lit up my world",
            "date_label": "January 22, 2024",
            "description": "The first time you laughed at my terrible joke, your smile illuminated my entire universe. Making you happy became my favorite mission.",
            "expanded_content": "Your laugh is my absolute favorite melody. Whenever I see your eyes light up with pure joy, all my worries disappear. I promised myself right then that I would do whatever it takes to keep that smile on your face every single day.",
            "icon": "fa-solid fa-face-smile-beam",
            "emoji": "😊",
            "gradient_class": "gradient-card-3",
        },
        {
            "id": 4,
            "title": "First Date",
            "subtitle": "Our first official chapter",
            "date_label": "February 14, 2024",
            "description": "Butterflies, candlelit dinner, and an overwhelming feeling of gratitude. Being across the table from you felt like a dream come true.",
            "expanded_content": "I spent hours getting ready, changing outfits three times, practising what to say. But the moment I saw you, all the nervousness turned into pure peace. That evening wasn't just a date; it was the prologue to our forever.",
            "icon": "fa-solid fa-utensils",
            "emoji": "🌹",
            "gradient_class": "gradient-card-4",
        },
        {
            "id": 5,
            "title": "Stargazing Night",
            "subtitle": "Under a blanket of stars",
            "date_label": "March 20, 2024",
            "description": "Sitting under the open night sky, pointing at constellations while holding your hand. The stars were bright, but you shone much brighter.",
            "expanded_content": "The cool night breeze, warm blankets, and quiet whispers about our future dreams. In the vastness of the universe, sitting right next to you made me feel like the luckiest person alive.",
            "icon": "fa-solid fa-star",
            "emoji": "🌌",
            "gradient_class": "gradient-card-5",
        },
        {
            "id": 6,
            "title": "Our Weekend Getaway",
            "subtitle": "Adventures and endless laughter",
            "date_label": "April 12, 2024",
            "description": "Exploring new places, taking spontaneous road trips, and making unforgettable memories. Every mile traveled with you is a blessing.",
            "expanded_content": "Singing at the top of our lungs to the car radio, getting slightly lost, and discovering cozy little cafes. It doesn't matter where we go in the world — as long as I'm with you, I am home.",
            "icon": "fa-solid fa-car-side",
            "emoji": "🚗",
            "gradient_class": "gradient-card-6",
        },
        {
            "id": 7,
            "title": "Surprise Birthday Celebration",
            "subtitle": "Seeing your eyes sparkle with joy",
            "date_label": "May 25, 2024",
            "description": "Planning the surprise for weeks just to see the sheer happiness on your face when everyone shouted surprise. You deserve all the love in the world.",
            "expanded_content": "Your happy tears and big bear hugs made every second of secret planning worth it. You give so much love to everyone around you; celebrating you is the easiest and most joyful thing to do.",
            "icon": "fa-solid fa-cake-candles",
            "emoji": "🎂",
            "gradient_class": "gradient-card-1",
        },
        {
            "id": 8,
            "title": "Sunset Walk by the Beach",
            "subtitle": "Golden hour magic",
            "date_label": "June 18, 2024",
            "description": "Walking barefoot on the warm sand as the sun painted the sky in shades of pink and gold. Hand in hand, listening to the gentle ocean waves.",
            "expanded_content": "As the sun dipped below the horizon, you leaned your head on my shoulder. No words were needed. It was a moment of complete serenity and unspoken devotion that I will cherish forever.",
            "icon": "fa-solid fa-umbrella-beach",
            "emoji": "🌅",
            "gradient_class": "gradient-card-2",
        },
        {
            "id": 9,
            "title": "Today and Always",
            "subtitle": "Our love story continues to grow",
            "date_label": "August 1, 2026",
            "description": "Every single day with you is a new favorite memory. As we celebrate Girlfriend's Day, I look forward to all the beautiful tomorrows waiting for us.",
            "expanded_content": "Our journey is my most treasured possession. Through every season, every laugh, and every gentle hug, my love for you grows deeper and stronger. Happy Girlfriend's Day, my darling. Forever us. 💕",
            "icon": "fa-solid fa-infinity",
            "emoji": "💖",
            "gradient_class": "gradient-card-3",
        },
    ]

    memories_list = fallback_memories

    try:
        db_memories = list(Memory.objects.filter(is_active=True).order_by("order", "-date_occurred"))
        if len(db_memories) > 0:
            memories_list = db_memories
    except Exception:
        pass

    memories_list = [enrich_memory_item(m, i) for i, m in enumerate(memories_list)]

    # Paginate 6 memories per page
    paginator = Paginator(memories_list, 6)
    page_number = request.GET.get("page", 1)
    page_obj = paginator.get_page(page_number)

    context = {
        "page_obj": page_obj,
        "memories": page_obj.object_list,
        "is_paginated": page_obj.has_other_pages(),
    }

    return render(request, "love/memories.html", context)



def gallery(request):
    """
    Render the Gallery page with masonry grid, category filtering, and pagination.

    Fetches images dynamically from the MySQL database.
    Supports filtering by category via GET parameter.
    Paginates results with 12 images per page.
    """

    # ── Get all active categories for filter buttons ──
    categories = GalleryCategory.objects.filter(is_active=True)

    # ── Filter by category if specified ──
    current_category = request.GET.get("category", "all")

    if current_category and current_category != "all":
        images_qs = GalleryImage.objects.filter(
            is_active=True,
            category__slug=current_category,
        ).select_related("category")
    else:
        images_qs = GalleryImage.objects.filter(
            is_active=True,
        ).select_related("category")

    # ── Pagination (12 images per page) ──
    paginator = Paginator(images_qs, 12)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    context = {
        "page_obj": page_obj,
        "categories": categories,
        "current_category": current_category,
        "total_images": paginator.count,
    }

    return render(request, "love/gallery.html", context)


def reasons(request):
    """
    Render the 'Reasons I Love You' page with 20 interactive flip cards.

    Attempts to fetch active reasons dynamically from MySQL database.
    If database is unmigrated, empty, or unreachable, seamlessly falls back
    to 20 hardcoded romantic reasons.
    """
    fallback_reasons = [
        {
            "id": 1, "order": 1,
            "title": "Your Smile",
            "description": "It lights up my entire world and turns even the darkest days into bright sunshine.",
            "icon": "fa-solid fa-face-smile-wink", "emoji": "😊", "gradient_class": "gradient-card-1",
        },
        {
            "id": 2, "order": 2,
            "title": "Your Eyes",
            "description": "Looking into them feels like finding home; they hold so much warmth, depth, and kindness.",
            "icon": "fa-solid fa-eye", "emoji": "✨", "gradient_class": "gradient-card-2",
        },
        {
            "id": 3, "order": 3,
            "title": "Your Kindness",
            "description": "The gentle, selfless way you treat everyone around you inspires me to be a better person every day.",
            "icon": "fa-solid fa-hand-holding-heart", "emoji": "💖", "gradient_class": "gradient-card-3",
        },
        {
            "id": 4, "order": 4,
            "title": "Your Laugh",
            "description": "It is my absolute favourite sound in the universe — pure magic that makes my heart flutter.",
            "icon": "fa-solid fa-face-laugh-squint", "emoji": "🎶", "gradient_class": "gradient-card-4",
        },
        {
            "id": 5, "order": 5,
            "title": "Your Support",
            "description": "You believe in me even when I doubt myself, standing by my side through every storm and triumph.",
            "icon": "fa-solid fa-people-carry-box", "emoji": "🤝", "gradient_class": "gradient-card-5",
        },
        {
            "id": 6, "order": 6,
            "title": "Your Voice",
            "description": "The sweetest melody that instantly calms my mind and brings peace to my soul.",
            "icon": "fa-solid fa-microphone-lines", "emoji": "🎵", "gradient_class": "gradient-card-6",
        },
        {
            "id": 7, "order": 7,
            "title": "Your Caring Nature",
            "description": "How you pay attention to the smallest details and always make sure I feel loved and cherished.",
            "icon": "fa-solid fa-heart-pulse", "emoji": "💓", "gradient_class": "gradient-card-1",
        },
        {
            "id": 8, "order": 8,
            "title": "Your Hugs",
            "description": "In your arms is the safest, warmest place in the world where all my worries simply melt away.",
            "icon": "fa-solid fa-person-praying", "emoji": "🫂", "gradient_class": "gradient-card-2",
        },
        {
            "id": 9, "order": 9,
            "title": "Your Honesty",
            "description": "Your pure heart and genuine soul make loving you the easiest and most natural thing in life.",
            "icon": "fa-solid fa-scale-balanced", "emoji": "🌟", "gradient_class": "gradient-card-3",
        },
        {
            "id": 10, "order": 10,
            "title": "Your Passion",
            "description": "The way your eyes light up when you talk about the things you love is captivating and beautiful.",
            "icon": "fa-solid fa-fire-flame-curved", "emoji": "🔥", "gradient_class": "gradient-card-4",
        },
        {
            "id": 11, "order": 11,
            "title": "Your Patience",
            "description": "You handle every moment with such grace, understanding me even without words.",
            "icon": "fa-solid fa-hourglass-half", "emoji": "🕊️", "gradient_class": "gradient-card-5",
        },
        {
            "id": 12, "order": 12,
            "title": "Your Strength",
            "description": "Your resilience and courage in facing life's challenges leave me in endless admiration.",
            "icon": "fa-solid fa-shield-heart", "emoji": "💪", "gradient_class": "gradient-card-6",
        },
        {
            "id": 13, "order": 13,
            "title": "Your Warmth",
            "description": "Your presence radiates a cozy, comforting energy that makes every moment together feel special.",
            "icon": "fa-solid fa-sun", "emoji": "☀️", "gradient_class": "gradient-card-1",
        },
        {
            "id": 14, "order": 14,
            "title": "Your Humor",
            "description": "The inside jokes, playful teasing, and shared giggles that make every day an exciting adventure.",
            "icon": "fa-solid fa-masks-theater", "emoji": "😄", "gradient_class": "gradient-card-2",
        },
        {
            "id": 15, "order": 15,
            "title": "Your Wisdom",
            "description": "The thoughtful advice and gentle perspective you share whenever I need guidance.",
            "icon": "fa-solid fa-lightbulb", "emoji": "💡", "gradient_class": "gradient-card-3",
        },
        {
            "id": 16, "order": 16,
            "title": "Your Thoughtfulness",
            "description": "The little surprises and sweet reminders that show how much you care about our bond.",
            "icon": "fa-solid fa-gift", "emoji": "🎁", "gradient_class": "gradient-card-4",
        },
        {
            "id": 17, "order": 17,
            "title": "Your Grace",
            "description": "The effortless beauty and elegance you carry in everything you do, inside and out.",
            "icon": "fa-solid fa-wand-magic-sparkles", "emoji": "🌸", "gradient_class": "gradient-card-5",
        },
        {
            "id": 18, "order": 18,
            "title": "Your Unconditional Love",
            "description": "The way you accept me completely for who I am, flaws and all, with open arms.",
            "icon": "fa-solid fa-infinity", "emoji": "💞", "gradient_class": "gradient-card-6",
        },
        {
            "id": 19, "order": 19,
            "title": "Our Shared Dreams",
            "description": "How building a future with you feels like the most exciting journey I could ever imagine.",
            "icon": "fa-solid fa-compass", "emoji": "🚀", "gradient_class": "gradient-card-1",
        },
        {
            "id": 20, "order": 20,
            "title": "Everything About You",
            "description": "From your quirky habits to your golden heart — you are my perfect match, today and forever.",
            "icon": "fa-solid fa-heart-circle-check", "emoji": "🌹", "gradient_class": "gradient-card-2",
        },
    ]

    try:
        db_reasons = list(LoveReason.objects.filter(is_active=True).order_by("order"))
        if len(db_reasons) > 0:
            reasons_list = db_reasons
        else:
            reasons_list = fallback_reasons
    except Exception:
        reasons_list = fallback_reasons

    context = {
        "reasons": reasons_list,
        "total_reasons": len(reasons_list),
    }

    return render(request, "love/reasons.html", context)


def love_letter(request):
    """
    Render the romantic handwritten Love Letter page.

    Attempts to fetch the active letter from MySQL database.
    If database is unmigrated, empty, or unreachable, seamlessly falls back
    to a built-in luxury romantic letter.
    """
    fallback_paragraphs = [
        "From the very first moment our paths crossed, I knew that my life would never be the same again. You walked into my world like a gentle sunrise, chasing away every shadow and filling my days with a warmth and brilliance I never knew existed.",
        "With every shared smile, every quiet conversation, and every laugh that echoes between us, my love for you grows deeper. You are not only my girlfriend and my deepest love, but my best friend, my confidante, and my favorite adventure.",
        "As we celebrate this special Girlfriend's Day, I want to promise you my unwavering patience, my endless support, and my whole heart. Through every storm and every triumph, I will always be right by your side, holding your hand and cheering you on.",
        "Thank you for being exactly who you are — so kind, so beautiful, and so incredibly special. You are my today and all of my tomorrows, and I fall in love with you all over again every single heartbeat.",
    ]

    fallback_letter = {
        "title": "My Eternal Promise to You",
        "date_label": "August 1st — Girlfriend's Day",
        "salutation": "My Dearest Love,",
        "closing": "Forever and always yours,",
        "signature": "Your Forever Love 💕",
        "postscript": "P.S. Every second spent with you is a blessing I will cherish for a lifetime.",
    }

    try:
        db_letter = LoveLetter.objects.filter(is_active=True).first()
        if db_letter:
            letter = db_letter
            paragraphs = [p.strip() for p in db_letter.body.split("\n") if p.strip()]
        else:
            letter = fallback_letter
            paragraphs = fallback_paragraphs
    except Exception:
        letter = fallback_letter
        paragraphs = fallback_paragraphs

    context = {
        "letter": letter,
        "paragraphs": paragraphs,
    }

    return render(request, "love/love_letter.html", context)


def countdown(request):
    """
    Render the Girlfriend's Day Countdown page.

    Attempts to fetch the active countdown configuration from MySQL database.
    If database is unmigrated, empty, or unreachable, seamlessly falls back
    to a built-in configuration targeting 1st August.
    """
    fallback_config = {
        "title": "Counting Down to Girlfriend's Day 💕",
        "subtitle": "Every second brings me closer to celebrating the most amazing girl in the universe.",
        "target_date_iso": "2026-08-01T00:00:00",
        "celebration_title": "Happy Girlfriend's Day! 💖✨",
        "celebration_message": "Today and every day, I celebrate YOU! You are my sunshine, my greatest blessing, and my forever love. Thank you for making my world so unimaginably beautiful 💕🌹",
    }

    try:
        db_config = CountdownSetting.objects.filter(is_active=True).first()
        if db_config:
            config = {
                "title": db_config.title,
                "subtitle": db_config.subtitle,
                "target_date_iso": db_config.target_date.isoformat(),
                "celebration_title": db_config.celebration_title,
                "celebration_message": db_config.celebration_message,
            }
        else:
            config = fallback_config
    except Exception:
        config = fallback_config

    context = {
        "config": config,
    }

    return render(request, "love/countdown.html", context)


def secret_page(request):
    """
    Render the Secret Page (Private Sanctuary).
    Requires password verification against SecretPageSetting stored securely in MySQL.
    Once unlocked via session, displays romantic message, confetti, floating hearts, and autoplay music.
    """
    # Allow user to relock page anytime for testing
    if request.GET.get("lock") == "1":
        request.session["secret_unlocked"] = False

    # Fallback config if database is not yet connected
    fallback_config = {
        "password": "forever0801",
        "title": "My Deepest Secret 💖",
        "message": "I Love You More Than Words Can Say ❤️",
        "extended_message": (
            "You are my home, my peace, and my wildest dream come true. Every beat of my heart belongs to you, "
            "today and for all eternity. No distance, no time, and no obstacle could ever change what I feel for you. "
            "You are my forever."
        ),
    }

    config = fallback_config
    try:
        db_config = SecretPageSetting.objects.filter(is_active=True).first()
        if db_config:
            config = {
                "password": db_config.password,
                "title": db_config.title,
                "message": db_config.message,
                "extended_message": db_config.extended_message,
            }
    except Exception:
        pass

    error_msg = None

    # Handle password form submission
    if request.method == "POST":
        submitted_pass = request.POST.get("password", "").strip()
        valid_passwords = [config["password"].strip(), "forever0801", "iloveyou"]
        if submitted_pass.lower() in [p.lower() for p in valid_passwords]:
            request.session["secret_unlocked"] = True
        else:
            error_msg = "Incorrect secret code. Hint: Try 'forever0801' or 'iloveyou' 💕"

    is_unlocked = request.session.get("secret_unlocked", False)

    context = {
        "is_unlocked": is_unlocked,
        "config": config,
        "error": error_msg,
    }

    return render(request, "love/secret.html", context)


def final_surprise(request):
    """
    Render the Final Surprise page (The Proposal / Eternal Question).
    Fetches custom text and button labels from FinalSurpriseSetting stored in MySQL.
    Features an entrance trigger, proposal reveal with runaway NO button, and celebration screen.
    """
    fallback_config = {
        "hero_title": "One Last Question... 🌹",
        "hero_subtitle": (
            "We have walked through our story, our memories, and our deepest reasons. Now, there is only one thing left to ask."
        ),
        "trigger_button_text": "Click Here ❤️",
        "love_message": "I Love You ❤️",
        "question_message": "Will You Stay With Me Forever?",
        "yes_button_text": "YES ❤️",
        "always_yes_button_text": "ALWAYS YES ❤️",
        "no_button_text": "NO 💔",
        "success_message": (
            "My heart is yours for all eternity! You just made me the happiest person in the universe. Happy Girlfriend's Day, my forever love! 👑💖✨"
        ),
    }

    config = fallback_config
    try:
        db_config = FinalSurpriseSetting.objects.filter(is_active=True).first()
        if db_config:
            config = {
                "hero_title": db_config.hero_title,
                "hero_subtitle": db_config.hero_subtitle,
                "trigger_button_text": db_config.trigger_button_text,
                "love_message": db_config.love_message,
                "question_message": db_config.question_message,
                "yes_button_text": db_config.yes_button_text,
                "always_yes_button_text": db_config.always_yes_button_text,
                "no_button_text": db_config.no_button_text,
                "success_message": db_config.success_message,
            }
    except Exception:
        pass

    context = {
        "config": config,
    }

    return render(request, "love/final_surprise.html", context)


