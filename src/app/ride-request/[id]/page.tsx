'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchRideRequest } from '../../../api/ride-requests';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Map from '../../../components/map/map';
import { formatDateTime } from '../../../utils/utils';

export default function RideRequestPage() {
  const { id } = useParams();

  const {
    data: ride,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['ride-request', id],
    queryFn: () => fetchRideRequest(id as string),
  });

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isError || !ride) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">Failed to load ride request details</Alert>
      </Container>
    );
  }

  const handleContactClick = () => {
    const whatsappUrl = `https://wa.me/${ride.creator_phone_number}?text=Hi, I'm interested in your ride from ${ride.start_location} to ${ride.destination_location}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3}>
        <Box sx={{ height: 300, width: '100%', position: 'relative' }}>
          <Map
            startCoordinates={[
              parseFloat(ride.start_longitude),
              parseFloat(ride.start_latitude),
            ]}
            endCoordinates={[
              parseFloat(ride.destination_longitude),
              parseFloat(ride.destination_latitude),
            ]}
          />
        </Box>

        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{ width: 56, height: 56, mr: 2 }}
              alt={`${ride.creator_first_name} ${ride.creator_last_name}`}
            >
              {ride.creator_first_name[0]}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {`${ride.creator_first_name} ${ride.creator_last_name}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {ride.creator_type}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon color="primary" sx={{ mr: 1 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  From
                </Typography>
                <Typography variant="body1">{ride.start_location}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOnIcon color="secondary" sx={{ mr: 1 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  To
                </Typography>
                <Typography variant="body1">
                  {ride.destination_location}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Departure
            </Typography>
            <Typography variant="body1">
              {formatDateTime(new Date(ride.start_time))}
            </Typography>
          </Box>

          {ride.note && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Additional Notes
              </Typography>
              <Typography variant="body1">{ride.note}</Typography>
            </Box>
          )}

          <Button
            variant="contained"
            fullWidth
            startIcon={<WhatsAppIcon />}
            onClick={handleContactClick}
            sx={{
              mt: 2,
              bgcolor: '#25D366',
              '&:hover': {
                bgcolor: '#128C7E',
              },
            }}
          >
            Contact via WhatsApp
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
