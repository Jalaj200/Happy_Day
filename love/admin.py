"""
Forever Us — Love App Admin Configuration
Register your database models here to manage them via Django Admin.
Includes relational filters, inline search fields, and clean fieldsets.
"""

from django.contrib import admin
from django.utils.html import format_html

from love.models import (
    CountdownSetting,
    LoveLetter,
    LoveReason,
    Memory,
    SecretPageSetting,
    FinalSurpriseSetting,
    BackgroundMusic,
)


# ──────────────────────────────────────────────
# 1. Memory Admin (Our Story Timeline)
# ──────────────────────────────────────────────
@admin.register(Memory)
class MemoryAdmin(admin.ModelAdmin):
    """Admin configuration for Memory model."""

    list_display = ("order", "title", "date_label", "date_occurred", "is_active", "created_at")
    list_display_links = ("title",)
    list_editable = ("order", "is_active")
    list_filter = ("is_active", "date_occurred")
    search_fields = ("title", "subtitle", "description", "expanded_content", "date_label")
    ordering = ("order", "date_occurred")
    list_per_page = 20

    fieldsets = (
        ("Memory Milestone Details", {
            "fields": ("title", "subtitle", "date_label", "date_occurred", "order"),
            "description": "Basic details for ordering and displaying the memory card.",
        }),
        ("Story Content", {
            "fields": ("description", "expanded_content"),
            "description": "Description is shown on the card front; expanded_content reveals on click.",
        }),
        ("Media & Visuals", {
            "fields": ("image", "icon", "emoji"),
            "description": "Upload a memory photo and choose decorative icons/emojis.",
        }),
        ("Display Settings", {
            "fields": ("is_active",),
        }),
    )





# ──────────────────────────────────────────────
# 4. Love Reason Admin
# ──────────────────────────────────────────────
@admin.register(LoveReason)
class LoveReasonAdmin(admin.ModelAdmin):
    """Admin configuration for LoveReason model."""

    list_display = ("order", "title", "emoji", "gradient_class", "is_active")
    list_display_links = ("title",)
    list_editable = ("order", "is_active", "gradient_class")
    list_filter = ("is_active", "gradient_class")
    search_fields = ("title", "description")
    ordering = ("order",)
    list_per_page = 25

    fieldsets = (
        ("Reason Details", {
            "fields": ("title", "description", "order"),
        }),
        ("Appearance", {
            "fields": ("icon", "emoji", "gradient_class"),
        }),
        ("Display Settings", {
            "fields": ("is_active",),
        }),
    )


# ──────────────────────────────────────────────
# 5. Love Letter Admin
# ──────────────────────────────────────────────
@admin.register(LoveLetter)
class LoveLetterAdmin(admin.ModelAdmin):
    """Admin configuration for LoveLetter model."""

    list_display = ("title", "date_label", "salutation", "signature", "memory", "is_active", "created_at")
    list_display_links = ("title",)
    list_editable = ("is_active",)
    list_filter = ("is_active", "memory", "created_at")
    search_fields = ("title", "body", "salutation", "closing", "signature")
    ordering = ("-created_at",)

    fieldsets = (
        ("Letter Header", {
            "fields": ("title", "date_label", "salutation"),
        }),
        ("Letter Content", {
            "fields": ("body",),
            "description": "Write your heartfelt paragraphs here. Leave blank lines between paragraphs.",
        }),
        ("Letter Closing", {
            "fields": ("closing", "signature", "postscript"),
        }),
        ("Relational Dedication", {
            "fields": ("memory",),
            "description": "Optional: Dedicate this letter to a specific milestone Memory.",
        }),
        ("Display Settings", {
            "fields": ("is_active",),
            "description": "If multiple letters are active, the newest one will be displayed on the page.",
        }),
    )


