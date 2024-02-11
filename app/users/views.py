from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import auth, messages
from django.contrib.messages import constants
from users.models import IMGs
from users.models import imgs_feed
from .util import get_img_all
import json

def index(req):
    return redirect('/login')

def login(req):
    if req.method == 'GET':
        pass
    else:
        name = req.POST['name']
        password = req.POST['password']

        if not User.objects.filter(username=name).exists():
            messages.add_message(
                req, constants.ERROR, 'user no exists'
            )
        else:
            user = auth.authenticate(req, username=name, password=password)
            if user:
                try:
                    auth.login(req, user=user)
                    messages.add_message(
                        req, constants.SUCCESS, f'user: {name} loged'
                    )
                    resp = redirect(f'/{name}/')
                    resp.set_cookie('name', name)
                    req.session['username'] = name
                    return resp
                except:
                    messages.add_message(
                        req, constants.ERROR, 'error in server'
                    )
            else:
                messages.add_message(
                    req, level=constants.ERROR, message='name or password incorrect'
                )
    return render(req, 'login.html')

def signup(req):
    if req.method == 'GET':
        pass
    else:
        name = req.POST['name']
        password = req.POST['password']
        confirm = req.POST['confirm']

        if password == confirm:                
                if not User.objects.filter(username=name).exists():
                    try:
                        User.objects.create_user(
                            username=name,
                            password=password
                        )
                        messages.add_message(
                            req, constants.SUCCESS, 'sigin sucess'
                        )
                        resp = redirect(f'/{name}/')
                        resp.cookies['name'] = name
                        req.session['username'] = name
                        return resp
                    except:
                        messages.add_message(
                            req, constants.ERROR, 'server failed'
                        )
                else:
                    messages.add_message(
                        req, constants.ERROR, 'user exist'
                    )
        else:
            messages.add_message(
                req, constants.ERROR, 'passwords don´t match'
            )

    return render(req, 'signup.html')

@login_required
def perfil(req, username=''):
    data = {
        'name':username,
        'bio':'',
        'binary_perfil':'',
        'binary_bg':'',
    }

    exists = User.objects.filter(username=username).exists()

    if exists:

        try:
            img = IMGs.objects.get(username=username)
            data['bio'] = img.bio
            data['binary_perfil'] = img.binary_photo
            data['binary_bg'] = img.binary_bg
        except Exception as erro:
            print(erro)

        if req.user.username == username: return render(req, template_name='perfil.html', context=data)
        else: return render(req, template_name='visit.html', content=data)
    else:
        return HttpResponse("""<h2>page not found</h2><br><p>return</p> """)

@login_required
def feed(req):
    name = req.session['username']
    img = IMGs.objects.get(username=name)
    binary = img.binary_photo
    return render(req, template_name='feed.html', context={'binary':binary, 'username':name})
    
@login_required
def logout(req):
    try:
        auth.logout(req)
        return redirect('/login')
    except Exception as erro:
        print(erro)
        return JsonResponse({'resp':"logout:. user logout failed "}, safe=False) 