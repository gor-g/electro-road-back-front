const vehicleListQuery = `
query vehicleList($search: String) {
  vehicleList(
    page: 0, 
    size: 20,
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
  "Content-Type": "application/json",
  "x-client-id": "5ed1175bad06853b3aa1e492",
  "x-app-id": "623998b2c35130073829b2d2",
};

async function getVehicleList(search) {
  try {
    const vehicleListQueryObject = {
      query: vehicleListQuery,
      variables: { search },
    };
    const response = await fetch("https://api.chargetrip.io/graphql", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(vehicleListQueryObject),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const result = await response.json();
    console.log("GraphQL response:", result);
    return result;
  } catch (error) {
    console.error("GraphQL request error:", error.message);
    throw error;
  }
}

export { getVehicleList };
