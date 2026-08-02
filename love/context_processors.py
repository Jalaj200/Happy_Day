"""
Forever Us — Love App Context Processors
Custom context processors to inject variables into every template.
"""


from love.models import BackgroundMusic


def forever_us_context(request):
    """
    Inject global romantic context variables into all templates.

    Usage in templates:
        {{ site_name }}
        {{ couple_tagline }}
        {{ bg_music.title }}
        {{ bg_music.artist }}
        {{ bg_music.get_audio_url }}

    Returns:
        dict: Context variables available in every template.
    """
    bg_music = None
    try:
        bg_music = BackgroundMusic.objects.filter(is_active=True).first()
        print(f"[DEBUG] BackgroundMusic object: {bg_music}")
    except Exception:
        pass

    if not bg_music:
        class DummyMusic:
            title = "Our Romantic Symphony"
            artist = "Forever Us Orchestra"
            
            @property
            def get_audio_url(self):
                from django.templatetags.static import static
                return static("music/Tum_Se_Hi_Jab_We_Met_320_Kbps.mp3")
        bg_music = DummyMusic()

    return {
        "site_name": "Forever Us",
        "couple_tagline": "Every moment with you is a forever memory. 💕",
        "bg_music": bg_music,
    }

