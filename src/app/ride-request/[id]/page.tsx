'use client';
import { fetchRide } from '@/src/api/ride-requests';
import { Container, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function RideRequestPage() {
  const params = useParams();
  const { id } = params;

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['ride-request', id],
    queryFn: () => fetchRide(id as string),
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
    <div>
      <h1>Ride Request</h1>
      {data && (
        <div>
          <Typography>{data.start_location}</Typography>
          <Typography>{data.destination_location}</Typography>
        </div>
      )}
    </div>
  );
}
