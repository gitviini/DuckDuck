from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name='index'),
    path('perfil/', view=views.perfil, name='perfil'),
    path('login/', view=views.login, name='login'),
    path('signup/', view=views.signup, name='signup'),
]