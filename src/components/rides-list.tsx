'use client';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { formatDateTime } from '../utils/utils';
import Container from '@mui/material/Container';

interface RideRequest {
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

const fetchRides = async (): Promise<RideRequest[]> => {
  const response = await fetch('http://localhost:8000/rides/requests/');
  if (!response.ok) {
    throw new Error('Failed to fetch rides');
  }
  return await response.json();
};

export default function RidesList() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchRides,
  });

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography>Loading rides...</Typography>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography color="error">{error.message}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Upcoming Rides
      </Typography>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {data?.map((ride: RideRequest) => (
          <div key={ride.request_id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary={`${ride.start_location} → ${ride.destination_location}`}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: 'text.primary', display: 'inline' }}
                    >
                      {formatDateTime(new Date(ride.start_time))}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </div>
        ))}
      </List>
    </Container>
  );
}
