import requests
from .privates import ORS_API_KEY

url = "https://api.openrouteservice.org/v2/directions/driving-car"

fetch_geometry_params = {
    "api_key": ORS_API_KEY,
}
fetch_geometry_headers = {
    'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
}

def fetch_geometry(start, end):
    lon_start, lat_start = start
    lon_end, lat_end = end
    # fetch_geometry_params["start"] = f"{lon_start},{lat_start}"
    # fetch_geometry_params["end"] = f"{lon_end},{lat_end}"

    url = f"https://api.openrouteservice.org/v2/directions/driving-car?api_key={ORS_API_KEY}&start={lon_start},{lat_start}&end={lon_end},{lat_end}"
    response = requests.get(url,headers=fetch_geometry_headers)

    if response.status_code == 200:
        result = response.json()
        return result["features"][0]["geometry"]
    else: 
        print("***********************************")
        print("Request for fetch_geometry failed with status code", response.status_code)
        print("on url", response.url)
        print(response.text)
        return None





fetch_drive_distances_headers = {
        'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        'Authorization': ORS_API_KEY,
        'Content-Type': 'application/json; charset=utf-8'
    }
def fetch_drive_distances(origin, destinations):
    body = {"locations": [origin] + destinations
            ,"metrics":["distance"],
            "sources":[0],
            "units":"km"}
    response = requests.post('https://api.openrouteservice.org/v2/matrix/driving-car', json=body, headers=fetch_drive_distances_headers)

    if response.status_code == 200:
        result = response.json()
        res = result["distances"][0][1:]
        res = [float(x) if x is not None else 999999 for x in res]
        return res
    else:
        print("***********************************")
        print("Request for fetch_drive_distances failed with status code", response.status_code)
        print("on url", response.url)
        print(response.text)
        return None