'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRideRequest } from '../../../api/ride-requests';
import SearchLocation, { Location } from './searchLocation';
import { fetchLocationCoordinates } from '@/src/api/mapboxApi';
import {
  Box,
  Typography,
  Container,
  Stack,
  TextField,
  Button,
  Paper,
} from '@mui/material';

export default function CreateRideRequest({ token }: { token: string }) {
  const router = useRouter();
  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [endLocation, setEndLocation] = useState<Location | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const sessionToken = crypto.randomUUID();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startLocation || !endLocation || !startTime || !endTime) {
      alert('Please fill in all fields');
      return;
    }

    const startLocationCoordinates = await fetchLocationCoordinates(
      startLocation.id,
      sessionToken
    );
    const endLocationCoordinates = await fetchLocationCoordinates(
      endLocation.id,
      sessionToken
    );

    const rideRequest = {
      creator_type: 'passenger',
      start_location: startLocation.name,
      start_latitude: startLocationCoordinates.latitude,
      start_longitude: startLocationCoordinates.longitude,
      destination_location: endLocation.name,
      destination_latitude: endLocationCoordinates.latitude,
      destination_longitude: endLocationCoordinates.longitude,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      status: 'new',
    };

    try {
      await createRideRequest(rideRequest, token);
      router.push('/');
    } catch (error) {
      console.error('Error creating ride request:', error);
      alert('Failed to create ride request');
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Ride Request
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <SearchLocation
              onSelect={setStartLocation}
              sessionToken={sessionToken}
              label="Start Location"
            />

            <SearchLocation
              onSelect={setEndLocation}
              sessionToken={sessionToken}
              label="End Location"
            />

            <TextField
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              label="Start Time"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <TextField
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              label="End Time"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 2 }}
            >
              Create Ride Request
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
