'use client';

import { fetchLocationSuggestions } from '@/src/api/mapboxApi';
import { useState, useEffect } from 'react';

export type Location = {
  name: string;
  address: string;
  id: string;
};

type Props = {
  onSelect: (location: Location) => void;
  sessionToken: string;
};

export default function SearchLocation({ onSelect, sessionToken }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);

  const searchLocations = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const data = await fetchLocationSuggestions(query, sessionToken);
    const locations = data.suggestions.map((suggestion: any) => ({
      name: suggestion.name,
      address: suggestion.place_formatted,
      id: suggestion.mapbox_id,
    }));
    setSuggestions(locations);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchLocations(searchQuery);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSelect = (location: Location) => {
    onSelect(location);
    setSuggestions([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Search destination..."
      />
      {suggestions.length > 0 && (
        <ul className="mt-2 border rounded bg-white shadow-lg max-h-48 overflow-auto">
          {suggestions.map((location) => (
            <li
              key={location.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(location)}
            >
              {location.address}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
