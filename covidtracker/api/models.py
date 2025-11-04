from django.db import models

# Create your models here.

class StateCovidData(models.Model):
    state = models.CharField(max_length=255,primary_key=True)
    confirmed_cases_indian = models.IntegerField()
    confirmed_cases_foreign = models.IntegerField()
    discharged = models.IntegerField()
    deaths = models.IntegerField()
    total_confirmed = models.IntegerField()

    
