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
import Link from 'next/link';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import { fetchRideRequests, RideRequest } from '../api/ride-requests';

export default function RidesList() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['ride-requests'],
    queryFn: fetchRideRequests,
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
    <Box sx={{ position: 'relative', minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Upcoming Rides
        </Typography>
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        >
          {data?.map((ride: RideRequest) => (
            <div key={ride.request_id}>
              <Link
                href={`/ride-request/${ride.request_id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={ride.creator_first_name}
                      src="/static/images/avatar/1.jpg"
                    />
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
              </Link>
              <Divider variant="inset" component="li" />
            </div>
          ))}
        </List>
      </Container>

      <Link href="/ride-request/create" style={{ textDecoration: 'none' }}>
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
        >
          <AddIcon />
        </Fab>
      </Link>
    </Box>
  );
}
