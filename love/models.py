"""
Forever Us — Love App Models
Define your MySQL database models here.
Includes meaningful fields, media upload configurations, and relational Foreign Keys.
"""

from django.db import models


# ──────────────────────────────────────────────
# 1. Memory Model (Our Story Timeline)
# ──────────────────────────────────────────────
class Memory(models.Model):
    """
    Represents a milestone memory in the couple's love story timeline.

    Each memory appears as a card on the 'Our Story' page.
    Can be linked to gallery photos and love letters via Foreign Keys.
    """

    title = models.CharField(
        max_length=200,
        help_text="Title of the memory milestone (e.g., 'First Meeting', 'First Date').",
    )
    subtitle = models.CharField(
        max_length=300,
        blank=True,
        help_text="Short romantic subtitle displayed below the title.",
    )
    date_label = models.CharField(
        max_length=100,
        help_text="Display label for the date (e.g., 'January 2024', 'Summer 2025').",
    )
    date_occurred = models.DateField(
        null=True,
        blank=True,
        help_text="Exact calendar date of this memory for chronological sorting.",
    )
    description = models.TextField(
        help_text="Brief summary shown on the front of the timeline card.",
    )
    expanded_content = models.TextField(
        blank=True,
        help_text="Extended heartfelt story revealed when the card is expanded on click.",
    )
    icon = models.CharField(
        max_length=100,
        default="fa-solid fa-heart",
        help_text="Font Awesome icon class for the timeline marker.",
    )
    emoji = models.CharField(
        max_length=10,
        default="💕",
        help_text="Decorative emoji displayed on the card.",
    )
    image = models.ImageField(
        upload_to="memories/%Y/%m/",
        blank=True,
        null=True,
        help_text="Upload photo for this memory (saved in media/memories/year/month/).",
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Display order on the timeline (lower numbers appear first).",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Only active memories are displayed on the website.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "date_occurred"]
        verbose_name = "Memory"
        verbose_name_plural = "Memories"

    def __str__(self):
        return f"{self.order}. {self.title} ({self.date_label})"





# ──────────────────────────────────────────────
# 4. Love Reason Model (20 Reasons Why)
# ──────────────────────────────────────────────
class LoveReason(models.Model):
    """
    Represents one of the 20 reasons why you love your partner.
    Displayed as interactive 3D flip cards on the 'Reasons I Love You' page.
    """

    title = models.CharField(
        max_length=100,
        help_text="The main reason title (e.g., 'Your Smile', 'Your Kindness').",
    )
    description = models.TextField(
        help_text="The detailed romantic message revealed when the card flips.",
    )
    icon = models.CharField(
        max_length=100,
        default="fa-solid fa-heart",
        help_text="Font Awesome icon class displayed on card front.",
    )
    emoji = models.CharField(
        max_length=10,
        default="💖",
        help_text="Decorative emoji displayed on the card front and back.",
    )
    gradient_class = models.CharField(
        max_length=50,
        default="gradient-card-1",
        help_text="CSS class for card gradient styling (gradient-card-1 to gradient-card-6).",
    )
    order = models.PositiveIntegerField(
        default=1,
        help_text="Display order (1 to 20).",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Only active reasons are displayed on the website.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order"]
        verbose_name = "Love Reason"
        verbose_name_plural = "Love Reasons"

    def __str__(self):
        return f"#{self.order} - {self.title}"


# ──────────────────────────────────────────────
# 5. Love Letter Model (Handwritten Page)
# ──────────────────────────────────────────────
class LoveLetter(models.Model):
    """
    Represents a romantic handwritten love letter displayed on the Love Letter page.

    Relationships:
        memory (ForeignKey -> Memory): Optional One-to-Many relationship allowing a letter
        to be dedicated to a specific milestone memory (e.g., 'Letter for our Anniversary').
    """

    title = models.CharField(
        max_length=200,
        default="My Eternal Promise to You",
        help_text="Title of the letter (e.g., 'A Letter for Girlfriend\'s Day').",
    )
    date_label = models.CharField(
        max_length=100,
        default="August 1st — Girlfriend's Day",
        help_text="Display date on the letter (e.g., 'August 1, 2026').",
    )
    salutation = models.CharField(
        max_length=100,
        default="My Dearest Love,",
        help_text="Opening greeting (e.g., 'My Dearest Darling,').",
    )
    body = models.TextField(
        help_text="The main paragraphs of the love letter. Separate paragraphs with blank lines.",
    )
    closing = models.CharField(
        max_length=100,
        default="Forever and always yours,",
        help_text="Closing phrase before signature (e.g., 'With all my heart,').",
    )
    signature = models.CharField(
        max_length=100,
        default="Your Forever Love 💕",
        help_text="Signature name (animated in handwritten script).",
    )
    postscript = models.CharField(
        max_length=300,
        blank=True,
        default="P.S. Every second spent with you is a blessing I will cherish for a lifetime.",
        help_text="Optional P.S. note at the very bottom of the letter.",
    )
    memory = models.ForeignKey(
        Memory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="love_letters",
        help_text="Optional: Dedicate this love letter to a specific milestone Memory.",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="If multiple letters exist, the newest active letter is displayed.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Love Letter"
        verbose_name_plural = "Love Letters"

    def __str__(self):
        return f"{self.title} ({self.date_label})"


# ──────────────────────────────────────────────
# 6. Countdown Setting Model (Timer Configuration)
# ──────────────────────────────────────────────
class CountdownSetting(models.Model):
    """
    Configuration settings for the Girlfriend's Day Countdown page.
    Allows changing the target date and celebration messages via Django Admin.
    """

    title = models.CharField(
        max_length=200,
        default="Counting Down to Girlfriend's Day 💕",
        help_text="Title displayed above the countdown timer.",
    )
    subtitle = models.CharField(
        max_length=300,
        default="Every second brings me closer to celebrating the most amazing girl in the universe.",
        help_text="Subtitle displayed below the title.",
    )
    target_date = models.DateTimeField(
        help_text="The exact date and time the countdown reaches zero (e.g., 2026-08-01 00:00:00).",
    )
    celebration_title = models.CharField(
        max_length=200,
        default="Happy Girlfriend's Day! 💖✨",
        help_text="Title displayed when countdown reaches zero.",
    )
    celebration_message = models.TextField(
        default="Today and every day, I celebrate YOU! You are my sunshine, my greatest blessing, and my forever love. Thank you for making my world so unimaginably beautiful 💕🌹",
        help_text="Romantic message displayed during the celebration animation.",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="If multiple configs exist, the newest active configuration is used.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Countdown Setting"
        verbose_name_plural = "Countdown Settings"

    def __str__(self):
        return f"{self.title} -> {self.target_date.strftime('%Y-%m-%d %H:%M')}"


# ──────────────────────────────────────────────
# 7. Secret Page Setting Model (Private Sanctuary)
# ──────────────────────────────────────────────
class SecretPageSetting(models.Model):
    """
    Configuration for the Secret Page (Private Sanctuary).
    Stores the access password securely in MySQL and allows customizing
    the secret message displayed once unlocked.
    """

    password = models.CharField(
        max_length=100,
        default="forever0801",
        help_text="The secret password required to unlock the sanctuary (e.g. forever0801 or your anniversary date).",
    )
    title = models.CharField(
        max_length=200,
        default="My Deepest Secret 💖",
        help_text="Title displayed at the top of the unlocked sanctuary.",
    )
    message = models.TextField(
        default="I Love You More Than Words Can Say ❤️",
        help_text="The primary romantic confession displayed in luxury typography once unlocked.",
    )
    extended_message = models.TextField(
        blank=True,
        default="You are my home, my peace, and my wildest dream come true. Every beat of my heart belongs to you, today and for all eternity. No distance, no time, and no obstacle could ever change what I feel for you. You are my forever.",
        help_text="Extended heartfelt note shown below the main message.",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="If multiple configs exist, the newest active configuration will be used.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Secret Page Setting"
        verbose_name_plural = "Secret Page Settings"

    def __str__(self):
        return f"Secret Sanctuary -> {self.title} (Lock: {self.password[:3]}***)"


# ──────────────────────────────────────────────
# 8. Final Surprise Setting Model (The Proposal / Climax)
# ──────────────────────────────────────────────
class FinalSurpriseSetting(models.Model):
    """
    Configuration for the Final Surprise page (The Proposal / Climax).
    Stores all text prompts and button labels in MySQL so they can be
    customized directly from Django Admin.
    """

    hero_title = models.CharField(
        max_length=200,
        default="One Last Question... 🌹",
        help_text="Title shown on the initial entrance card before clicking.",
    )
    hero_subtitle = models.CharField(
        max_length=300,
        default="We have walked through our story, our memories, and our deepest reasons. Now, there is only one thing left to ask.",
        help_text="Subtitle shown on the initial entrance card.",
    )
    trigger_button_text = models.CharField(
        max_length=100,
        default="Click Here ❤️",
        help_text="Label for the large trigger button.",
    )
    love_message = models.CharField(
        max_length=200,
        default="I Love You ❤️",
        help_text="The giant romantic confession revealed after clicking.",
    )
    question_message = models.CharField(
        max_length=300,
        default="Will You Stay With Me Forever?",
        help_text="The ultimate proposal question displayed below the giant animated heart.",
    )
    yes_button_text = models.CharField(
        max_length=100,
        default="YES ❤️",
        help_text="Label for the first affirmative button.",
    )
    always_yes_button_text = models.CharField(
        max_length=100,
        default="ALWAYS YES ❤️",
        help_text="Label for the second affirmative button.",
    )
    no_button_text = models.CharField(
        max_length=100,
        default="NO 💔",
        help_text="Label for the runaway button that escapes the mouse cursor.",
    )
    success_message = models.TextField(
        default="My heart is yours for all eternity! You just made me the happiest person in the universe. Happy Girlfriend's Day, my forever love! 👑💖✨",
        help_text="Message displayed after she clicks YES or ALWAYS YES.",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="If multiple configs exist, the newest active configuration will be used.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Final Surprise Setting"
        verbose_name_plural = "Final Surprise Settings"

    def __str__(self):
        return f"Final Surprise -> {self.question_message[:30]}..."


class BackgroundMusic(models.Model):
    """
    Music tracks for the website-wide background audio player.
    Allows uploading audio files or specifying external URLs via Django Admin.
    """
    title = models.CharField(
        max_length=150,
        default="Our Romantic Symphony",
        help_text="Title of the music track (e.g., 'Forever Love Melody').",
    )
    artist = models.CharField(
        max_length=150,
        default="Forever Us Orchestra",
        help_text="Artist or composer name.",
    )
    audio_file = models.FileField(
        upload_to="music/",
        blank=True,
        null=True,
        help_text="Upload an audio file (MP3, WAV, OGG).",
    )
    audio_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        help_text="Or provide an external direct audio URL if not uploading a file.",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Only active music tracks are available in the music player.",
    )
    order = models.PositiveIntegerField(
        default=1,
        help_text="Playback priority order (lower numbers play first).",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "-created_at"]
        verbose_name = "Background Music Track"
        verbose_name_plural = "Background Music Tracks"

    def __str__(self):
        return f"{self.title} — {self.artist}"

    @property
    def get_audio_url(self):
        if self.audio_file:
            try:
                return self.audio_file.url
            except Exception:
                pass
        if self.audio_url:
            return self.audio_url
        # Fallback royalty-free ambient romantic piano
        return "https://cdn.pixabay.com/download/audio/2022/05/16/audio_c2b8798db6.mp3?filename=romantic-piano-110023.mp3"


# ──────────────────────────────────────────────
# Backwards Compatibility Aliases
# ──────────────────────────────────────────────
TimelineEvent = Memory
CountdownConfig = CountdownSetting

