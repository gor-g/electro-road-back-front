from math import sin, cos, sqrt, atan2, radians

def calculate_fly_distance(p1, p2):
    lon1, lat1 = p1
    lon2, lat2 = p2
    
    # approximate radius of earth in km
    R = 6371.0

    # convert degrees to radians
    lat1 = radians(lat1)
    lon1 = radians(lon1)
    lat2 = radians(lat2)
    lon2 = radians(lon2)

    # calculate the differences in coordinates
    dlon = lon2 - lon1
    dlat = lat2 - lat1

    # apply the Haversine formula
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    # calculate the distance
    distance = R * c

    return distance

def calculate_middle(orig, dest, ):
    # c'est une approximation mais devrait aller tant qu'on est pas sur les poles
    lon1, lat1 = orig
    lon2, lat2 = dest
    lat = (lat1 + lat2) / 2
    if lat<-90:
        lat += 180
    elif lat>90:
        lat -= 180
    lon= (lon1 + lon2) / 2
    if lon<-180:
        lon += 360
    elif lon>180:
        lon -= 360
    return (lon, lat)

def calculate_shift(orig, dest, shift_proportion):
    # retourne de déplacement de orig vers dest à une proportion donnée de la distance entre les deux
    # c'est une approximation mais devrait aller tant qu'on est pas sur les poles
    lon1, lat1 = orig
    lon2, lat2 = dest
    lat = lat1+ (lat2- lat1)*shift_proportion 
    if lat<-90:
        lat += 180
    elif lat>90:
        lat -= 180
    lon= lon1+ (lon2- lon1)*shift_proportion
    if lon<-180:
        lon += 360
    elif lon>180:
        lon -= 360
    return (lon, lat)

    
def fliptuple(t):
    return (t[1], t[0])