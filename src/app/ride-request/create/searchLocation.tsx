'use client';

import { fetchLocationSuggestions } from '@/src/api/mapboxApi';
import { useState, useEffect } from 'react';
import { Autocomplete, TextField, Paper, Box, Typography } from '@mui/material';

export type Location = {
  name: string;
  address: string;
  id: string;
};

type Props = {
  onSelect: (location: Location) => void;
  sessionToken: string;
  label: string;
};

export default function SearchLocation({
  onSelect,
  sessionToken,
  label,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  const searchLocations = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchLocationSuggestions(query, sessionToken);
      const locations = data.suggestions.map((suggestion: any) => ({
        name: suggestion.name,
        address: suggestion.place_formatted,
        id: suggestion.mapbox_id,
      }));
      setSuggestions(locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchLocations(searchQuery);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <Box sx={{ width: '100%' }}>
      <Autocomplete
        fullWidth
        options={suggestions}
        loading={loading}
        filterOptions={(x) => x} // Disable built-in filtering as we're using API
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        noOptionsText="No locations found"
        onChange={(_, newValue) => {
          if (newValue) {
            onSelect(newValue);
          }
        }}
        onInputChange={(_, newInputValue) => {
          setSearchQuery(newInputValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label={label} variant="outlined" fullWidth />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            <Paper
              elevation={0}
              sx={{
                width: '100%',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              <Typography fontWeight="bold" component="div">
                {option.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {option.address}
              </Typography>
            </Paper>
          </li>
        )}
      />
    </Box>
  );
}
