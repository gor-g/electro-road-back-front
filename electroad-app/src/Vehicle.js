import React, { useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: "https://api.chargetrip.com/graphql",
  cache: new InMemoryCache(),
  headers: {
    "x-client-id": "5ed1175bad06853b3aa1e492",
    "x-app-id": "623998b2c35130073829b2d2",
  },
});

// Define the GraphQL query
const SEARCH_VEHICLES = gql`
  query vehicleList($searchTerm: String!) {
    vehicleList(page: 0, size: 20, filter: { make: { eq: $searchTerm } }) {
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
    }
  }
`;

// Create the VehicleSearch component
function VehicleSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const { loading, error, data } = useQuery(SEARCH_VEHICLES, {
    variables: { searchTerm },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a vehicle"
      />
      {data.vehicleList.map((vehicle) => (
        <div key={vehicle.id}>
          <p>
            {vehicle.naming.make} {vehicle.naming.model}
          </p>
          <img
            src={vehicle.media.image.thumbnail_url}
            alt={vehicle.naming.model}
          />
        </div>
      ))}
    </div>
  );
}

// Wrap the VehicleSearch component with ApolloProvider
function VehiclePanel() {
  return (
    <ApolloProvider client={client}>
      <VehicleSearch />
    </ApolloProvider>
  );
}

export default VehiclePanel;
