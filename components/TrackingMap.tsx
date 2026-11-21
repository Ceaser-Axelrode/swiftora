'use client';

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';

type Point = {
  lat: number;
  lng: number;
  location: string;
};

// Custom icons
const createPackageIcon = () => {
  return L.divIcon({
    className: 'custom-package-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #f97316, #ea580c);
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(249, 115, 22, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pulse 2s infinite;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M12 8v8"/>
          <path d="M8 12h8"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const createOriginIcon = () => {
  return L.divIcon({
    className: 'custom-origin-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: #22c55e;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(34, 197, 94, 0.4);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const createDestinationIcon = () => {
  return L.divIcon({
    className: 'custom-dest-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: #3b82f6;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Interpolate between two points
function interpolatePoint(
  start: [number, number],
  end: [number, number],
  fraction: number,
): [number, number] {
  return [
    start[0] + (end[0] - start[0]) * fraction,
    start[1] + (end[1] - start[1]) * fraction,
  ];
}

// Calculate total distance of route
function calculateTotalDistance(points: [number, number][]): number {
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1][0] - points[i][0];
    const dy = points[i + 1][1] - points[i][1];
    total += Math.sqrt(dx * dx + dy * dy);
  }
  return total;
}

// Get current position along the route based on progress (0-1)
function getPositionAlongRoute(
  route: [number, number][],
  progress: number,
): [number, number] {
  if (route.length === 0) return [0, 0];
  if (route.length === 1) return route[0];

  const totalDistance = calculateTotalDistance(route);
  const targetDistance = totalDistance * progress;

  let currentDistance = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const start = route[i];
    const end = route[i + 1];
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const segmentDistance = Math.sqrt(dx * dx + dy * dy);

    if (currentDistance + segmentDistance >= targetDistance) {
      const remainingDistance = targetDistance - currentDistance;
      const fraction =
        segmentDistance > 0 ? remainingDistance / segmentDistance : 0;
      return interpolatePoint(start, end, fraction);
    }
    currentDistance += segmentDistance;
  }

  return route[route.length - 1];
}

// Fit bounds to show the entire route
function FitBounds({ points }: { points: Point[] }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;
    const bounds = points.map((p) => [p.lat, p.lng]) as [number, number][];
    map.fitBounds(bounds, { padding: [60, 60] });
  }, [points, map]);

  return null;
}

// Animated shipment marker with smooth movement
function AnimatedShipmentMarker({
  route,
  points,
  duration = 8000,
}: {
  route: [number, number][];
  points: Point[];
  duration?: number;
}) {
  const [position, setPosition] = useState<[number, number]>(
    route[0] || [0, 0],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (route.length < 2) {
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min((elapsed % duration) / duration, 0.99);

      const newPosition = getPositionAlongRoute(route, progress);
      setPosition(newPosition);

      // Calculate which segment we're on for popup info
      const totalSegments = route.length - 1;
      const segmentProgress = progress * totalSegments;
      const segmentIndex = Math.min(
        Math.floor(segmentProgress),
        totalSegments - 1,
      );
      setCurrentIndex(segmentIndex);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      startTimeRef.current = 0;
    };
  }, [route, duration]);

  const markerPosition: [number, number] =
    route.length < 2 ? route[0] ?? [0, 0] : position;

  return (
    <Marker position={markerPosition} icon={createPackageIcon()}>
      <Popup>
        <div className="font-semibold">📦 Current Location</div>
        <div className="text-sm text-gray-600">
          {points[currentIndex]?.location || 'In transit...'}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Moving to:{' '}
          {points[Math.min(currentIndex + 1, points.length - 1)]?.location ||
            'Destination'}
        </div>
      </Popup>
    </Marker>
  );
}

// Animated dashed polyline showing the flow
function AnimatedFlowLine({ positions }: { positions: [number, number][] }) {
  const [dashOffset, setDashOffset] = useState(0);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      setDashOffset((prev) => (prev - 1) % 20);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (positions.length < 2) return null;

  return (
    <Polyline
      positions={positions}
      pathOptions={{
        color: '#f97316',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10',
        dashOffset: dashOffset.toString(),
        lineCap: 'round',
        lineJoin: 'round',
      }}
    />
  );
}

export default function TrackingMap({ points }: { points: Point[] }) {
  // Fix Leaflet icons
  useEffect(() => {
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
      ._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  }, []);

  const route = points.map((p) => [p.lat, p.lng]) as [number, number][];

  if (route.length === 0) return null;

  // Center on first point
  const center: [number, number] =
    route[Math.floor(route.length / 2)] || route[0];

  return (
    <div className="relative">
      {/* Progress indicator */}
      <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-700">In Transit</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {points[0]?.location} → {points[points.length - 1]?.location}
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={5}
        style={{ height: '400px', width: '100%' }}
        className="rounded-xl shadow-lg"
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {points.length > 1 && <FitBounds points={points} />}

        {/* Background line (completed path) */}
        {route.length > 1 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: '#e5e7eb',
              weight: 6,
              opacity: 1,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        )}

        {/* Animated flow line */}
        {route.length > 1 && <AnimatedFlowLine positions={route} />}

        {/* Origin marker (pickup) */}
        {points[0] && (
          <Marker
            position={[points[0].lat, points[0].lng]}
            icon={createOriginIcon()}
          >
            <Popup>
              <div className="font-semibold text-green-600">
                📍 Pickup Location
              </div>
              <div className="text-sm">{points[0].location}</div>
            </Popup>
          </Marker>
        )}

        {/* Destination marker (delivery) */}
        {points.length > 1 && points[points.length - 1] && (
          <Marker
            position={[
              points[points.length - 1].lat,
              points[points.length - 1].lng,
            ]}
            icon={createDestinationIcon()}
          >
            <Popup>
              <div className="font-semibold text-blue-600">🎯 Destination</div>
              <div className="text-sm">
                {points[points.length - 1].location}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Animated package marker */}
        <AnimatedShipmentMarker route={route} points={points} />
      </MapContainer>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-muted-foreground">Pickup</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-orange-500 border-dashed border-t-2" />
          <span className="text-muted-foreground">Route</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-muted-foreground">Destination</span>
        </div>
      </div>
    </div>
  );
}
