const mapboxApiKey = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

export const fetchLocationCoordinates = async (
  locationId: string,
  sessionToken: string
) => {
  const response = await fetch(
    `https://api.mapbox.com/search/searchbox/v1/retrieve/${
      locationId
    }?access_token=${mapboxApiKey}&country=US&session_token=${sessionToken}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch location coordinates');
  }
  const data = await response.json();
  const coordinates = data.features[0].geometry.coordinates;
  return {
    latitude: coordinates[1],
    longitude: coordinates[0],
  };
};

export const fetchLocationSuggestions = async (
  query: string,
  sessionToken: string
) => {
  const response = await fetch(
    `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(
      query
    )}&access_token=${mapboxApiKey}&country=US&session_token=${sessionToken}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch location suggestions');
  }
  return await response.json();
};
