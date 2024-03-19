const vehicleListQuery = `
query vehicleList {
  vehicleList(
    page: 0, 
    size: 20
    search: $search
    ) {
    id
    naming {
      make
      model
      chargetrip_version
    }
    media {
      image {
        thumbnail_url
      }
    }
    range {
      chargetrip_range {
        best
        worst
      }
    }
  }
}
`;

const headers = {
  "x-client-id": "5ed1175bad06853b3aa1e492",
  "x-app-id": "623998b2c35130073829b2d2",
};

async function getVehicleList(search) {
  const vehicleListQueryObject = {
    query: vehicleListQuery,
    variables: { search },
  };
  const response = await fetch(process.env.REACT_APP_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vehicleListQueryObject),
  });
  if (response.ok) {
    const result = await response.json();
    console.log("result : ", result);
    return result;
  } else {
    throw new Error(`Request error: ${response.statusText}`);
  }
}

export { getVehicleList };

function VehicleSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Replace with your API call
    const response = await fetch("https://api.example.com/items");
    const data = await response.json();
    setItems(data);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
}
import { getVehicleList } from "./vehicle";
