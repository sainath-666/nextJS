'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import type { MapPoint } from './district-map';

const DistrictMap = dynamic(() => import('./district-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-secondary">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  ),
});

export function MapCard({
  points,
  height = 420,
  center,
  zoom,
}: {
  points: MapPoint[];
  height?: number;
  center?: [number, number];
  zoom?: number;
}) {
  return (
    <div
      className="overflow-hidden rounded-lg border"
      style={{ height }}
    >
      <DistrictMap points={points} center={center} zoom={zoom} />
    </div>
  );
}
