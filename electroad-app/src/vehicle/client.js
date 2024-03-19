import { createClient, defaultExchanges } from "@urql/core";
import { getVehicleListQuery, getVehicleDetailsQuery } from "./queries.js";

export default class vehicleAPIClient {
  constructor(headers) {
    this.client = createClient({
      url: "https://api.chargetrip.io/graphql",
      fetchOptions: {
        method: "POST",
        headers,
      },
      exchanges: [...defaultExchanges],
    });
  }

  getVehicleList() {
    this.client
      .query(getVehicleListQuery)
      .toPromise()
      .then((response) => {
        return response.data?.vehicleList;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }

  getVehicleDetails() {
    this.client
      .query(getVehicleDetailsQuery, { vehicleId: this.vehicleId })
      .toPromise()
      .then((response) => {
        return response.data;
      })

      .catch((error) => {
        console.log(error);
        throw error;
      });
  }

  setVehicleId(vehicleId) {
    this.vehicleId = vehicleId;
  }
}
