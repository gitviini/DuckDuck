from django.db import models

class IMGs(models.Model):
    username = models.TextField(default='')
    binary_photo = models.TextField(default='')
    binary_bg = models.TextField(default='')
    bio = models.TextField(default='')

    def __str__(self):
        return self.username
    
class imgs_feed(models.Model):
    auth = models.TextField(default='')
    binary = models.TextField(default='')
    date = models.TextField(default='')
    comments = models.TextField(default='')
    
    def __str__(self):
        return self.auth