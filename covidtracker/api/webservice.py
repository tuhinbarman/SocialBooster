import requests 

class ExternalService():

    def __init__(self,url):
        self.__url = url

    def fetch_data(self):
        try:
            response = requests.get(self.__url)
            if  response.status_code == 200:
                data = response.json()
                result = {
                    'summary': data['data']['summary'],
                    'regional_data': data['data']['regional']
                }
                return result,''
            else:
                return None,'Error getting data from api'
            
        except Exception as e:

            return None, 'Error getting data from api'