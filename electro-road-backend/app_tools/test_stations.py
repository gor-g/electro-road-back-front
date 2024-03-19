from .stations import *
from pprint import pprint

def test_get_stations_near():
    stations = get_stations_near((48.49262481579178, 2.538174564250501), 10)
    assert len(stations) > 0, stations
    pprint(stations)
    # write pprinted response to a file
    with open('stations.json', 'w') as file:
        pprint(stations, file)

    # print info about the json response
    print(stations[0].keys())

test_get_stations_near()