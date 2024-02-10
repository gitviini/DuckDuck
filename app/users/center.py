from django.contrib.auth.models import User, UserManager
from django.contrib import auth
from users.models import imgs_feed, IMGs
from django.http import JsonResponse
from .util import get_img_all
import json

#HUB CENTER
def hub(req):
    try:
        mode = req.content_params['mode']
        if req.method == 'POST':
            match mode:
                case 'bio_perfil':
                    return bio_perfil(req)
                case 'photo_perfil':
                    return photo_perfil(req)
                case 'img_post':
                    return img_post(req)
                case 'comment_post':
                    return comment_post(req)
                case _:
                    return JsonResponse({'resp':f'error POST:. service "{mode}" not found'}, safe=False)
        elif req.method == 'GET':
            match mode:
                case 'get_post_perfil':
                    return get_post_perfil(req)
                case 'get_post_feed':
                    return get_post_feed(req)
                case _:
                    return JsonResponse({'resp':f'error GET:. service "{mode}" not found'}, safe=False)
                
        elif req.method == 'DELETE':
            match mode:
                case 'delete_post':
                    return delete_post(req)
                case 'delete_account':
                    return delete_account(req)
                case _:
                    return JsonResponse({'resp':f'error DELETE:. service "{mode}" not found'}, safe=False)
    except Exception as erro: print(f'hub:. {erro}')
    return JsonResponse({'resp':'ok'}, safe=False)

def delete_account(req=''):
    try:
        data = json.loads(req.body)
        user = auth.authenticate(req, username=data['username'], password=data['password'])
        user.delete()
        return JsonResponse({'resp':'user deleted'}, safe=False)
    except Exception as erro: print(f'delete_account:. {erro}')
    return JsonResponse({'resp':'ok'}, safe=False)

def delete_post(req=''):
    try:
        data = json.loads(req.body)

        img = imgs_feed.objects.get(auth=data['username'],binary=data['binary'],date=data['date'],comments=data['comments'])
        img.delete()

        return get_post_feed(req)
    except Exception as erro: print(f'delete_post:. {erro}')
    return JsonResponse({'resp':'ok'}, safe=False)

def get_post_perfil(req=''):
    try:
        username = req.COOKIES['name']
        data = {
            'binary':[],
            'date':[],
            'comments':[],
        }

        querys = imgs_feed.objects.all()

        for query in querys:
            if query.auth == username:
                data['binary'].append(query.binary)
                data['date'].append(query.date)
                data['comments'].append(query.comments)

        return JsonResponse(data=data, safe=False)
    except Exception as erro: print(f'get_post_perfil:. {erro}')

def get_post_feed(req=''):
    try:
        data = get_img_all()
        return JsonResponse(data=data, safe=False)
    except Exception as erro: print(f'get_post_feed:. {erro}')

def photo_perfil(req=''):
    username = req.COOKIES['name']
    if req.method == "POST":
        try:
            data = json.loads(req.body)
            binary = data['binary']
            if username == '' or binary  == '':
                pass
            else:
                IMGs.objects.update_or_create(
                    username=username,
                    defaults={'binary_photo':binary})
        except Exception as erro: 
            print(f'photo_perfil:. {erro}')
    return JsonResponse({'resp':'ok'}, safe=False)

def comment_post(req=''):
    try:
        data = json.loads(req.body)
        comments = f"{imgs_feed.objects.get(auth=data['username'],binary=data['binary'],date=data['date']).comments}{data['comments']}"
        print(comments)
        imgs_feed.objects.update_or_create(
            auth=data['username'],
            binary=data['binary'],
            date=data['date'],
            defaults={'comments':comments})
        data = get_img_all()
        return JsonResponse(data=data, safe=False)
    except Exception as erro: print(f'comment_post:. {erro}')
    return JsonResponse({'resp':'ok'}, safe=False)

def img_post(req=''):
    try:
        data = json.loads(req.body)
        if (data['comments'] in ('',None)):
            img = imgs_feed(auth=data['username'],binary=data['binary'],date=data['date'],comments='')
            img.save()
    except Exception as erro: print(f'img_post:. {erro}')
    return JsonResponse({'resp':'ok'}, safe=False)

def bio_perfil(req=''):
    username = req.COOKIES['name']
    if req.method == 'POST': 
        data = json.loads(req.body)
        try:
            IMGs.objects.update_or_create(
                username=username,
                defaults={'bio':data['bio']}
            )
            print()
        except Exception as erro:
            print(f'bio_perfil:. {erro}')
    return JsonResponse({'resp':'ok'}, safe=False)