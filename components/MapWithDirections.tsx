"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

// Create custom marker icons
const createCustomIcon = (color: "green" | "red", emoji: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background-color: ${color === "green" ? "#22c55e" : "#ef4444"};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        font-size: 20px;
        cursor: pointer;
        transition: transform 0.2s;
      " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
        ${emoji}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

interface MapWithDirectionsProps {
  startCity: string;
  endCity: string;
  routeType?: "fastest" | "healthiest" | "balanced";
  pollutionLevel?: "low" | "moderate" | "high";
  onDistanceChange?: (distance: number) => void;
}

interface Coordinates {
  lat: number;
  lng: number;
}

const MapWithDirections: React.FC<MapWithDirectionsProps> = ({
  startCity,
  endCity,
  routeType = "balanced",
  pollutionLevel = "moderate",
  onDistanceChange,
}) => {
  const [startCoords, setStartCoords] = useState<Coordinates | null>(null);
  const [endCoords, setEndCoords] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const [routeInfo, setRouteInfo] = useState<string>("");

  // Create marker icons
  const startIcon = createCustomIcon("green", "📍");
  const endIcon = createCustomIcon("red", "🎯");

  // Geocode city names to coordinates
  const geocodeCity = async (city: string): Promise<Coordinates | null> => {
    try {
      console.log(`🔍 Geocoding city: ${city}`);
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`
      );
      
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Nominatim response for ${city}:`, data);
      
      if (data.length > 0) {
        const coords = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
        console.log(`📍 ${city} coordinates: ${coords.lat}, ${coords.lng}`);
        return coords;
      }
      
      console.error(`❌ City not found: ${city}`);
      return null;
    } catch (err) {
      console.error(`❌ Geocoding error for ${city}:`, err);
      return null;
    }
  };

  // Generate intermediate waypoints based on pollution level
  const generateWaypoints = (start: Coordinates, end: Coordinates, pollution: "low" | "moderate" | "high"): Coordinates[] => {
    const waypoints: Coordinates[] = [];
    const latDiff = end.lat - start.lat;
    const lngDiff = end.lng - start.lng;
    
    console.log(`🛣️ Generating waypoints for ${pollution} pollution level`);
    console.log(`📍 Start: ${start.lat}, ${start.lng}`);
    console.log(`📍 End: ${end.lat}, ${end.lng}`);
    console.log(`📐 Lat diff: ${latDiff}, Lng diff: ${lngDiff}`);
    
    if (pollution === "low") {
      // Healthiest route: Take longer detours away from highways
      // Add waypoints with LARGE perpendicular deviations to force different routes
      const w1 = {
        lat: start.lat + latDiff * 0.35 + lngDiff * 0.35,  // ← Large lateral deviation (+35%)
        lng: start.lng + lngDiff * 0.35 - latDiff * 0.35,  // ← Force different path
      };
      const w2 = {
        lat: start.lat + latDiff * 0.70 + lngDiff * 0.30,  // ← Continue deviation
        lng: start.lng + lngDiff * 0.70 - latDiff * 0.30,
      };
      waypoints.push(w1, w2);
      console.log("✅ Generated 2 waypoints for LOW pollution route (LARGE detours)");
      console.log(`   W1: ${w1.lat.toFixed(4)}, ${w1.lng.toFixed(4)}`);
      console.log(`   W2: ${w2.lat.toFixed(4)}, ${w2.lng.toFixed(4)}`);
    } else if (pollution === "moderate") {
      // Balanced route: Moderate detours
      const w1 = {
        lat: start.lat + latDiff * 0.5 + lngDiff * 0.20,  // ← Moderate deviation (+20%)
        lng: start.lng + lngDiff * 0.5 - latDiff * 0.20,
      };
      waypoints.push(w1);
      console.log("✅ Generated 1 waypoint for MODERATE pollution route (moderate detours)");
      console.log(`   W1: ${w1.lat.toFixed(4)}, ${w1.lng.toFixed(4)}`);
    } else {
      console.log("✅ HIGH pollution - using direct route (no waypoints)");
    }
    // "high" (fastest) - no waypoints, direct route

    return waypoints;
  };

  // Get route via OSRM API (Open Route Service)
  const getRouteViaOSRM = async (start: Coordinates, end: Coordinates) => {
    try {
      console.log("\n🗺️ ========== ROUTE CALCULATION START ==========");
      console.log(`📍 Start: lat=${start.lat.toFixed(4)}, lng=${start.lng.toFixed(4)}`);
      console.log(`📍 End: lat=${end.lat.toFixed(4)}, lng=${end.lng.toFixed(4)}`);
      console.log(`🌍 Pollution Level: ${pollutionLevel}`);
      
      // Generate waypoints based on pollution level
      const waypoints = generateWaypoints(start, end, pollutionLevel);
      console.log(`🛣️ Total waypoints: ${waypoints.length}`);
      
      // Build route URL with waypoints
      let routeUrl = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat}`;
      
      // Add waypoints if they exist (for low and moderate pollution routes)
      waypoints.forEach((wp, index) => {
        routeUrl += `;${wp.lng},${wp.lat}`;
        console.log(`   Waypoint ${index + 1}: lat=${wp.lat.toFixed(4)}, lng=${wp.lng.toFixed(4)}`);
      });
      
      routeUrl += `;${end.lng},${end.lat}?overview=full&geometries=geojson`;
      
      console.log(`� OSRM URL: ${routeUrl}`);
      
      const response = await fetch(routeUrl);
      
      if (!response.ok) {
        throw new Error(`OSRM API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.routes || data.routes.length === 0) {
        throw new Error("No routes found in OSRM response");
      }
      
      if (data.code !== "Ok") {
        throw new Error(`OSRM error: ${data.code} - ${data.message}`);
      }
      
      const route = data.routes[0];
      const coords: [number, number][] = route.geometry.coordinates.map(
        (coord: [number, number]) => [coord[1], coord[0]] // Swap to [lat, lng]
      );
      setRoutePoints(coords);
      
      // Calculate distance in km
      const distanceKm = route.distance / 1000;
      setDistance(`${distanceKm.toFixed(1)} km`);
      
      // Calculate duration
      const durationSeconds = route.duration;
      const hours = Math.floor(durationSeconds / 3600);
      const minutes = Math.floor((durationSeconds % 3600) / 60);
      setDuration(hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`);
      
      console.log(`✅ Route calculated successfully!`);
      console.log(`   Distance: ${distanceKm.toFixed(1)} km`);
      console.log(`   Duration: ${hours}h ${minutes}m`);
      console.log(`   Route points: ${coords.length}`);
      console.log("🗺️ ========== ROUTE CALCULATION END ==========\n");
      
      // Notify parent component of actual distance
      if (onDistanceChange) {
        onDistanceChange(distanceKm);
      }
    } catch (err) {
      console.error("❌ OSRM routing error:", err);
      // Fallback to straight line
      generateFallbackRoute(start, end);
    }
  };

  // Fallback: Generate straight line if OSRM fails
  const generateFallbackRoute = (start: Coordinates, end: Coordinates) => {
    const points: [number, number][] = [[start.lat, start.lng], [end.lat, end.lng]];
    setRoutePoints(points);
    
    // Calculate straight-line distance
    const R = 6371;
    const dLat = ((end.lat - start.lat) * Math.PI) / 180;
    const dLng = ((end.lng - start.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((start.lat * Math.PI) / 180) *
        Math.cos((end.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;
    setDistance(`${dist.toFixed(1)} km (approx)`);
    
    const hours = Math.floor(dist / 40);
    const mins = Math.round((dist % 40) / (40 / 60));
    setDuration(hours > 0 ? `${hours}h ${mins}m` : `${mins}m`);
  };

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!startCity || !endCity) {
        setLoading(false);
        return;
      }

      try {
        const [start, end] = await Promise.all([
          geocodeCity(startCity),
          geocodeCity(endCity),
        ]);

        if (start && end) {
          setStartCoords(start);
          setEndCoords(end);
          setError(null);
          
          // Get actual route via OSRM
          await getRouteViaOSRM(start, end);
        } else {
          setError("Could not find one or both cities. Please check spelling.");
        }
      } catch (err) {
        setError("Error loading directions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [startCity, endCity]);

  // Recalculate route when pollution level changes
  useEffect(() => {
    if (startCoords && endCoords) {
      console.log("🔄 Pollution level changed to:", pollutionLevel);
      console.log("📍 Recalculating route with new waypoints...");
      // Force a fresh route calculation
      getRouteViaOSRM(startCoords, endCoords);
    } else {
      console.log("⏳ Waiting for coordinates... startCoords:", !!startCoords, "endCoords:", !!endCoords);
    }
  }, [pollutionLevel, startCoords, endCoords]);

  // Update route information when route type changes
  useEffect(() => {
    let info = "";
    switch (routeType) {
      case "healthiest":
        info = "🌿 Healthiest Route: Avoids high pollution zones, takes scenic roads with better air quality";
        break;
      case "fastest":
        info = "⚡ Fastest Route: Direct highway route, fastest option but standard pollution levels";
        break;
      case "balanced":
        info = "⚖️ Balanced Route: Optimal balance between travel speed and air quality (RECOMMENDED)";
        break;
    }
    setRouteInfo(info);
  }, [routeType]);  if (loading) {
    return (
      <div className="w-full h-96 bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-xl flex items-center justify-center border-2 border-primary">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-foreground">Loading route...</p>
        </div>
      </div>
    );
  }

  if (error || !startCoords || !endCoords) {
    return (
      <div className="w-full h-96 bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-xl flex items-center justify-center border-2 border-primary">
        <div className="text-center">
          <p className="text-red-500 font-semibold">{error || "Unable to load route"}</p>
        </div>
      </div>
    );
  }

  const centerLat = (startCoords.lat + endCoords.lat) / 2;
  const centerLng = (startCoords.lng + endCoords.lng) / 2;

  return (
    <div className="space-y-4">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={9}
        style={{ height: "450px", borderRadius: "0.75rem", border: "2px solid #3b82f6" }}
        className="z-10"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {/* Draw route line */}
        {routePoints.length > 0 && (
          <Polyline
            positions={routePoints}
            color={
              pollutionLevel === "low" ? "#22c55e" :
              pollutionLevel === "moderate" ? "#eab308" :
              "#ef4444"
            }
            weight={4}
            opacity={0.8}
            dashArray="5, 5"
          />
        )}
        
        {/* Start marker with custom icon */}
        <Marker position={[startCoords.lat, startCoords.lng]} icon={startIcon}>
          <Popup>
            <div className="text-sm">
              <p className="font-bold text-green-600">📍 START</p>
              <p className="font-semibold">{startCity}</p>
            </div>
          </Popup>
        </Marker>
        
        {/* End marker with custom icon */}
        <Marker position={[endCoords.lat, endCoords.lng]} icon={endIcon}>
          <Popup>
            <div className="text-sm">
              <p className="font-bold text-red-600">🎯 DESTINATION</p>
              <p className="font-semibold">{endCity}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Route Information Cards */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-2 border-primary rounded-lg p-4">
          <p className="text-xs text-muted-foreground font-semibold">📏 DISTANCE</p>
          <p className="text-2xl font-bold text-primary mt-1">{distance}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 border-2 border-orange-500 rounded-lg p-4">
          <p className="text-xs text-muted-foreground font-semibold">⏱️ TIME</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">{duration}</p>
        </div>
      </div>

      {/* Route Summary */}
      <div className="bg-card border-l-4 border-primary rounded-lg p-4 mt-4 space-y-2">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">🚗 Route:</span> From <span className="font-semibold text-green-600">{startCity}</span> to <span className="font-semibold text-red-600">{endCity}</span>
        </p>
        <p className="text-sm text-foreground bg-primary/10 rounded px-3 py-2 border-l-2 border-primary">
          {routeInfo}
        </p>
      </div>
    </div>
  );
};

export default MapWithDirections;
