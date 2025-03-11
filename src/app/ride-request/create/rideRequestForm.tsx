'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createRideRequest } from '../../../api/ride-requests';

interface Location {
  place_name: string;
  center: [number, number];
}

export default function CreateRideRequest({ token }: { token: string }) {
  const router = useRouter();
  const [startSearch, setStartSearch] = useState('');
  const [endSearch, setEndSearch] = useState('');
  const [startSuggestions, setStartSuggestions] = useState<Location[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<Location[]>([]);
  const [selectedStart, setSelectedStart] = useState<Location | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Location | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const searchLocations = async (query: string, isStart: boolean) => {
    if (!query) {
      isStart ? setStartSuggestions([]) : setEndSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&country=US`
      );
      const data = await response.json();
      const locations = data.features.map((feature: any) => ({
        place_name: feature.place_name,
        center: feature.center,
      }));
      isStart ? setStartSuggestions(locations) : setEndSuggestions(locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchLocations(startSearch, true);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [startSearch]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchLocations(endSearch, false);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [endSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStart || !selectedEnd || !startTime || !endTime) {
      alert('Please fill in all fields');
      return;
    }

    const rideRequest = {
      creator_type: 'passenger',
      start_location: selectedStart.place_name,
      start_latitude: selectedStart.center[1].toString(),
      start_longitude: selectedStart.center[0].toString(),
      destination_location: selectedEnd.place_name,
      destination_latitude: selectedEnd.center[1].toString(),
      destination_longitude: selectedEnd.center[0].toString(),
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
        {/* Start Location */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Start Location</label>
          <input
            type="text"
            value={startSearch}
            onChange={(e) => setStartSearch(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Search start location..."
          />
          {startSuggestions.length > 0 && (
            <ul className="mt-2 border rounded bg-white shadow-lg max-h-48 overflow-auto">
              {startSuggestions.map((location, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedStart(location);
                    setStartSearch(location.place_name);
                    setStartSuggestions([]);
                  }}
                >
                  {location.place_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* End Location */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">End Location</label>
          <input
            type="text"
            value={endSearch}
            onChange={(e) => setEndSearch(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Search destination..."
          />
          {endSuggestions.length > 0 && (
            <ul className="mt-2 border rounded bg-white shadow-lg max-h-48 overflow-auto">
              {endSuggestions.map((location, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedEnd(location);
                    setEndSearch(location.place_name);
                    setEndSuggestions([]);
                  }}
                >
                  {location.place_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Map Display */}
        {/* {selectedStart && selectedEnd && (
          <div className="h-64 mb-6">
            <Map
              startCoordinates={[
                parseFloat(selectedStart.center[0]),
                parseFloat(selectedStart.center[1]),
              ]}
              endCoordinates={[
                parseFloat(selectedEnd.center[0]),
                parseFloat(selectedEnd.center[1]),
              ]}
            />
          </div>
        )} */}

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
