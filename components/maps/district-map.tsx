'use client';

import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export interface MapPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  /** 0-100 intensity used for colour + radius */
  intensity: number;
  detail?: string;
}

function colorFor(intensity: number): string {
  if (intensity >= 75) return '#dc2626';
  if (intensity >= 50) return '#f59e0b';
  if (intensity >= 25) return '#0ea5e9';
  return '#16a34a';
}

export default function DistrictMap({
  points,
  center = [15.9129, 79.74], // Andhra Pradesh centroid
  zoom = 7,
}: {
  points: MapPoint[];
  center?: [number, number];
  zoom?: number;
}) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {points.map((p) => (
        <CircleMarker
          key={p.id}
          center={[p.lat, p.lng]}
          radius={8 + (p.intensity / 100) * 18}
          pathOptions={{
            color: colorFor(p.intensity),
            fillColor: colorFor(p.intensity),
            fillOpacity: 0.55,
            weight: 1.5,
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{p.name}</p>
              {p.detail && <p className="text-muted-foreground">{p.detail}</p>}
              <p className="mt-1">Index: {p.intensity}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
