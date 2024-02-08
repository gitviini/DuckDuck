from django.urls import path
from . import views
from . import center

urlpatterns = [
    path('', view=views.index, name='index'),
    path('perfil/', view=views.perfil, name='perfil'),
    path('feed/', view=views.feed, name='feed'),
    path('center/', view=center.hub, name='img'),
    path('login/', view=views.login, name='login'),
    path('signup/', view=views.signup, name='signup'),
    path('logout', view=views.logout, name='logout'),
]