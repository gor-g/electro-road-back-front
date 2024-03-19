async function getRoute(range, from, to) {
  const pingResponse = await fetch(process.env.REACT_APP_API_URL);
  if (!pingResponse.ok) {
    throw new Error(`Server not accessible: ${pingResponse.statusText}`);
  }
  console.log("Server is accessible");
  console.log("from: ", from);
  console.log("to: ", to);

  const url = `${process.env.REACT_APP_API_URL}/route?range=${range}&origlat=${from.lat}&origlon=${from.lng}&destlat=${to.lat}&destlon=${to.lng}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const result = await response.json();
    return result;
  } else {
    throw new Error(`Request error: ${response.statusText}`);
  }
}

export { getRoute };
