'use client';

import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface Location {
  lat: number;
  lng: number;
}

interface MapProps {
  startLocation: Location;
  endLocation: Location;
}

export default function Map({ startLocation, endLocation }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: 'weekly',
    });

    loader.load().then((google) => {
      const map = new google.maps.Map(mapRef.current!, {
        center: startLocation,
        zoom: 12,
      });

      // Add markers for start and end locations
      new google.maps.Marker({
        position: startLocation,
        map,
        label: 'A',
        title: 'Pickup Location',
      });

      new google.maps.Marker({
        position: endLocation,
        map,
        label: 'B',
        title: 'Destination',
      });

      // Draw route between points
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true, // We already have our custom markers
      });

      directionsService.route(
        {
          origin: startLocation,
          destination: endLocation,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            directionsRenderer.setDirections(result);
          }
        }
      );
    });
  }, [startLocation, endLocation]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}
