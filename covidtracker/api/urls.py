from django.urls import path
from . import views


urlpatterns = [
    path('covid-data',view=views.CovidData.as_view(),name='covid-data'),
    path('update-covid-data',view = views.UpdateCovidData.as_view(),name='update-covid-data'),
    path('delete-covid-data',view=views.DeleteCovidData.as_view(),name='delete-covid-data'),
    path('get-state-data/<str:state>',view=views.GetStateData.as_view(),name='delete-covid-data')  
]