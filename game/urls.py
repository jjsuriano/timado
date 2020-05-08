from django.urls import path
import game.views as views

urlpatterns = [
    path('', views.inicio, name='inicio'),
]