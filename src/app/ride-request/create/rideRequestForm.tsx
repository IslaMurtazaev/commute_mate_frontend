'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRideRequest } from '../../../api/ride-requests';
import SearchLocation, { Location } from './searchLocation';
import { fetchLocationCoordinates } from '@/src/api/mapboxApi';

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
      start_location: startLocation.address,
      start_latitude: startLocationCoordinates.latitude,
      start_longitude: startLocationCoordinates.longitude,
      destination_location: endLocation.address,
      destination_latitude: endLocationCoordinates.latitude,
      destination_longitude: endLocationCoordinates.longitude,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      status: 'new',
    };

    try {
      await createRideRequest(rideRequest, token);

      router.push('/'); // Redirect to ride requests list
    } catch (error) {
      console.error('Error creating ride request:', error);
      alert('Failed to create ride request');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Ride Request</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block text-sm font-medium">Start Location</label>
        <SearchLocation
          onSelect={setStartLocation}
          sessionToken={sessionToken}
        />

        {/* End Location */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">End Location</label>
          <SearchLocation
            onSelect={setEndLocation}
            sessionToken={sessionToken}
          />
        </div>

        {/* Time Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Start Time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Time</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Create Ride Request
        </button>
      </form>
    </div>
  );
}
