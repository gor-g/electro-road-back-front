import qql from "graphql-tag";

export const getVehicleListQuery = qql`
query vehicleList {
  vehicleList(
    page: 0, 
    size: 20
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
  }
}
`;

export const getVehicleDetailsQuery = qql`
query vehicle($vehicleId: ID!) {
  vehicle(id: $vehicleId) {
    naming {
      make
      model
      chargetrip_version
    }
    media {
      image {
        url
      }
      brand {
        thumbnail_url
      }
    }
    range {
      chargetrip_range {
        best
        worst
      }
    }
    connectors {
      standard
    }
    adapters {
      time
    }
  }
}
`;
