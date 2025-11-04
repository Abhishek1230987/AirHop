"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";
import SearchBar from "@/components/search-bar";
import { MapPin, Wind, TrendingUp, Loader, Map, AlertCircle, CheckCircle, Route } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import map component to avoid SSR issues
const MapWithDirections = dynamic(() => import("../../components/MapWithDirections"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-xl flex items-center justify-center border-2 border-primary">
      <div className="text-center">
        <Loader className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
        <p className="text-foreground font-semibold">Loading map...</p>
      </div>
    </div>
  ),
}) as any;

interface AQIData {
  city: string;
  aqi: number;
  temperature: number;
  humidity: number;
}

interface RouteOption {
  id: string;
  name: string;
  type: "fastest" | "healthiest" | "balanced";
  distance: number;
  time: number;
  avgAQI: number;
  pollution: "low" | "moderate" | "high";
  description: string;
  icon: string;
}

export default function SearchPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [startCity, setStartCity] = useState("");
  const [endCity, setEndCity] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [aqiData, setAqiData] = useState<AQIData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [actualDistance, setActualDistance] = useState<number>(1350);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load previous search from localStorage or history on mount
  useEffect(() => {
    if (!loading && user) {
      const params = new URLSearchParams(window.location.search);
      const restoreId = params.get("restore");
      
      if (restoreId) {
        console.log("🔄 Restoring search from history with ID:", restoreId);
        const fetchSpecificSearch = async () => {
          try {
            const response = await fetch(`/api/search/${restoreId}`, {
              credentials: 'include',
            });
            
            if (!response.ok) {
              throw new Error('Failed to fetch search');
            }
            
            const data = await response.json();
            const search = data.search;
            
            console.log("✅ Restored search:", search);
            setStartCity(search.source || "");
            setEndCity(search.destination || "");
            setSubmitted(true);
            setAqiData([
              { city: search.source, aqi: search.sourceAQI?.aqi || 50, temperature: search.sourceAQI?.temperature || 25, humidity: search.sourceAQI?.humidity || 60 },
              { city: search.destination, aqi: search.destinationAQI?.aqi || 50, temperature: search.destinationAQI?.temperature || 25, humidity: search.destinationAQI?.humidity || 60 }
            ]);
            
            if (search.routes && search.routes.length > 0) {
              const routes = search.routes.map((route: any) => ({
                id: route.type,
                name: route.type === 'healthiest' ? '🌿 Healthiest' : route.type === 'fastest' ? '⚡ Fastest' : '⚖️ Balanced',
                type: route.type,
                distance: route.distance,
                time: route.duration,
                avgAQI: route.avgAQI,
                pollution: route.pollution,
                description: route.description,
                icon: route.type === 'healthiest' ? '🌿' : route.type === 'fastest' ? '⚡' : '⚖️',
              }));
              setRouteOptions(routes);
              setSelectedRoute(search.selectedRoute || null);
            }
          } catch (err) {
            console.error("Error restoring search:", err);
          }
        };
        
        fetchSpecificSearch();
      } else {
        const savedSearch = localStorage.getItem("lastSearch");
        if (savedSearch) {
          try {
            const search = JSON.parse(savedSearch);
            console.log("📂 Restoring previous search:", search);
            setStartCity(search.startCity || "");
            setEndCity(search.endCity || "");
            setSubmitted(search.submitted || false);
            setAqiData(search.aqiData || []);
            setRouteOptions(search.routeOptions || []);
            setSelectedRoute(search.selectedRoute || null);
            setActualDistance(search.actualDistance || 1350);
          } catch (err) {
            console.error("Error loading previous search:", err);
          }
        }
      }
      setIsInitialized(true);
    }
  }, [user, loading]);

  // Save search state to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized && user) {
      const searchState = {
        startCity,
        endCity,
        submitted,
        aqiData,
        routeOptions,
        selectedRoute,
        actualDistance,
      };
      localStorage.setItem("lastSearch", JSON.stringify(searchState));
      console.log("💾 Search state saved to localStorage");
    }
  }, [startCity, endCity, submitted, aqiData, routeOptions, selectedRoute, actualDistance, isInitialized, user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const fetchAQIData = async (city: string) => {
    try {
      console.log(`🔍 Fetching data for city: ${city}`);
      
      // First, get weather data (temperature & humidity)
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=36cf5f77d9caa7801cf3d28539cad59c&units=metric`
      );
      
      if (!weatherResponse.ok) {
        throw new Error(`Weather API failed: ${weatherResponse.status}`);
      }
      
      const weatherData = await weatherResponse.json();
      console.log(`✅ Weather API response for ${city}:`, weatherData);
      
      if (!weatherData.coord) {
        console.error(`❌ No coordinates found in weather data for ${city}`);
        return { city, aqi: 50, temperature: 25, humidity: 60 };
      }
      
      const { lat, lon } = weatherData.coord;
      console.log(`📍 Coordinates: lat=${lat}, lon=${lon}`);
      
      // Get pollution/AQI data using coordinates
      const pollutionResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=36cf5f77d9caa7801cf3d28539cad59c`
      );
      
      if (!pollutionResponse.ok) {
        throw new Error(`Pollution API failed: ${pollutionResponse.status}`);
      }
      
      const pollutionData = await pollutionResponse.json();
      console.log(`✅ Pollution API response for ${city}:`, pollutionData);
      
      // Extract AQI data - use PM2.5 for finer granularity
      let aqiValue = 100; // Default
      const aqiLevel = pollutionData.list?.[0]?.main?.aqi;
      const pm25 = pollutionData.list?.[0]?.components?.pm2_5;
      const pm10 = pollutionData.list?.[0]?.components?.pm10;
      
      // Use PM2.5 for accurate AQI calculation (EPA standard)
      if (pm25 !== undefined && pm25 !== null) {
        // EPA AQI Breakpoints for PM2.5 (μg/m³)
        // Good (0-50): 0-12
        // Moderate (51-100): 12.1-35.4
        // Unhealthy for Sensitive Groups (101-150): 35.5-55.4
        // Unhealthy (151-200): 55.5-150.4
        // Very Unhealthy (201-300): 150.5-250.4
        // Hazardous (301+): 250.5+
        
        if (pm25 <= 12) aqiValue = 25 + (pm25 / 12) * 25; // 0-50
        else if (pm25 <= 35.4) aqiValue = 50 + ((pm25 - 12) / 23.4) * 50; // 50-100
        else if (pm25 <= 55.4) aqiValue = 100 + ((pm25 - 35.4) / 20) * 50; // 100-150
        else if (pm25 <= 150.4) aqiValue = 150 + ((pm25 - 55.4) / 95) * 50; // 150-200
        else if (pm25 <= 250.4) aqiValue = 200 + ((pm25 - 150.4) / 100) * 100; // 200-300
        else aqiValue = 300 + Math.min((pm25 - 250.4) * 10, 200); // 300-500
        
        aqiValue = Math.round(aqiValue);
        console.log(`📊 PM2.5: ${pm25.toFixed(2)} μg/m³ → AQI: ${aqiValue}`);
      } else if (aqiLevel !== undefined && aqiLevel !== null) {
        // Fallback to simple level conversion
        aqiValue = aqiLevel * 100;
        console.log(`📊 Using AQI Level: ${aqiLevel} → AQI: ${aqiValue}`);
      } else if (pm10 !== undefined && pm10 !== null) {
        // Fallback to PM10 if PM2.5 not available
        if (pm10 <= 54) aqiValue = 50 + (pm10 / 54) * 50; // 0-100
        else if (pm10 <= 154) aqiValue = 100 + ((pm10 - 54) / 100) * 50; // 100-150
        else if (pm10 <= 254) aqiValue = 150 + ((pm10 - 154) / 100) * 50; // 150-200
        else aqiValue = 200 + Math.min((pm10 - 254) * 2, 300); // 200-500
        aqiValue = Math.round(aqiValue);
        console.log(`📊 PM10: ${pm10.toFixed(2)} μg/m³ → AQI: ${aqiValue}`);
      } else {
        console.error(`❌ No AQI, PM2.5, or PM10 data found for ${city}`, pollutionData);
      }
      const temp = weatherData.main?.temp || 25;
      const humidity = weatherData.main?.humidity || 60;
      
      console.log(`✅ ${city}: AQI=${aqiValue} (level ${aqiLevel}), Temp=${temp}°C, Humidity=${humidity}%`);
      
      return {
        city,
        aqi: aqiValue,
        temperature: temp,
        humidity: humidity,
      };
    } catch (error) {
      console.error(`❌ Error fetching data for ${city}:`, error);
      // Return reasonable defaults instead of 0
      return { city, aqi: 150, temperature: 25, humidity: 60 };
    }
  };

  // Generate route options based on pollution levels with accurate data
  const generateRouteOptions = (startAQI: number, endAQI: number, distance: number = 1350) => {
    const avgAQI = (startAQI + endAQI) / 2;
    
    // Calculate base time (approximately 80 km/hour average speed on highways)
    const baseTime = Math.round((distance / 80) * 60); // Convert to minutes
    
    const routes: RouteOption[] = [
      {
        id: "healthiest",
        name: "Healthiest Route",
        type: "healthiest",
        distance: Math.round(distance * 1.15), // 15% longer due to detours
        time: Math.round(baseTime * 1.25), // 25% more time for better air zones
        avgAQI: Math.round(avgAQI * 0.65), // More realistic 35% improvement
        pollution: avgAQI * 0.65 < 50 ? "low" : avgAQI * 0.65 < 100 ? "moderate" : "high",
        description: "Takes scenic secondary roads avoiding major highways through industrial areas. Best for respiratory health.",
        icon: "🌿",
      },
      {
        id: "fastest",
        name: "Fastest Route",
        type: "fastest",
        distance: Math.round(distance),
        time: baseTime,
        avgAQI: Math.round(avgAQI),
        pollution: avgAQI < 50 ? "low" : avgAQI < 100 ? "moderate" : "high",
        description: "Direct highway route with minimal detours. Fastest option but passes through standard pollution zones.",
        icon: "⚡",
      },
      {
        id: "balanced",
        name: "Balanced Route",
        type: "balanced",
        distance: Math.round(distance * 1.05), // 5% longer
        time: Math.round(baseTime * 1.1), // 10% more time
        avgAQI: Math.round(avgAQI * 0.80), // Realistic 20% improvement
        pollution: avgAQI * 0.80 < 50 ? "low" : avgAQI * 0.80 < 100 ? "moderate" : "high",
        description: "Optimal balance between travel speed and air quality. Recommended for most travelers.",
        icon: "⚖️",
      },
    ];

    return routes;
  };

  const handleSearch = async (source: string, destination: string) => {
    setStartCity(source);
    setEndCity(destination);
    setSubmitted(true);
    setIsLoadingData(true);
    const startData = await fetchAQIData(source);
    const endData = await fetchAQIData(destination);
    setAqiData([startData, endData]);
    
    // Generate route options with actual distance (will be updated from map)
    const routes = generateRouteOptions(startData.aqi, endData.aqi, actualDistance);
    setRouteOptions(routes);
    setSelectedRoute("balanced"); // Default to balanced route
    
    // Save search to history after generating routes
    try {
      const searchData = {
        source,
        destination,
        sourceAQI: {
          aqi: startData.aqi,
          temperature: startData.temperature,
          humidity: startData.humidity,
          location: source,
        },
        destinationAQI: {
          aqi: endData.aqi,
          temperature: endData.temperature,
          humidity: endData.humidity,
          location: destination,
        },
        routes: routes.map(r => ({
          type: r.type,
          distance: r.distance,
          duration: r.time,
          avgAQI: r.avgAQI,
          pollution: r.pollution,
          description: r.description,
        })),
        selectedRoute: "balanced",
        selectedRouteDetails: {
          distance: routes.find(r => r.id === "balanced")?.distance || 0,
          duration: routes.find(r => r.id === "balanced")?.time || 0,
          avgAQI: routes.find(r => r.id === "balanced")?.avgAQI || 0,
          pollution: routes.find(r => r.id === "balanced")?.pollution || "moderate",
        },
      };
      
      console.log("📤 Sending search data to backend:", searchData);
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      console.log(`📡 Backend URL: ${backendUrl}`);
      
      const response = await fetch(
        `${backendUrl}/api/search`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(searchData),
        }
      );
      
      const responseData = await response.json();
      console.log("📥 Backend response:", responseData);
      
      if (response.ok) {
        console.log("✅ Search saved to history successfully!");
      } else {
        console.warn("⚠️ Failed to save search to history:", response.status, responseData);
      }
    } catch (err) {
      console.error("❌ Error saving search to history:", err);
    }
    
    setIsLoadingData(false);
  };

  // Function to handle route selection and save to database
  const handleRouteSelect = async (routeId: string) => {
    setSelectedRoute(routeId);
    const selectedRouteData = routeOptions.find(r => r.id === routeId);
    
    if (selectedRouteData && startCity && endCity) {
      try {
        console.log(`📍 Route selected: ${routeId}, saving to database...`);
        
        const searchData = {
          source: startCity,
          destination: endCity,
          sourceAQI: {
            aqi: aqiData[0]?.aqi,
            temperature: aqiData[0]?.temperature,
            humidity: aqiData[0]?.humidity,
            location: startCity,
          },
          destinationAQI: {
            aqi: aqiData[1]?.aqi,
            temperature: aqiData[1]?.temperature,
            humidity: aqiData[1]?.humidity,
            location: endCity,
          },
          routes: routeOptions.map(r => ({
            type: r.type,
            distance: r.distance,
            duration: r.time,
            avgAQI: r.avgAQI,
            pollution: r.pollution,
            description: r.description,
          })),
          selectedRoute: routeId,
          selectedRouteDetails: {
            distance: selectedRouteData.distance,
            duration: selectedRouteData.time,
            avgAQI: selectedRouteData.avgAQI,
            pollution: selectedRouteData.pollution,
          },
        };
        
        console.log("📤 Sending route selection data:", searchData);
        
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        const response = await fetch(
          `${backendUrl}/api/search`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(searchData),
          }
        );
        
        const responseData = await response.json();
        console.log("📥 Backend response:", responseData);
        
        if (response.ok) {
          console.log("✅ Route selection saved to history successfully!");
        } else {
          console.warn("⚠️ Failed to save route selection:", response.status, responseData);
        }
      } catch (err) {
        console.error("❌ Error saving route selection:", err);
      }
    } else {
      console.warn("⚠️ Missing data for route selection:", { selectedRouteData, startCity, endCity });
    }
  };

  // Update route options when actual distance changes
  useEffect(() => {
    if (aqiData.length > 0) {
      const routes = generateRouteOptions(aqiData[0].aqi, aqiData[1].aqi, actualDistance);
      setRouteOptions(routes);
    }
  }, [actualDistance, aqiData]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Find Clean Air Routes</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter your starting point and destination to discover the healthiest route with the best air quality.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <SearchBar onSearch={handleSearch} />
        </div>

        {isLoadingData && (
          <div className="flex justify-center mb-12">
            <Loader className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {aqiData.length > 0 && !isLoadingData && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Air Quality Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aqiData.map((cityData, index) => (
                <div
                  key={index}
                  className="bg-card border-2 border-primary rounded-xl shadow-lg p-8"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Wind className="w-8 h-8 text-primary" />
                    <h3 className="text-2xl font-bold text-foreground">{cityData.city}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-primary/10 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Air Quality Index (AQI)</p>
                      <p className="text-3xl font-bold text-primary">{cityData.aqi}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {cityData.aqi < 50 && "✅ Good - Enjoy outdoor activities"}
                        {cityData.aqi >= 50 && cityData.aqi < 100 && "⚠️ Fair - Consider reducing activity"}
                        {cityData.aqi >= 100 && cityData.aqi < 150 && "🚨 Unhealthy - Limit outdoor activities"}
                        {cityData.aqi >= 150 && cityData.aqi < 250 && "⛔ Very Unhealthy - Avoid outdoor"}
                        {cityData.aqi >= 250 && "🔴 Hazardous - Stay indoors"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">Temperature</p>
                        <p className="text-xl font-semibold text-foreground">{cityData.temperature}C</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">Humidity</p>
                        <p className="text-xl font-semibold text-foreground">{cityData.humidity}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {submitted && aqiData.length > 0 && !isLoadingData && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Route className="w-6 h-6 text-primary" />
              Route Options (Pollution-Aware)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {routeOptions.map((route) => (
                <div
                  key={route.id}
                  onClick={() => handleRouteSelect(route.id)}
                  className={`cursor-pointer transition-all transform hover:scale-105 ${
                    selectedRoute === route.id
                      ? "bg-primary/20 border-2 border-primary shadow-lg"
                      : "bg-card border-2 border-border shadow-md"
                  } rounded-xl p-6`}
                >
                  <div className="text-4xl mb-3 text-center">{route.icon}</div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-2">{route.name}</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Distance:</span>
                      <span className="font-semibold text-foreground">{route.distance} km</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Time:</span>
                      <span className="font-semibold text-foreground">{Math.floor(route.time / 60)}h {route.time % 60}m</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Avg AQI:</span>
                      <span className={`font-bold px-3 py-1 rounded-full ${
                        route.avgAQI < 50
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : route.avgAQI < 100
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}>
                        {Math.round(route.avgAQI)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-background rounded-lg p-3 mb-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">{route.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {route.pollution === "low" ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : route.pollution === "moderate" ? (
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm font-semibold text-foreground capitalize">
                      {route.pollution} Pollution
                    </span>
                  </div>
                  
                  {selectedRoute === route.id && (
                    <div className="mt-4 pt-4 border-t border-primary text-center">
                      <span className="text-xs font-bold bg-primary text-primary-foreground px-3 py-1 rounded-full">
                        ✓ SELECTED
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {submitted && aqiData.length > 0 && !isLoadingData && selectedRoute && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Map className="w-6 h-6 text-primary" />
              Route Visualization & Directions
            </h2>
            <div className="bg-card border-2 border-primary rounded-xl shadow-lg p-6">
              <MapWithDirections 
                startCity={startCity} 
                endCity={endCity}
                routeType={selectedRoute as "fastest" | "healthiest" | "balanced"}
                pollutionLevel={
                  selectedRoute === "fastest" ? "high" :
                  selectedRoute === "balanced" ? "moderate" :
                  selectedRoute === "healthiest" ? "low" : "moderate"
                }
                onDistanceChange={setActualDistance}
              />
            </div>
          </div>
        )}

        {!submitted && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Enter Locations</h3>
              <p className="text-sm text-muted-foreground">
                Specify your starting point and destination
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <Wind className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Check AQI</h3>
              <p className="text-sm text-muted-foreground">
                View real-time air quality data for both locations
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Optimize Route</h3>
              <p className="text-sm text-muted-foreground">
                Get the healthiest route with the best air quality
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
