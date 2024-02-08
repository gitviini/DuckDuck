from users.models import IMGs, imgs_feed

#UTILS LIBRARY

def get_img_all():
    try:
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
            data['comments'].append(query.comments.split('&&'))
        
        return data
    except Exception as erro: print(erro)
