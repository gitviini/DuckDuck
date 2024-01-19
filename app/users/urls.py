from django.urls import path
from . import views

urlpatterns = [
    path('login/', view=views.login, name='login'),
    path('sigin/', view=views.sigin, name='sigin'),
]