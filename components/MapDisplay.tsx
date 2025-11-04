"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// ✅ Dynamically import react-leaflet only in client (no SSR)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

// ✅ Type for props
interface MapDisplayProps {
  from: string;
  to: string;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ from, to }) => {
  const [route, setRoute] = useState<[number, number][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!from || !to) return;
      setLoading(true);

      try {
        // ✅ Load ORS API key from environment (Next.js only supports process.env)
        const apiKey = process.env.NEXT_PUBLIC_ORS_API_KEY as string;

        if (!apiKey) {
          throw new Error("❌ Missing ORS API key in your .env.local file");
        }

        // small axios instance with timeout to avoid hangs
        const client = axios.create({ timeout: 8000 });

        // Simple in-memory TTL cache to avoid repeated geocode calls for the same city
        // Cache key -> [lat, lon]
        const cacheTtlMs = 1000 * 60 * 60; // 1 hour
        const geoCache: Map<string, { ts: number; coords: [number, number] }> = (globalThis as any).__geoCache ||= new Map();

        // ✅ Get coordinates using ORS Geocode API (run in parallel for speed)
        const getCoords = async (place: string) => {
          const key = place.toLowerCase().trim();
          const cached = geoCache.get(key);
          if (cached && Date.now() - cached.ts < cacheTtlMs) {
            return cached.coords as [number, number];
          }
          const res = await client.get(`https://api.openrouteservice.org/geocode/search`, {
            params: { api_key: apiKey, text: place },
          });
          if (!res.data.features || !res.data.features.length) throw new Error(`No location found for ${place}`);
          const [lon, lat] = res.data.features[0].geometry.coordinates;
          const coords: [number, number] = [lat, lon];
          try {
            geoCache.set(key, { ts: Date.now(), coords });
          } catch (e) {
            // ignore cache set failures in very constrained environments
          }
          return coords;
        };

        // run both geocoding requests in parallel to reduce total latency
        const [fromCoords, toCoords] = await Promise.all([getCoords(from), getCoords(to)]);

        // ✅ Get route from ORS Directions API
        const routeRes = await client.post(
          `https://api.openrouteservice.org/v2/directions/driving-car/geojson`,
          {
            coordinates: [
              [fromCoords[1], fromCoords[0]],
              [toCoords[1], toCoords[0]],
            ],
          },
          {
            headers: {
              Authorization: apiKey,
              "Content-Type": "application/json",
            },
          }
        );

        const coords = routeRes.data.features[0].geometry.coordinates.map((pair: [number, number]) => [pair[1], pair[0]]);

        setRoute(coords);
        setError(null);
      } catch (err) {
        console.error(err);
        // more descriptive error for the user
        setError(
          err instanceof Error
            ? `❌ Failed to load route: ${err.message}. Check API key, cities, or network.`
            : "❌ Failed to load route. Please check API key or cities."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [from, to]);

  return (
    <div
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "10px",
        overflow: "hidden",
        backgroundColor: "#1e293b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : loading ? (
        <p style={{ color: "gray" }}>Fetching map...</p>
      ) : route.length > 0 ? (
        <MapContainer
          center={route[0]}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Polyline positions={route} color="lime" weight={4} />
          <Marker position={route[0]}>
            <Popup>{from}</Popup>
          </Marker>
          <Marker position={route[route.length - 1]}>
            <Popup>{to}</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p style={{ color: "gray" }}>Enter both cities to show route</p>
      )}
    </div>
  );
};

export default MapDisplay;

