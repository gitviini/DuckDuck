from django.db import models

class IMGs(models.Model):
    username = models.TextField()
    binary = models.TextField()

    def __str__(self):
        return self.user
    
class imgs_feed(models.Model):
    auth = models.TextField()
    binary = models.TextField()
    date = models.DateField()
    comments = models.TextField()
    
    def __str__(self):
        return self.user