# ──────────────────────────────────────────────
# 6. Countdown Setting Admin
# ──────────────────────────────────────────────
@admin.register(CountdownSetting)
class CountdownSettingAdmin(admin.ModelAdmin):
    """Admin configuration for CountdownSetting model."""

    list_display = ("title", "target_date", "is_active", "created_at")
    list_display_links = ("title",)
    list_editable = ("is_active",)
    list_filter = ("is_active", "target_date")
    search_fields = ("title", "subtitle", "celebration_title", "celebration_message")
    ordering = ("-created_at",)

    fieldsets = (
        ("Timer Settings", {
            "fields": ("title", "subtitle", "target_date"),
            "description": "Set the target date and time when the countdown will reach zero.",
        }),
        ("Celebration Screen", {
            "fields": ("celebration_title", "celebration_message"),
            "description": "Message displayed when the countdown reaches zero (with confetti and fireworks!).",
        }),
        ("Display Settings", {
            "fields": ("is_active",),
            "description": "If multiple configs are active, the newest one will be used.",
        }),
    )


# ──────────────────────────────────────────────
# 7. Secret Page Setting Admin
# ──────────────────────────────────────────────
@admin.register(SecretPageSetting)
class SecretPageSettingAdmin(admin.ModelAdmin):
    list_display = ("title", "password_preview", "is_active", "created_at", "updated_at")
    list_editable = ("is_active",)
    list_filter = ("is_active",)
    search_fields = ("title", "message", "extended_message")
    ordering = ("-created_at",)

    fieldsets = (
        ("Security Access", {
            "fields": ("password",),
            "description": "The secret code required to unlock this sanctuary (e.g. forever0801 or anniversary date).",
        }),
        ("Sanctuary Content", {
            "fields": ("title", "message", "extended_message"),
            "description": "The romantic confession displayed in luxury typography once unlocked.",
        }),
        ("Status", {
            "fields": ("is_active",),
        }),
    )

    @admin.display(description="Secret Password")
    def password_preview(self, obj):
        if obj.password and len(obj.password) > 2:
            return format_html("<code>{}***</code>", obj.password[:2])
        return format_html("<code>***</code>")


# ──────────────────────────────────────────────
# 8. Final Surprise Setting Admin
# ──────────────────────────────────────────────
@admin.register(FinalSurpriseSetting)
class FinalSurpriseSettingAdmin(admin.ModelAdmin):
    list_display = ("hero_title", "trigger_button_text", "question_message", "is_active", "created_at")
    list_editable = ("is_active",)
    list_filter = ("is_active",)
    search_fields = ("hero_title", "question_message", "love_message", "success_message")
    ordering = ("-created_at",)

    fieldsets = (
        ("Entrance Screen", {
            "fields": ("hero_title", "hero_subtitle", "trigger_button_text"),
            "description": "Text displayed before clicking the trigger button.",
        }),
        ("The Proposal Reveal", {
            "fields": ("love_message", "question_message"),
            "description": "The giant love confession and proposal question displayed after clicking.",
        }),
        ("Interactive Button Labels", {
            "fields": ("yes_button_text", "always_yes_button_text", "no_button_text"),
            "description": "Labels for the YES, ALWAYS YES, and the runaway NO button.",
        }),
        ("Success Screen", {
            "fields": ("success_message",),
            "description": "Message displayed when she clicks YES or ALWAYS YES.",
        }),
        ("Status", {
            "fields": ("is_active",),
        }),
    )


# ──────────────────────────────────────────────
# 9. Background Music Admin
# ──────────────────────────────────────────────
@admin.register(BackgroundMusic)
class BackgroundMusicAdmin(admin.ModelAdmin):
    """Admin configuration for Website-Wide Background Music."""
    list_display = ("title", "artist", "is_active", "order", "created_at")
    list_filter = ("is_active", "created_at")
    search_fields = ("title", "artist")
    list_editable = ("is_active", "order")
    ordering = ("order", "-created_at")

    fieldsets = (
        ("Track Information", {
            "fields": ("title", "artist", "order", "is_active"),
            "description": "Basic details and display order for the music track.",
        }),
        ("Audio Source", {
            "fields": ("audio_file", "audio_url"),
            "description": "Upload an MP3/WAV file OR provide an external audio link (e.g. CDN link). If both are provided, uploaded file takes priority.",
        }),
    )



