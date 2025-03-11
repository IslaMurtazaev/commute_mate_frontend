export interface RideRequest {
  request_id: number;
  creator_first_name: string;
  creator_last_name: string;
  creator_phone_number: string;
  creator_type: string;
  start_location: string;
  start_latitude: string;
  start_longitude: string;
  destination_location: string;
  destination_latitude: string;
  destination_longitude: string;
  start_time: string;
  end_time: string;
  status: string;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export const fetchRideRequests = async (): Promise<RideRequest[]> => {
  const response = await fetch('http://localhost:8000/rides/requests/');
  if (!response.ok) {
    throw new Error('Failed to fetch ride requests');
  }

  return await response.json();
};

export const fetchRideRequest = async (id: string): Promise<RideRequest> => {
  const response = await fetch(`http://localhost:8000/rides/requests/${id}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch ride request');
  }
  return await response.json();
};

export const createRideRequest = async (rideRequest: any, token: string) => {
  const response = await fetch('http://localhost:8000/rides/requests/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(rideRequest),
  });
  if (!response.ok) {
    throw new Error('Failed to create ride request');
  }

  return await response.json();
};
