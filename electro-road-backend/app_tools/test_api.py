import requests

# Define the parameters
params = {
    'distance': '100',
    'speed': '10',
    'stopNumber': '10',
    'stopDuration': '0.1'
}

# # Send the GET request
# response = requests.get('http://localhost:11111/api/v1/soap', params=params)

# # Check the status code
# if response.status_code == 200:
#     print('Request was successful')
#     print('Response:', response.json())
# else:
#     print('Request failed with status code', response.status_code)



# Send the GET request
response = requests.get('http://localhost:11111/api/v1/route', params={
    'range': '500',
    'origlat': '48.8712',
    'origlon': '2.3316',
    'destlat': '43.2956',
    'destlon': '5.3740'
})



if response.status_code == 200:
    print('Request was successful')
    print('Response:', response.json())
else:
    print('Request failed with status code', response.status_code)
