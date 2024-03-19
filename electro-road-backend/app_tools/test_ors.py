from .openrouteservice import fetch_geometry, fetch_drive_distances
from pprint import pprint
from .geo_tools import fliptuple

def test_fetch_geometry():
    start = fliptuple((43.295597669971755, 5.374039835386993)) 
    end = fliptuple((48.87117875141616, 2.3316601740794556)) 
    response = fetch_geometry(start, end)
    assert response is not None, response
    pprint(response)



def test_fetch_drive_distances():
    origin = [2.3316601740794556, 48.87117875141616]
    destinations = [
        [5.374039835386993, 43.295597669971755],
        [5.374039835386993, 43.295597669971755],
        [5.374039835386993, 43.295597669971755],
        [5.374039835386993, 43.295597669971755]
    ]
    response = fetch_drive_distances(origin, destinations)
    assert response is not None, response
    pprint(response)


# test_fetch_geometry()
test_fetch_drive_distances()


# from privates import ORS_API_KEY
# import requests
# from pprint import pprint

# body = {"locations":[[9.70093,48.477473],[9.207916,49.153868],[37.573242,55.801281],[115.663757,38.106467]],"metrics":["distance"],"sources":[0],"units":"km"}
# headers = {
#     'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
#     'Authorization': ORS_API_KEY,
#     'Content-Type': 'application/json; charset=utf-8'
# }
# call = requests.post('https://api.openrouteservice.org/v2/matrix/driving-car', json=body, headers=headers)

# print(call.status_code, call.reason)
# pprint(call.json())