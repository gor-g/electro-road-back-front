import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { getRoute } from "./route";
import { getVehicleList } from "./vehicle";
import "leaflet-search";
import "leaflet-search/dist/leaflet-search.min.css";
import "./App.css";
import { defaultCenter, defaultZoomLevel } from "./globals";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function AddressSearch({ setPoint }) {
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

function Route({ positions }) {
  const map = useMap();
  const routingControl = useRef(null);

  useEffect(() => {
    if (routingControl.current) {
      routingControl.current.setWaypoints(
        positions.map((position) => L.latLng(position))
      );
    } else {
      routingControl.current = L.Routing.control({
        waypoints: positions.map((position) => L.latLng(position)),
        routeWhileDragging: true,
        show: false,
      }).addTo(map);
    }

    return () => {
      if (routingControl.current) {
        routingControl.current.setWaypoints([]);
      }
    };
  }, [positions, map]);

  return null;
}

function VehicleSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(""); // Initialize as empty string
  const [items, setItems] = useState([]);

  const fetchData = async () => {
    try {
      const vl = await getVehicleList(searchTerm);
      console.log("vl : ", vl.data.vehicleList);
      setItems(vl.data.vehicleList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Add searchTerm as a dependency

  const filteredItems = Array.isArray(items)
    ? items.filter((item) => {
        const model = item.naming.model.toLowerCase();
        const make = item.naming.make.toLowerCase();
        return (model + make).includes(searchTerm.toLowerCase());
      })
    : [];

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      <select
        value={selectedItem}
        onChange={(e) => setSelectedItem(e.target.value)}
      >
        {filteredItems.map((item) => (
          <option key={item.id} value={item.id}>
            {item.naming.make + " " + item.naming.model}
          </option>
        ))}
      </select>
    </div>
  );
}

function TopBar({ route, range, setRange }) {
  const [speed, setSpeed] = useState(60);
  const [localRange, setLocalRange] = useState(range);
  const [stopDuration, setStopDuration] = useState(0.33);
  const [totalDuration, setTotalDuration] = useState(0);
  const distance = route?.distances.reduce((sum, value) => sum + value, 0) || 0;
  const nstops = route?.coords.length - 2 || 0;

  useEffect(() => {
    setLocalRange(range);
  }, [range]);

  function fetchDuration() {
    console.log("fetchDuration");
    if (speed && range && stopDuration) {
      fetch(
        `${process.env.REACT_APP_API_URL}/soap?distance=${distance}&speed=${speed}&stopNumber=${nstops}&stopDuration=${stopDuration}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("data : ", data);
          setTotalDuration(data);
        })
        .catch((error) => console.error("Error:", error));
    }
  }

  return (
    <div>
      {" "}
      <div className="input-container">
        <label htmlFor="range">Range:</label>
        <input
          id="range"
          type="number"
          value={localRange}
          onChange={(e) => setLocalRange(e.target.value)}
          placeholder="Range"
        />
        <button onClick={() => setRange(localRange)}>Set Range</button>
        <label htmlFor="speed">Speed:</label>
        <input
          id="speed"
          type="number"
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
          placeholder="Speed"
        />
        <label htmlFor="stopDuration">Stop Duration:</label>
        <input
          id="stopDuration"
          type="number"
          value={stopDuration}
          onChange={(e) => setStopDuration(e.target.value)}
          placeholder="Stop Duration"
        />
        <button onClick={fetchDuration}>Compute Duration</button>
        <p>Total Stops: {nstops} </p>
        <p>Total Distance: {distance} </p>
        <p>Total Duration: {totalDuration}</p>
      </div>
      <VehicleSearch />
    </div>
  );
}

export default function App() {
  const [positions, setPositions] = useState(null);
  const [route, setRoute] = useState(null);
  const [range, setRange] = useState(200);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  useEffect(() => {
    async function fetchData() {
      if (from && to) {
        const r = await getRoute(range, from, to);
        console.log("obtained route : ", r);
        setPositions(r.coords);
        setRoute(r);
      }
    }
    fetchData();
  }, [range, from, to, setPositions]);
  return (
    <div>
      <TopBar
        route={route}
        range={range}
        setRange={setRange}
        style={{ height: "5vh", width: "100%" }}
      />
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoomLevel}
        style={{ height: "95vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <AddressSearch setPoint={setFrom} />
        <AddressSearch setPoint={setTo} />
        {positions && <Route positions={positions} />}
      </MapContainer>
    </div>
  );
}
