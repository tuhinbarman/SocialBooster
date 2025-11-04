from decouple import config
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import F
from .models import StateCovidData
from .webservice import ExternalService

# Create your views here.

class CovidData(APIView):

    def get(self,request):
        try:
            service = ExternalService(config('API_ENDPOINT'))
            data,msg = service.fetch_data()
            response_data = {}
            if not data:
                response_data['message'] = 'fail'
                response_data['data'] = msg
                return Response(data,status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            response_data['message'] = 'success'
            response_data['data'] = data
            return Response(data,status=status.HTTP_200_OK)
            
        except Exception as err:
            print(err)
            response_data['message'] = 'fail'
            response_data['data'] = msg
            return Response(data = data,status=status.HTTP_500_INTERNAL_SERVER_ERROR )




    def post(self,request):
        try:
            state = request.data.get('loc')
            confirmed_cases_indian = request.data.get('confirmedCasesIndian')
            confirmed_cases_foreign = request.data.get('confirmedCasesForeign')
            discharged = request.data.get('discharged')
            deaths = request.data.get('deaths')
            total_confirmed = request.data.get('totalConfirmed')
            response_data={'message' : '','data' : ''}

            if not state:
                response_data['message'] = 'fail'
                response_data['data'] = 'Pls provide mandatory fields'
                return Response(data=response_data,status=status.HTTP_400_BAD_REQUEST)
            
            if StateCovidData.objects.filter(state=state).exists():
                    response_data['message'] = 'fail'
                    response_data['data'] = 'Data for State already exists'
                    return Response(data=response_data,status = status.HTTP_400_BAD_REQUEST)
            
            with transaction.atomic():
                
                StateCovidData.objects.create(
                    state=state,confirmed_cases_indian=confirmed_cases_indian,confirmed_cases_foreign = confirmed_cases_foreign,
                    discharged = discharged ,deaths = deaths ,total_confirmed = total_confirmed
                )
            response_data['message'] = 'success'
            response_data['data'] = 'successfully inserted data'
            return Response(data=response_data,status=status.HTTP_200_OK)


        except Exception as err:
            response_data['message'] = 'fail'
            response_data['data'] = 'Error occurred while posting data'
            return Response(data = response_data,status = status.HTTP_500_INTERNAL_SERVER_ERROR)




class UpdateCovidData(APIView):


    def get(self,request):
        try:
            
            response_data = {}
            state_data = StateCovidData.objects.all().values(
                'discharged',
                'deaths',
                loc = F('state'),
                confirmedCasesIndian = F('confirmed_cases_indian'),
                confirmedCasesForeign = F('confirmed_cases_foreign'),
                
                totalConfirmed = F('total_confirmed')
            )
            response_data['message'] = 'success'
            response_data['data'] = state_data
            return Response(response_data,status=status.HTTP_200_OK)
            
        except Exception as err:
            print(err)
            response_data['message'] = 'fail'
            response_data['data'] = 'Error occurred while getting data'
            return Response(data = response_data,status=status.HTTP_500_INTERNAL_SERVER_ERROR )


    def put(self,request):
        try:

            state = request.data.get('loc')
            confirmed_cases_indian = request.data.get('confirmedCasesIndian')
            confirmed_cases_foreign = request.data.get('confirmedCasesForeign')
            discharged = request.data.get('discharged')
            deaths = request.data.get('deaths')
            total_confirmed = request.data.get('totalConfirmed')
            response_data={'message' : '','data' : ''}

            
            with transaction.atomic():
                
                StateCovidData.objects.select_for_update().filter(state=state).update(
                    state=state,confirmed_cases_indian=confirmed_cases_indian,confirmed_cases_foreign = confirmed_cases_foreign,
                    discharged = discharged ,deaths = deaths ,total_confirmed = total_confirmed
                )

            state_data = StateCovidData.objects.all().values(
                'state',
                'confirmed_cases_indian',
                'confirmed_cases_foreign',
                'discharged',
                'deaths',
                'total_confirmed'
            )
            response_data['message'] = 'success'
            response_data['data'] = state_data
            return Response(data=response_data,status=status.HTTP_200_OK)

        
        except Exception as err:
            response_data['message'] = 'fail'
            response_data['data'] = 'Error occurred while posting data'
            return Response(data = response_data,status = status.HTTP_500_INTERNAL_SERVER_ERROR)

class DeleteCovidData(APIView):

    def delete(self,request):

        try:
            state = request.data.get('loc')
            response_data={'message' : '','data' : ''}

            if not state:
                response_data['message'] = 'fail'
                response_data['data'] = 'Pls provide mandatory fields'
                return Response(data=response_data,status=status.HTTP_400_BAD_REQUEST)
            
            try:
                state_obj = StateCovidData.objects.get(state=state)
            except StateCovidData.DoesNotExist:
                response_data['message'] = 'fail'
                response_data['data'] = 'State Does not exists'
                return Response(data=response_data,status=status.HTTP_400_BAD_REQUEST)
            
            state_obj.delete()
            response_data['message'] = 'success'
            response_data['data'] = 'successfully deleted data'
            return Response(data=response_data,status=status.HTTP_200_OK)

        except Exception as err:
            response_data['message'] = 'fail'
            response_data['data'] = 'Error occurred while posting data'
            return Response(data = response_data,status = status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class GetStateData(APIView):

    def get(self,request,state):

        try:
            response_data={'message' : '','data' : ''}
            if not state:
                response_data['message'] = 'fail'
                response_data['data'] = 'Pls provide mandatory fields'
                return Response(data=response_data,status=status.HTTP_400_BAD_REQUEST)
            
            try:
                state_obj = StateCovidData.objects.get(state=state)
            except StateCovidData.DoesNotExist:
                response_data['message'] = 'fail'
                response_data['data'] = 'State Does not exists'
                return Response(data=response_data,status=status.HTTP_400_BAD_REQUEST)
            
            response_data['message'] = 'success'
            response_data['data'] = state_obj
            return Response(data=response_data,status=status.HTTP_200_OK)

        except Exception as err:
            response_data['message'] = 'fail'
            response_data['data'] = 'Error occurred while posting data'
            return Response(data = response_data,status = status.HTTP_500_INTERNAL_SERVER_ERROR)


        
        
        





