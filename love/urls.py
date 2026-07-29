"""
Forever Us — Love App URL Configuration
"""

from django.urls import path

from love import views

app_name = "love"

urlpatterns = [
    path("", views.home, name="home"),
    path("our-story/", views.our_story, name="our_story"),
    path("memories/", views.memories, name="memories"),
    path("gallery/", views.gallery, name="gallery"),
    path("reasons/", views.reasons, name="reasons"),
    path("letter/", views.love_letter, name="love_letter"),
    path("countdown/", views.countdown, name="countdown"),
    path("secret/", views.secret_page, name="secret_page"),
    path("surprise/", views.final_surprise, name="final_surprise"),
]
