import requests
from .openrouteservice import fetch_geometry, fetch_drive_distances
from .geo_tools import calculate_fly_distance, calculate_shift
from .globals import MAX_ITERATIONS

def get_stations_near(center, radius):
    print("center = " , center)
    point = f"POINT({center[0]} {center[1]})"
    where = f"where=distance(geo_point_borne,geom'{point}', {radius}km)"
    group_by = "group_by=code_insee_commune"
    refine = "refine=modified:2020"
    url = f"https://odre.opendatasoft.com/api/explore/v2.1/catalog/datasets/bornes-irve/records?limit=100&{where}"

    try: 
        response = requests.get(
        url,
        headers={
            "Accept": "application/json; charset=utf-8"
        }
        )

        if response.status_code == 200:
            if response.json()["total_count"] == 0:
                print("No stations found nearby")
                return None
            results = response.json()["results"]
            stations = [( r["n_station"], (r["xlongitude"], r["ylatitude"]) ) for r in results]
            return stations
        else:
            print("Request failed with status code", response.status_code)
            print("on url", url)
            print(response.text)
            return None
    except Exception as e:
        print(e)
        print("on url", url)
        return None


def find_next_stop(max_range, current, destionation, max_range_coef = 0.9):
    range = max_range * max_range_coef # on grade une marge de sécurité
    if range < 20:
        print("range too small")
        return None
    
    print("current", current)
    print("destionation", destionation)
    print("range", range)

    fly_dist = calculate_fly_distance(current, destionation)
    if fly_dist / range >= 6:
        print("points are too far compared to the diving range, will have to make too many api calls to ORS")
        return None

    half_range= range/2
    forth_range= range/4
    next_center_dist = half_range + forth_range
    next_radius = forth_range
    if fly_dist < half_range:
        return "destination", destionation, fetch_drive_distances(current, [destionation])[0], fetch_geometry(current, destionation)
    else:
        next_center = calculate_shift(current, destionation, next_center_dist/fly_dist)
        stops = get_stations_near(next_center, forth_range)+[("destination", destionation)]
        count = 0
        while count <= MAX_ITERATIONS:
            print(count)
            if not stops is None:
                distances_from_curr = fetch_drive_distances(current, [s[1] for s in stops])
                if distances_from_curr is None:
                    print("distances_from_curr is None")
                    return None
                reachable_stops = [s for s, d in zip(stops, distances_from_curr) if d < range]
                reachable_station_distances = [d for d in distances_from_curr if d < range]
                if len(reachable_stops) > 0:
                    distances_from_stations_to_dest = fetch_drive_distances(destionation, [s[1] for s in reachable_stops])
                    if distances_from_stations_to_dest is None:
                        print("distances_from_stations_to_dest is None")
                        return None
                    min_distance = min(distances_from_stations_to_dest)
                    min_index = distances_from_stations_to_dest.index(min_distance)
                    optimal_station = reachable_stops[min_index]
                    optimal_station_distance = reachable_station_distances[min_index]
                    name, coords = optimal_station
                    return name, coords, optimal_station_distance, fetch_geometry(current, coords)

            # on a pas trouvé de station dans le range donc on réduit la distance du point autour duquel on cherche les stations
            next_center_dist -= forth_range
            # comme on a réduit la distance du centre, on peut augmenter le rayon de recherche
            next_radius += forth_range
            next_center = calculate_shift(current, destionation, next_center_dist/fly_dist)
            if next_center_dist <= 0:
                print("No station found in range")
                return None
            count += 1
        if count > MAX_ITERATIONS:
            print("MAX_ITERATIONS reached in find_next_stop")
            return None


def find_stops(max_range, orig, dest ):
    stops = [("orig", orig, 0, [])]
    current = orig
    count = 0
    while count <= MAX_ITERATIONS:
        print("before_curr = ", current)
        next_stop = find_next_stop(max_range, current, dest)
        current = next_stop[1]
        print(next_stop[1])
        print("after_curr = ", current)
        print(dest)
        print(next_stop[0])
        print("distance = ", next_stop[2])
        if next_stop is None:
            print("returning stops incomplete")
            return None
        if len(stops)>2 and stops[-1][1] == stops[-2][1]:
            print("loop detected, returning incomplete stops")
            return stops
        elif next_stop[1] == dest:
            stops.append(next_stop)
            return stops
        stops.append(next_stop)
        
        count += 1
    if count > MAX_ITERATIONS:
        print("MAX_ITERATIONS reached in find_stops")
        return None
