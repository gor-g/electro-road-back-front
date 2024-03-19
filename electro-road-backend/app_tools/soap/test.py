from zeep import Client

client = Client('http://localhost:11112/?wsdl')

resp = client.service.get_ride_duration(100, 10, 10, .1)

assert resp == 11, resp
