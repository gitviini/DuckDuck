from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.messages import constants
from django.contrib import messages

def login(req):

    if req.method == 'GET':
        pass
    else:
        name = req.POST['name']
        password = req.POST['password']

        if User.objects.filter(username=name).exists():
            pass
        else:
            pass
        

    return render(req, 'login.html')

def sigin(req): 

    if req.method == 'GET':
        pass
    else:
        name = req.POST['name']
        password = req.POST['password']
        confirm = req.POST['confirm']

        if password == confirm:                
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

    return render(req, 'sigin.html')