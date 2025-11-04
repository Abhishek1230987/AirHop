"use client"

import { useState } from "react"
import { Heart, MapPin, Calendar, Wind, Trash2, Navigation } from "lucide-react"
import Link from "next/link"

interface SavedRoute {
  id: number
  title: string
  from: string
  to: string
  distance: string
  duration: string
  aqi: number
  date: string
  isFavorite: boolean
}

const mockRoutes: SavedRoute[] = [
  {
    id: 1,
    title: "Morning Commute",
    from: "Home",
    to: "Office",
    distance: "5.2 km",
    duration: "18 min",
    aqi: 42,
    date: "2025-01-08",
    isFavorite: true,
  },
  {
    id: 2,
    title: "Park Route",
    from: "Downtown",
    to: "Central Park",
    distance: "3.8 km",
    duration: "12 min",
    aqi: 35,
    date: "2025-01-07",
    isFavorite: true,
  },
  {
    id: 3,
    title: "Evening Jog",
    from: "Apartment",
    to: "Riverside Trail",
    distance: "4.5 km",
    duration: "15 min",
    aqi: 48,
    date: "2025-01-06",
    isFavorite: false,
  },
  {
    id: 4,
    title: "Weekend Shopping",
    from: "Home",
    to: "Mall",
    distance: "7.1 km",
    duration: "22 min",
    aqi: 65,
    date: "2025-01-05",
    isFavorite: false,
  },
]

const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return "text-success"
  if (aqi <= 100) return "text-warning"
  return "text-destructive"
}

const getAQIBgColor = (aqi: number) => {
  if (aqi <= 50) return "bg-success/10"
  if (aqi <= 100) return "bg-warning/10"
  return "bg-destructive/10"
}

const getAQILabel = (aqi: number) => {
  if (aqi <= 50) return "Good"
  if (aqi <= 100) return "Moderate"
  return "Unhealthy"
}

export default function FavoritesPage() {
  const [routes, setRoutes] = useState<SavedRoute[]>(mockRoutes)
  const [filter, setFilter] = useState<"all" | "favorites">("all")

  const toggleFavorite = (id: number) => {
    setRoutes(routes.map((route) => (route.id === id ? { ...route, isFavorite: !route.isFavorite } : route)))
  }

  const removeRoute = (id: number) => {
    setRoutes(routes.filter((route) => route.id !== id))
  }

  const filteredRoutes = filter === "favorites" ? routes.filter((route) => route.isFavorite) : routes

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Saved Routes</h1>
          <p className="text-muted-foreground">Manage your favorite routes and travel history</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            All Routes ({routes.length})
          </button>
          <button
            onClick={() => setFilter("favorites")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              filter === "favorites"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className="w-4 h-4" />
            Favorites ({routes.filter((r) => r.isFavorite).length})
          </button>
        </div>

        {/* Routes Grid */}
        {filteredRoutes.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No routes found</h3>
            <p className="text-muted-foreground mb-6">Start searching for routes and save your favorites!</p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-secondary transition-colors"
            >
              <Navigation className="w-5 h-5" />
              Search Routes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRoutes.map((route) => (
              <div
                key={route.id}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{route.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(route.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(route.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      route.isFavorite ? "text-destructive bg-destructive/10" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${route.isFavorite ? "fill-current" : ""}`} />
                  </button>
                </div>

                {/* Route Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-foreground font-medium">{route.from}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-foreground font-medium">{route.to}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{route.distance}</span>
                    <span>•</span>
                    <span>{route.duration}</span>
                  </div>
                </div>

                {/* AQI Badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${getAQIBgColor(route.aqi)} mb-4`}>
                  <Wind className={`w-4 h-4 ${getAQIColor(route.aqi)}`} />
                  <span className={`text-sm font-semibold ${getAQIColor(route.aqi)}`}>
                    AQI {route.aqi} - {getAQILabel(route.aqi)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-border">
                  <Link
                    href="/search"
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-secondary transition-colors text-center"
                  >
                    Re-run Route
                  </Link>
                  <button
                    onClick={() => removeRoute(route.id)}
                    className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {filteredRoutes.length > 0 && (
          <div className="mt-8 bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Your Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {Math.round(filteredRoutes.reduce((acc, route) => acc + Number.parseFloat(route.distance), 0))} km
                </div>
                <div className="text-sm text-muted-foreground">Total Distance Traveled</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {Math.round(
                    filteredRoutes.reduce((acc, route) => acc + Number.parseFloat(route.duration), 0) /
                      filteredRoutes.length,
                  )}{" "}
                  min
                </div>
                <div className="text-sm text-muted-foreground">Average Trip Duration</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {Math.round(filteredRoutes.reduce((acc, route) => acc + route.aqi, 0) / filteredRoutes.length)}
                </div>
                <div className="text-sm text-muted-foreground">Average AQI Exposure</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
