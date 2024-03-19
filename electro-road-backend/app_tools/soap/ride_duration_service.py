from spyne.application import Application
from spyne.protocol.soap import Soap11
from spyne.server.wsgi import WsgiApplication
from spyne.service import ServiceBase
from spyne.decorator import rpc
from spyne.model.primitive import Unicode, Integer, Float


class RideDurationService(ServiceBase):
    @rpc(Float, Float, Float, Float, _returns=Float)
    def get_ride_duration(ctx, distance, speed, stopNumber, stopDuration):
        print("distance : ", distance)
        print("speed : ", speed)
        print("stopNumber : ", stopNumber)
        print("stopDuration : ", stopDuration)
        return distance/speed + stopNumber*stopDuration
    
def run(PORT=11112):
    from wsgiref.simple_server import make_server
    
    application = Application([RideDurationService], "electroad.api.v1",
                            in_protocol=Soap11(validator='lxml'),
                            out_protocol=Soap11())

    wsgi_application = WsgiApplication(application)
    print("staring service")
    server = make_server('localhost', PORT, wsgi_application)
    server.serve_forever()

if __name__ == '__main__':
    run()