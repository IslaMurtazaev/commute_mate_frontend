'use client';

import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { LngLatBounds } from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import './map.css';

interface MapProps {
  startCoordinates: [number, number];
  endCoordinates: [number, number];
}

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

function Map({ startCoordinates, endCoordinates }: MapProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    // Create a bounds object that includes both points
    const bounds = new LngLatBounds()
      .extend(startCoordinates)
      .extend(endCoordinates);

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      bounds: bounds,
      fitBoundsOptions: { padding: 40 },
    });

    mapRef.current = map;

    // Add markers for start and end points
    new mapboxgl.Marker({ color: '#1976d2' })
      .setLngLat(startCoordinates)
      .addTo(map);

    new mapboxgl.Marker({ color: '#9c27b0' })
      .setLngLat(endCoordinates)
      .addTo(map);

    // Get route using Mapbox Directions API
    const routeCoordinates = `${startCoordinates[0]},${startCoordinates[1]};${endCoordinates[0]},${endCoordinates[1]}`;
    const getRoute = async () => {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${routeCoordinates}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`,
        { method: 'GET' }
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;

      const geojson: GeoJSON.Feature = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route,
        },
      };

      // Add the route to the map
      if (map.getSource('route')) {
        (map.getSource('route') as mapboxgl.GeoJSONSource).setData(geojson);
      } else {
        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson,
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75,
          },
        });
      }

      // Fit the map to the route with padding
      const routeBounds = new LngLatBounds();
      route.forEach((coord: [number, number]) => {
        routeBounds.extend(coord);
      });

      map.fitBounds(routeBounds, {
        padding: 40,
        maxZoom: 15,
      });
    };

    getRoute();

    return () => {
      map.remove();
    };
  }, [startCoordinates, endCoordinates]);

  return (
    <div id="map-container" ref={mapContainerRef} className="map-container" />
  );
}

export default Map;
