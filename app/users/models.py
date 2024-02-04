from django.db import models

class IMGs(models.Model):
    username = models.TextField()
    binary = models.TextField()

    def __str__(self):
        return self.username
    
class imgs_feed(models.Model):
    auth = models.TextField()
    binary = models.TextField()
    date = models.TextField()
    comments = models.TextField()
    
    def __str__(self):
        return self.auth