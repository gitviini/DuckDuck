from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpRequest
from django.contrib.auth.models import User
from django.contrib import auth
from django.contrib import messages
from django.contrib.messages import constants
from users.models import IMGs
import json

#UTILS
def add_img(username='', binary=''):
    try:
        if username == '' or binary == '':
            return 'failed'
        else:
            img = IMGs(username=username,binary=binary)
            img.save()
            return 'success'
    except Exception as erro: 
        print(f'add_img:. {erro}')
        return None

def index(req):
    return redirect('login')

def login(req):
    if req.method == 'GET':
        pass
    else:
        name = req.POST['name']
        password = req.POST['password']
        user = auth.authenticate(req, username=name, password=password)
        if user:
            try:
                auth.login(req, user=user)
                messages.add_message(
                    req, constants.SUCCESS, f'user: {name} loged'
                )
                return redirect('perfil')
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

def perfil(req):
    return render(req, template_name='perfil.html')

def img(req):
    if req.method == 'GET':
        pass
    else:
        #print(username, binary)

        data = json.loads(req.body)

        username = data['username']
        binary = data['binary']

        message = add_img(username, binary)
        print(message)
        if message != None:
            match message:
                case 'failed':
                    messages.add_message(
                        req, constants.ERROR, message
                    )
                case 'success':
                    messages.add_message(
                        req, constants.SUCCESS, message
                    )
    return render(req, template_name='perfil.html')