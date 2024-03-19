function findRouteCenter(coordinates) {
  // find the smallest and biggest latitude and longitude than calculate the center
  let minLat = 90;
  let maxLat = -90;
  let minLng = 180;
  let maxLng = -180;
  for (let i = 0; i < coordinates.length; i++) {
    if (coordinates[i][1] < minLat) minLat = coordinates[i][1];
    if (coordinates[i][1] > maxLat) maxLat = coordinates[i][1];
    if (coordinates[i][0] < minLng) minLng = coordinates[i][0];
    if (coordinates[i][0] > maxLng) maxLng = coordinates[i][0];
  }
  return [(minLat + maxLat) / 2, (minLng + maxLng) / 2];
}

export { findRouteCenter };
