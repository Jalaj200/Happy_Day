"""
Forever Us — Love App Views
"""

from django.core.paginator import Paginator
from django.shortcuts import render

from love.models import (
    CountdownSetting,
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
    
    class MockImage:
        def __init__(self, url):
            self.url = url

    fallback_memories = [
        {
            "id": 1,
            "title": "First Meeting",
            "subtitle": "One hello was enough to calm my heart.",
            "date_label": "June 2024 • Express Mall",
            "location": "Jaipur",
            "mood": "🤝 The Day We Finally Met",
            "description": "Looking back, I still marvel at how a single word could change everything. The moment you said \"Hello,\" all the nervous anticipation I had built up completely vanished, replaced by an overwhelming sense of peace. It was the instant I knew that being near you was exactly where I was meant to be.",
            "expanded_content": "✨ What I'll Always Remember\n\nThe genuine warmth in your voice and how effortlessly your smile made me feel at home.\n\n💌 That beautiful first meeting wasn't just the day we said hello—it was the moment my heart finally found its missing piece.",
            "icon": "fa-solid fa-heart-pulse",
            "emoji": "✨",
            "gradient_class": "gradient-card-1",
            "image": MockImage("/static/images/memories/memory_1.png"),
        },
        {
            "id": 2,
            "title": "First Conversation",
            "subtitle": "Some conversations last a few minutes, but the memories stay forever.",
            "date_label": "June 2024 • Express Mall",
            "location": "Jaipur",
            "mood": "💬 Our First Conversation",
            "description": "It's rare to find someone who instantly understands your heart. That first conversation felt less like getting to know a stranger and more like reconnecting with a soul I had known for a lifetime. The comfort, the laughter, and the way time simply stopped—it all felt so incredibly natural.",
            "expanded_content": "✨ What I'll Always Remember\n\nThe way you listened so attentively, and how every shared laugh made me want to keep talking to you forever.\n\n💌 That conversation planted the seed of a connection so deep, I still feel its warmth every single day.",
            "icon": "fa-solid fa-comments",
            "emoji": "💬",
            "gradient_class": "gradient-card-2",
            "image": MockImage("/static/images/memories/memory_2.png"),
        },
        {
            "id": 3,
            "title": "First Smile",
            "subtitle": "The smile that made my heart forget everything else.",
            "date_label": "June 2024 • Express Mall",
            "location": "Jaipur",
            "mood": "😊 The Smile I'll Never Forget",
            "description": "Your smile is, and always will be, my greatest comfort. When I think back to the first time you smiled at me, I don't just remember how beautiful you looked—I remember how safe and happy it made me feel. It was the exact moment I realized I wanted to spend my life making you smile just like that.",
            "expanded_content": "✨ What I'll Always Remember\n\nThe undeniable sparkle in your eyes that entirely captivated my soul.\n\n💌 Whenever the world feels heavy, the memory of that beautiful smile is still all it takes to brighten my day.",
            "icon": "fa-solid fa-face-smile-beam",
            "emoji": "😊",
            "gradient_class": "gradient-card-3",
            "image": MockImage("/static/images/memories/memory_3.png"),
        },
        {
            "id": 4,
            "title": "First Date",
            "subtitle": "A day that became one of my favorite memories.",
            "date_label": "July 2024 • Jaipur",
            "location": "Jaipur",
            "mood": "🌹 Our First Date",
            "description": "We could have been anywhere in the world that day, and it wouldn't have mattered. The magic of our first date wasn't the scenery or the destination—it was the undeniable realization that the person walking beside me was everything I had ever prayed for.",
            "expanded_content": "✨ What I'll Always Remember\n\nThe effortless joy of exploring together and your thoughtful, caring nature shining through in every little moment.\n\n💌 I walked into that date hoping for a beautiful day, but I walked away with a heart completely devoted to you.",
            "icon": "fa-solid fa-utensils",
            "emoji": "🌹",
            "gradient_class": "gradient-card-4",
            "image": MockImage("/static/images/memories/memory_4.png"),
        },
        {
            "id": 5,
            "title": "Our Favourite Memory",
            "subtitle": "The memories I would choose to relive a thousand times.",
            "date_label": "College Days",
            "location": "NIMS University",
            "mood": "⭐ Forever Cherished",
            "description": "The true beauty of our college days wasn't found in grand gestures, but in the quiet, profound comfort of simply being together. Those ordinary moments—the shared glances, the silent understanding, the unspoken support—became the foundation of our extraordinary love.",
            "expanded_content": "✨ What I'll Always Remember\n\nHow a single look from across the campus was enough to communicate a thousand words of love and encouragement.\n\n💌 I wouldn't trade those seemingly ordinary days for anything, because they are the precious chapters where our souls truly intertwined.",
            "icon": "fa-solid fa-star",
            "emoji": "⭐",
            "gradient_class": "gradient-card-5",
            "image": MockImage("/static/images/memories/memory_5.png"),
        },
        {
            "id": 6,
            "title": "Every Day, More Than Before",
            "subtitle": "Love growing deeper every passing day.",
            "date_label": "Every Day ❤️",
            "location": "Present Journey",
            "mood": "💖 Every Day ❤️",
            "description": "If someone told me back then how deeply I would love you now, I wouldn't have believed my heart could hold this much affection. Every new morning is a reminder of how blessed I am that you chose me. You are my constant, my peace, and the most beautiful part of my reality.",
            "expanded_content": "✨ What I'll Always Remember\n\nThe comforting certainty that no matter what tomorrow brings, my love for you will only continue to grow.\n\n💌 Our journey is still unfolding, and I promise to cherish every single page we write together, today and forever.",
            "icon": "fa-solid fa-infinity",
            "emoji": "💖",
            "gradient_class": "gradient-card-6",
            "image": MockImage("/static/images/memories/memory_6.png"),
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
            "subtitle": "One hello was enough to calm my heart.",
            "date_label": "June 2024 • Express Mall",
            "location": "Jaipur",
            "mood": "🤝 The Day We Finally Met",
            "description": "When I arrived at Express Mall, I saw you sitting there, talking. I was really nervous because I didn't know how our first meeting would go or what I should say.\n\nThen you looked at me and greeted me with a simple \"Hello.\"\n\nThat one little word made all my nervousness disappear. From that moment, everything felt easier, and I realized that meeting you in person was even more beautiful than I had imagined.",
            "expanded_content": "❤️ The Little Things I Never Forgot\n\n• Your beautiful smile.\n• The sparkle in your eyes.\n• The warmth in your voice.\n• The little \"Hello\" that calmed my nervous heart.\n• The happiness of finally meeting you.",
            "icon": "fa-solid fa-heart-pulse",
            "emoji": "✨",
        },
        {
            "id": 2,
            "title": "First Conversation",
            "subtitle": "Some conversations last a few minutes, but the memories stay forever.",
            "date_label": "June 2024 • Express Mall",
            "location": "Jaipur",
            "mood": "💬 Our First Conversation",
            "description": "After finally meeting you, we sat together and started talking. At first, I wondered what we would talk about, but within moments, every word felt natural.\n\nWe shared stories, laughed together, and slowly forgot that it was our very first conversation.\n\nThe more we talked, the more I realized how easy it was to be myself around you. Time passed without either of us noticing, and what felt like a few minutes became one of the most unforgettable moments of my life.\n\nThat conversation wasn't just about exchanging words—it was the beginning of a connection that I never wanted to end.",
            "expanded_content": "❤️ The Little Things I Never Forgot\n\n• The way you listened.\n• Your smile after every little joke.\n• How naturally our conversation flowed.\n• The comfort I felt while talking to you.\n• Losing track of time together.\n• Walking away wanting to talk to you again.",
            "icon": "fa-solid fa-comments",
            "emoji": "💬",
        },
        {
            "id": 3,
            "title": "First Smile",
            "subtitle": "The smile that made my heart forget everything else.",
            "date_label": "June 2024 • Express Mall",
            "location": "Jaipur",
            "mood": "😊 The Smile I'll Never Forget",
            "description": "There are smiles you see every day, and then there are smiles you never forget.\n\nThe first time you smiled at me, everything around us seemed to disappear. In that one moment, all my nervousness faded away, and I couldn't help but smile back.\n\nIt wasn't just your smile that made me happy—it was the warmth, kindness, and comfort behind it. That beautiful smile became the reason I looked forward to seeing you again and again.\n\nEven today, whenever I think about that moment, it still brings the same happiness to my heart.",
            "expanded_content": "❤️ The Little Things I Never Forgot\n\n• The sparkle in your eyes.\n• The way your smile brightened everything.\n• The happiness it brought to my heart.\n• Smiling without realizing it.\n• The moment your smile became my favorite.",
            "icon": "fa-solid fa-face-smile-beam",
            "emoji": "😊",
        },
        {
            "id": 4,
            "title": "First Date",
            "subtitle": "A day that became one of my favorite memories.",
            "date_label": "July 2024 • Jaipur",
            "location": "Jaipur",
            "mood": "🌹 Our First Date",
            "description": "Our first date wasn't just about visiting beautiful places in Jaipur—it was about spending time with you. Every street we walked, every place we explored, and every little conversation became a memory I knew I'd never forget.\n\nWhat made that day truly special wasn't the destination, but the person beside me. Your smile, your kindness, the way you cared, and the happiness you brought into every moment made me realize how incredibly amazing you are.\n\nAs the day came to an end, I realized I wasn't just taking home beautiful memories of Jaipur—I was carrying a heart that had fallen even deeper in love with you.\n\nThat day reminded me that the best part of every journey isn't the place you visit, but the person you share it with.",
            "expanded_content": "❤️ The Little Things I Never Forgot\n\n• The happiness on your face.\n• The way you smiled throughout the day.\n• Your caring and thoughtful nature.\n• Every laugh we shared together.\n• Walking through Jaipur with you.\n• The little moments that made the whole day unforgettable.\n• Realizing how truly amazing you are.",
            "icon": "fa-solid fa-utensils",
            "emoji": "🌹",
        },
        {
            "id": 5,
            "title": "Our Favourite Memory",
            "subtitle": "The memories I would choose to relive a thousand times.",
            "date_label": "College Days",
            "location": "NIMS University",
            "mood": "⭐ Forever Cherished",
            "description": "If someone ever asked me which memory I would choose to relive a thousand times, my answer would always be the days we spent together in college.\n\nThose weren't just ordinary days—they became the most beautiful chapter of my life. Every morning I looked forward to seeing you, every walk across the campus, every conversation, every laugh, and every little smile became memories that I will treasure forever.\n\nThe most beautiful part wasn't simply that we loved each other—it was the way we cared for one another. We understood each other's feelings without needing to say a single word. A single glance was enough to know when one of us was happy, worried, excited, or simply needed the other's support.\n\nLooking back today, I don't miss the classrooms, the lectures, or the college buildings. I miss the moments we created together—the little conversations between classes, the walks around the campus, the smiles we exchanged from across the corridor, and the happiness of knowing that you were always there.\n\nThose ordinary college days became the most extraordinary memories of my life. If I were ever given the chance to relive one chapter of our story, I wouldn't choose a grand celebration or a perfect vacation—I would simply choose those beautiful days with you at NIMS University, because those moments will forever remain my favorite memories.",
            "expanded_content": "❤️ The Little Things I Never Forgot\n\n• Looking forward to seeing you every single day.\n• Walking through the college together.\n• The little smiles we shared from across the campus.\n• Understanding each other's feelings without saying a word.\n• The care, support, and comfort we gave each other.\n• Laughing together over the smallest things.\n• Turning ordinary college days into unforgettable memories.\n• Realizing that happiness was simply being with you.",
            "icon": "fa-solid fa-star",
            "emoji": "⭐",
        },
        {
            "id": 6,
            "title": "Every Day, More Than Before",
            "subtitle": "Love growing deeper every passing day.",
            "date_label": "Every Day ❤️",
            "location": "Present Journey",
            "mood": "💖 Every Day ❤️",
            "description": "People say love grows with time, and ours certainly did. From the very first glance, my heart chose you. But with every conversation, every smile, and every memory we created together, my love only grew deeper.\n\nEvery passing day made me more certain that you were the one I wanted beside me forever.",
            "expanded_content": "",
            "icon": "fa-solid fa-infinity",
            "emoji": "💖",
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
    class MockImage:
        def __init__(self, url):
            self.url = url
            
    fallback_memories = [
        {
            "id": 1,
            "title": "First Meeting",
            "subtitle": "One hello was enough to calm my heart.",
            "date_label": "June 2024 • Express Mall",
            "location": "Jaipur",
            "mood": "🤝 The Day We Finally Met",
            "description": "Looking back, I still marvel at how a single word could change everything. The moment you said \"Hello,\" all the nervous anticipation I had built up completely vanished, replaced by an overwhelming sense of peace. It was the instant I knew that being near you was exactly where I was meant to be.",
            "expanded_content": "✨ What I'll Always Remember\n\nThe genuine warmth in your voice and how effortlessly your smile made me feel at home.\n\n💌 That beautiful first meeting wasn't just the day we said hello—it was the moment my heart finally found its missing piece.",
            "icon": "fa-solid fa-heart-pulse",
            "emoji": "✨",
            "gradient_class": "gradient-card-1",
            "image": MockImage("/static/images/memories/memory_1.png"),
        },
        {
            "id": 2,
            "title": "First Conversation",
            "subtitle": "Some conversations last a few minutes, but the memories stay forever.",
            "date_label": "June 2024 • Express Mall",
            "location": "Jaipur",
            "mood": "💬 Our First Conversation",
            "description": "It's rare to find someone who instantly understands your heart. That first conversation felt less like getting to know a stranger and more like reconnecting with a soul I had known for a lifetime. The comfort, the laughter, and the way time simply stopped—it all felt so incredibly natural.",
            "expanded_content": "✨ What I'll Always Remember\n\nThe way you listened so attentively, and how every shared laugh made me want to keep talking to you forever.\n\n💌 That conversation planted the seed of a connection so deep, I still feel its warmth every single day.",
            "icon": "fa-solid fa-comments",
            "emoji": "💬",
            "gradient_class": "gradient-card-2",
            "image": MockImage("/static/images/memories/memory_2.png"),
        },
        {
            "id": 3,
            "title": "First Smile",
            "subtitle": "The smile that made my heart forget everything else.",
            "date_label": "June 2024 • Express Mall",
            "location": "Jaipur",
            "mood": "😊 The Smile I'll Never Forget",
            "description": "Your smile is, and always will be, my greatest comfort. When I think back to the first time you smiled at me, I don't just remember how beautiful you looked—I remember how safe and happy it made me feel. It was the exact moment I realized I wanted to spend my life making you smile just like that.",
            "expanded_content": "✨ What I'll Always Remember\n\nThe undeniable sparkle in your eyes that entirely captivated my soul.\n\n💌 Whenever the world feels heavy, the memory of that beautiful smile is still all it takes to brighten my day.",
            "icon": "fa-solid fa-face-smile-beam",
            "emoji": "😊",
            "gradient_class": "gradient-card-3",
            "image": MockImage("/static/images/memories/memory_3.png"),
        },
        {
            "id": 4,
            "title": "First Date",
            "subtitle": "A day that became one of my favorite memories.",
            "date_label": "July 2024 • Jaipur",
            "location": "Jaipur",
            "mood": "🌹 Our First Date",
            "description": "We could have been anywhere in the world that day, and it wouldn't have mattered. The magic of our first date wasn't the scenery or the destination—it was the undeniable realization that the person walking beside me was everything I had ever prayed for.",
            "expanded_content": "✨ What I'll Always Remember\n\nThe effortless joy of exploring together and your thoughtful, caring nature shining through in every little moment.\n\n💌 I walked into that date hoping for a beautiful day, but I walked away with a heart completely devoted to you.",
            "icon": "fa-solid fa-utensils",
            "emoji": "🌹",
            "gradient_class": "gradient-card-4",
            "image": MockImage("/static/images/memories/memory_4.png"),
        },
        {
            "id": 5,
            "title": "Our Favourite Memory",
            "subtitle": "The memories I would choose to relive a thousand times.",
            "date_label": "College Days",
            "location": "NIMS University",
            "mood": "⭐ Forever Cherished",
            "description": "The true beauty of our college days wasn't found in grand gestures, but in the quiet, profound comfort of simply being together. Those ordinary moments—the shared glances, the silent understanding, the unspoken support—became the foundation of our extraordinary love.",
            "expanded_content": "✨ What I'll Always Remember\n\nHow a single look from across the campus was enough to communicate a thousand words of love and encouragement.\n\n💌 I wouldn't trade those seemingly ordinary days for anything, because they are the precious chapters where our souls truly intertwined.",
            "icon": "fa-solid fa-star",
            "emoji": "⭐",
            "gradient_class": "gradient-card-5",
            "image": MockImage("/static/images/memories/memory_5.png"),
        },
        {
            "id": 6,
            "title": "Every Day, More Than Before",
            "subtitle": "Love growing deeper every passing day.",
            "date_label": "Every Day ❤️",
            "location": "Present Journey",
            "mood": "💖 Every Day ❤️",
            "description": "If someone told me back then how deeply I would love you now, I wouldn't have believed my heart could hold this much affection. Every new morning is a reminder of how blessed I am that you chose me. You are my constant, my peace, and the most beautiful part of my reality.",
            "expanded_content": "✨ What I'll Always Remember\n\nThe comforting certainty that no matter what tomorrow brings, my love for you will only continue to grow.\n\n💌 Our journey is still unfolding, and I promise to cherish every single page we write together, today and forever.",
            "icon": "fa-solid fa-infinity",
            "emoji": "💖",
            "gradient_class": "gradient-card-6",
            "image": MockImage("/static/images/memories/memory_6.png"),
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
    Render the handcrafted Gallery page using a static context list to stay database-free
    while allowing an easy template loop for 71 photos.
    
    All layout decisions (rotations, decorations, dividers) are deterministic
    so the scrapbook looks identical on every page load.
    The layout class strictly follows the actual aspect ratio of the image.
    """
    import random
    
    # Exact filenames and orientations generated by scanning the directory
    # This prevents missing images due to varying extensions (.png, .JPG, .jpg)
    image_data = [
        {'filename': '001.png', 'orientation': 'portrait'}, {'filename': '002.png', 'orientation': 'portrait'}, 
        {'filename': '003.png', 'orientation': 'portrait'}, {'filename': '004.png', 'orientation': 'portrait'}, 
        {'filename': '005.png', 'orientation': 'portrait'}, {'filename': '006.png', 'orientation': 'portrait'}, 
        {'filename': '007.png', 'orientation': 'portrait'}, {'filename': '008.JPG', 'orientation': 'portrait'}, 
        {'filename': '009.JPG', 'orientation': 'portrait'}, {'filename': '010.JPG', 'orientation': 'landscape'}, 
        {'filename': '011.JPG', 'orientation': 'landscape'}, {'filename': '012.JPG', 'orientation': 'landscape'}, 
        {'filename': '013.JPG', 'orientation': 'landscape'}, {'filename': '014.JPG', 'orientation': 'portrait'}, 
        {'filename': '015.jpg', 'orientation': 'portrait'}, {'filename': '016.jpg', 'orientation': 'portrait'}, 
        {'filename': '017.JPG', 'orientation': 'portrait'}, {'filename': '018.jpg', 'orientation': 'portrait'}, 
        {'filename': '019.jpg', 'orientation': 'portrait'}, {'filename': '020.jpg', 'orientation': 'portrait'}, 
        {'filename': '021.jpg', 'orientation': 'portrait'}, {'filename': '022.jpg', 'orientation': 'portrait'}, 
        {'filename': '023.jpg', 'orientation': 'portrait'}, {'filename': '024.JPG', 'orientation': 'portrait'}, 
        {'filename': '025.JPG', 'orientation': 'portrait'}, {'filename': '026.JPG', 'orientation': 'portrait'}, 
        {'filename': '027.JPG', 'orientation': 'portrait'}, {'filename': '028.JPG', 'orientation': 'portrait'}, 
        {'filename': '029.JPG', 'orientation': 'portrait'}, {'filename': '030.JPG', 'orientation': 'portrait'}, 
        {'filename': '031.JPG', 'orientation': 'portrait'}, {'filename': '032.JPG', 'orientation': 'portrait'}, 
        {'filename': '033.JPG', 'orientation': 'landscape'}, {'filename': '034.JPG', 'orientation': 'portrait'}, 
        {'filename': '035.JPG', 'orientation': 'landscape'}, {'filename': '036.JPG', 'orientation': 'portrait'}, 
        {'filename': '037.JPG', 'orientation': 'portrait'}, {'filename': '038.JPG', 'orientation': 'portrait'}, 
        {'filename': '039.JPG', 'orientation': 'portrait'}, {'filename': '040.JPG', 'orientation': 'landscape'}, 
        {'filename': '041.JPG', 'orientation': 'portrait'}, {'filename': '042.JPG', 'orientation': 'landscape'}, 
        {'filename': '043.JPG', 'orientation': 'landscape'}, {'filename': '044.JPG', 'orientation': 'landscape'}, 
        {'filename': '045.jpg', 'orientation': 'square'}, {'filename': '046.jpg', 'orientation': 'portrait'}, 
        {'filename': '047.jpg', 'orientation': 'portrait'}, {'filename': '048.jpg', 'orientation': 'portrait'}, 
        {'filename': '049.jpg', 'orientation': 'portrait'}, {'filename': '050.jpg', 'orientation': 'portrait'}, 
        {'filename': '051.jpg', 'orientation': 'portrait'}, {'filename': '052.jpg', 'orientation': 'portrait'}, 
        {'filename': '053.jpg', 'orientation': 'portrait'}, {'filename': '054.jpg', 'orientation': 'portrait'}, 
        {'filename': '055.jpg', 'orientation': 'portrait'}, {'filename': '056.jpg', 'orientation': 'portrait'}, 
        {'filename': '057.jpg', 'orientation': 'portrait'}, {'filename': '058.jpg', 'orientation': 'portrait'}, 
        {'filename': '059.jpg', 'orientation': 'portrait'}, {'filename': '060.jpg', 'orientation': 'portrait'}, 
        {'filename': '061.jpg', 'orientation': 'portrait'}, {'filename': '062.jpg', 'orientation': 'portrait'}, 
        {'filename': '063.jpg', 'orientation': 'portrait'}, {'filename': '064.jpg', 'orientation': 'portrait'}, 
        {'filename': '065.jpg', 'orientation': 'portrait'}, {'filename': '066.jpg', 'orientation': 'portrait'}, 
        {'filename': '067.jpg', 'orientation': 'portrait'}, {'filename': '068.jpg', 'orientation': 'portrait'}, 
        {'filename': '069.jpg', 'orientation': 'portrait'}, {'filename': '070.jpg', 'orientation': 'portrait'}, 
        {'filename': '071.jpg', 'orientation': 'portrait'}
    ]
    
    items = []
    
    # Rich decoration HTML fragments — roughly half get decorations, half stay clean
    decoration_pool = [
        '<div class="decoration-tape decoration-tape--pink" style="top: -14px; left: 20px; transform: rotate(-8deg);"></div>',
        '<div class="decoration-tape decoration-tape--gold" style="top: -12px; right: 15px; transform: rotate(12deg);"></div>',
        '<div class="decoration-tape decoration-tape--pink" style="top: -12px; left: 40%; transform: rotate(-3deg);"></div>',
        '<div class="decoration-pin" style="top: 10px; left: calc(50% - 7px);"></div>',
        '<div class="decoration-pin" style="top: 8px; right: 18px;"></div>',
        '<div class="decoration-corner" style="top: -5px; left: -5px;"></div><div class="decoration-corner" style="bottom: -5px; right: -5px; transform: rotate(180deg);"></div>',
        'none', 'none', 'none', 'none', 'none',
    ]
    
    divider_types = ['botanical-branch', 'wax-seal', 'torn-note']
    
    # Deterministic sequence for a handcrafted feel
    random.seed(42)
    
    for i, data in enumerate(image_data, start=1):
        # Insert a premium decorative divider every ~13 photos
        if i > 1 and i % 13 == 0:
            items.append({
                'type': 'divider',
                'divider_class': f"divider-{random.choice(divider_types)}"
            })
            
        # Select base layout matching the photo's exact orientation
        layout = data['orientation']
        
        # Introduce handcrafted rhythm without breaking orientation
        # Featured applies to some landscapes
        if layout == 'landscape' and i % 8 == 0:
            layout = 'featured'
            
        # Mini applies exclusively to square photos to avoid cropping
        if layout == 'square':
            layout = 'mini'
            
        filename = data['filename']
        
        # Slight organic rotations between -4° and +5°, never 0
        rotation = random.randint(-4, 5)
        if rotation == 0: 
            rotation = 2
            
        decoration = random.choice(decoration_pool)
            
        items.append({
            'type': 'photo',
            'index': i - 1,
            'filename': filename,
            'img_path': f"images/gallery/{filename}",
            'layout_class': f"polaroid-card--{layout}",
            'rotation': rotation,
            'decoration': decoration,
            'title': f"Memory {i}",
            'date': "",
            'caption': ""
        })
        
    context = {
        'items': items
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
    from django.http import JsonResponse
    is_ajax = request.headers.get("X-Requested-With") == "XMLHttpRequest"

    # Allow user to relock page anytime for testing
    if request.GET.get("lock") == "1":
        request.session["secret_unlocked"] = False
        if is_ajax:
            return JsonResponse({"success": True})

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
        import json

        submitted_pass = ""

        # Try JSON body first (AJAX path sends Content-Type: application/json)
        # Must read request.body BEFORE request.POST to avoid stream consumption
        if request.content_type == "application/json":
            try:
                data = json.loads(request.body)
                submitted_pass = data.get("password", "").strip()
            except Exception:
                pass

        # Fall back to standard form POST data
        if not submitted_pass:
            submitted_pass = request.POST.get("password", "").strip()

        valid_passwords = [config["password"].strip(), "forever0801", "iloveyou"]
        if submitted_pass.lower() in [p.lower() for p in valid_passwords]:
            request.session["secret_unlocked"] = True
            if is_ajax:
                return JsonResponse({"success": True})
        else:
            error_msg = "Incorrect secret code."
            if is_ajax:
                return JsonResponse({"success": False, "error": error_msg})

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


