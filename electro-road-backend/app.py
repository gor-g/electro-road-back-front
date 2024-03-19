import time


from flask import (Flask, redirect, render_template, request,
                   send_from_directory, url_for)
from flask import Flask, jsonify
from flask import request
from flask_cors import CORS
import zeep
from app_tools.stations import find_stops
from app_tools.geo_tools import fliptuple


import threading
from app_tools.soap.ride_duration_service import run as run_soap_service


app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
   print('Request for index page received')
   return render_template('index.html')

@app.route('/api/v1', methods=['GET'])
def apiv1root():
    return jsonify(description='This is the Electro Road API V1')



@app.route('/api/v1/soap', methods=['GET'])
def soap():
    # Get the parameters from the request
    distance = request.args.get('distance')
    speed = request.args.get('speed')
    stopNumber = request.args.get('stopNumber')
    stopDuration = request.args.get('stopDuration')

    # Call the SOAP method with the parameters
    response = soap_client.service.get_ride_duration(distance, speed, stopNumber, stopDuration)

    # Return the SOAP response as JSON
    return jsonify(response)

@app.route('/api/v1/route', methods=['GET'])
def stations():
    max_range = float(request.args.get('range'))
    origlat = float(request.args.get('origlat'))
    origlon = float(request.args.get('origlon'))
    destlat = float(request.args.get('destlat'))
    destlon = float(request.args.get('destlon'))
    print(max_range, origlat, origlon, destlat, destlon)
    print(type(max_range), type(origlat), type(origlon), type(destlat), type(destlon))
    stops = find_stops(max_range, (origlon, origlat), (destlon, destlat))
    names = [stop[0] for stop in stops]
    coords = [fliptuple(stop[1]) for stop in stops]
    distances = [stop[2] for stop in stops]
    geometries = [stop[3] for stop in stops]
    return jsonify(names=names, coords=coords, distances=distances, geometries=geometries)



@app.before_first_request
def startup():
    global soap_client
    print("Running startup code...")

    # Run the service in a separate thread
    service_thread = threading.Thread(target=run_soap_service)
    service_thread.daemon = True
    service_thread.start()

    time.sleep(2)
    # Initialize soap_client
    try:
        soap_client = zeep.Client(wsdl='http://localhost:11112/?wsdl')
    except Exception as e:
        print(f"Failed to initialize soap_client: {e}")
        soap_client = None


if __name__ == '__main__':
    app.run()
