from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.models import User
from django.contrib import auth, messages
from django.contrib.messages import constants
from users.models import IMGs
from users.models import imgs_feed
import json

#UTILS
def add_img(username='', binary=''):
    try:
        if username == '' or binary == '':
            return 'failed'
        else:
            IMGs.objects.update_or_create(
                username=username,
                defaults={'binary_photo':binary})
            return 'success'
    except Exception as erro: 
        print(f'add_img:. {erro}')
        return None

def index(req):
    return redirect('/login')

def login(req):
    if req.method == 'GET':
        pass
    else:
        name = req.POST['name']
        password = req.POST['password']

        resp = redirect('/perfil')
        resp.set_cookie('name', name)

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
                        return redirect(f'/perfil/{name}')
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
    name = req.COOKIES['name']
    bio = ''
    binary_photo = ''
    binary_bg = ''
    data = {}
    
    if req.method == 'POST': 
        data = json.loads(req.body)
        try:
            IMGs.objects.update_or_create(
                username=name,
                defaults={'bio':data['bio']}
            )
            print('sucess')
        except Exception as erro: print(erro)
    try:
        img = IMGs.objects.get(username=name)
        bio = img.bio
        binary_photo = img.binary_photo
        binary_bg = img.binary_bg
    except Exception as erro:
        print(erro)
        messages.add_message(
            req, constants.WARNING, 'add your photo'
        )
    data = {
        'name':name,
        'bio':bio,
        'binary_perfil':binary_photo,
        'binary_bg':binary_bg,
        'binary_post':[],
        'date_post':[],
        'comment_post':[],
    }
    try:
        querys = imgs_feed.objects.all()

        for query in querys:
            if query.auth == name:
                data['binary_post'].append(query.binary)
                data['date_post'].append(query.date)
                data['comment_post'].append(query.comments)
    except: pass
    return render(req, template_name='perfil.html', context=data)

def img(req):
    if req.method == 'GET':
        name = req.COOKIES['name']
        data = {
            'binary':[],
            'date':[],
            'comment':[],
        }

        querys = imgs_feed.objects.all()

        for query in querys:
            if query.auth == name:
                data['binary'].append(query.binary)
                data['date'].append(query.date)
                data['comment'].append(query.comments)

        return JsonResponse(data=data, safe=False)
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

def feed(req):
    name = req.COOKIES['name']
    img = IMGs.objects.get(username=name) 
    binary = img.binary_photo
    return render(req, template_name='feed.html', context={'binary':binary, 'username':name})

def get_feed(req):
    if req.method == 'GET':
        querys = imgs_feed.objects.all()
        data = {
            'auth':[],
            'binary':[],
            'date':[],
            'comments':[],
        }

        for query in querys:
            data['auth'].append(query.auth)
            data['binary'].append(query.binary)
            data['date'].append(query.date)
            data['comments'].append(query.comments)

        return JsonResponse(data=data, safe=False)
    else:
        try:
            data = json.loads(req.body)
            #get datas from client side
            print(data)
            img = imgs_feed(auth=data['username'],binary=data['binary'],date=data['date'],comments='')
            img.save()
            #send in imgs_feed database model
            return HttpResponse('ok')
            #return response
        except Exception as erro:
            print(erro)
            return HttpResponse('error')
    
def logout(req):
    try:
        messages.add_message(
            req, constants.SUCCESS, f'user: {req.session["name"]} logout'
        )
        del req.session['name']
        print(req.session['name'])
        return redirect('/login')
    except: pass
    return redirect('/login')