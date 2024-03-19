import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { findRouteCenter } from "./MapTools";
import { defaultZoomLevel, defaultCenter } from "./globals";
import { getRoute } from "./route";

function Search({ setPoint }) {
  const map = useMap();

  React.useEffect(() => {
    const searchControl = new L.Control.Search({
      url: "https://nominatim.openstreetmap.org/search?format=json&q={s}",
      jsonpParam: "json_callback",
      propertyName: "display_name",
      propertyLoc: ["lat", "lon"],
      autoCollapse: false,
      autoType: false,
      minLength: 2,
    });

    searchControl.on("search:locationfound", function (e) {
      setPoint(e.latlng);
    });

    map.addControl(searchControl);

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, setPoint]);

  return null;
}

function Route({ stops }) {
  const map = useMap();
  const routingControl = useRef(null);

  useEffect(() => {
    if (routingControl.current) {
      if (map.hasLayer(routingControl.current)) {
        routingControl.current.remove();
      }
    }

    routingControl.current = L.Routing.control({
      waypoints: stops.map((position) => L.latLng(position)),
      routeWhileDragging: true,
      show: false,
    }).addTo(map);

    return () => {
      if (routingControl.current) {
        if (map.hasLayer(routingControl.current)) {
          routingControl.current.remove();
        }
      }
    };
  }, [stops, map]);

  return null;
}

export default function Map() {
  const [stops, setStops] = useState(null);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  return (
    <MapContainer
      center={
        stops && stops.length > 0 ? findRouteCenter(stops) : defaultCenter
      }
      zoom={defaultZoomLevel}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Route stops={stops} />

      <Search setPoint={setFrom} />
      <Search setPoint={setTo} />
      {from && to && getRoute(from, to, setStops)}
    </MapContainer>
  );
}
