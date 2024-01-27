from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name='index'),
    path('perfil/<str:name>', view=views.perfil, name='perfil'),
    path('feed/', view=views.feed, name='feed'),
    path('get_feed', view=views.get_feed, name='get_feed'),
    path('img/', view=views.img, name='img'),
    path('login/', view=views.login, name='login'),
    path('signup/', view=views.signup, name='signup'),
    path('logout', view=views.logout, name='logout'),
]