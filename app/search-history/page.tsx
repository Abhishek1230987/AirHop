'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-context'
import { useRouter } from 'next/navigation'
import { Trash2, MapPin, Navigation, Calendar, Loader, Wind, TrendingUp, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface RouteDetail {
  type: string
  distance: number
  duration: number
  avgAQI: number
  pollution: string
  description: string
}

interface SearchRecord {
  _id: string
  source: string
  destination: string
  sourceAQI?: { aqi: number; temperature?: number; humidity?: number }
  destinationAQI?: { aqi: number; temperature?: number; humidity?: number }
  routes?: RouteDetail[]
  selectedRoute?: string
  selectedRouteDetails?: {
    distance: number
    duration: number
    avgAQI: number
    pollution: string
  }
  routeDistance?: number
  routeDuration?: number
  notes?: string
  createdAt: string
}

export default function SearchHistoryPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [searches, setSearches] = useState<SearchRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/search-history')
    }
  }, [authLoading, user, router])

  // Fetch search history
  useEffect(() => {
    if (!user) return

    const fetchHistory = async () => {
      try {
        console.log("📥 [SearchHistory] Fetching history for user:", user?.email);
        
        const response = await fetch('/api/search', {
          credentials: 'include',
        })

        console.log("📡 [SearchHistory] Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("❌ [SearchHistory] API error:", response.status, errorData);
          throw new Error(`Failed to fetch search history: ${response.status}`)
        }

        const data = await response.json();
        console.log("✅ [SearchHistory] Got data:", {
          searchCount: data.searches?.length,
          total: data.total,
          searches: data.searches
        });
        
        setSearches(data.searches || []);
        
        if (!data.searches || data.searches.length === 0) {
          console.warn("⚠️ [SearchHistory] No searches returned from API");
        }
      } catch (err) {
        console.error('❌ [SearchHistory] Error fetching search history:', err);
        toast({
          title: 'Error',
          description: 'Failed to load search history',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [user, toast])

  const handleDeleteSearch = async (searchId: string) => {
    setIsDeletingId(searchId)
    try {
      const response = await fetch(`/api/search/${searchId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete search')
      }

      setSearches(searches.filter((s) => s._id !== searchId))
      toast({
        title: 'Deleted',
        description: 'Search has been removed from history',
      })
    } catch (err) {
      console.error('Error deleting search:', err)
      toast({
        title: 'Error',
        description: 'Failed to delete search',
        variant: 'destructive',
      })
    } finally {
      setIsDeletingId(null)
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete all search history?')) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/search', {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete all searches')
      }

      setSearches([])
      toast({
        title: 'Cleared',
        description: 'All search history has been deleted',
      })
    } catch (err) {
      console.error('Error deleting all searches:', err)
      toast({
        title: 'Error',
        description: 'Failed to clear search history',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading search history...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Search History</h1>
          <p className="text-muted-foreground">
            View and manage all your past route searches
          </p>
        </div>

        {/* Controls */}
        {searches.length > 0 && (
          <div className="mb-6 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {searches.length} search{searches.length !== 1 ? 'es' : ''} found
            </div>
            <button
              onClick={handleDeleteAll}
              disabled={isLoading}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear All History
            </button>
          </div>
        )}

        {/* Search History List */}
        {searches.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No search history yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Start searching for routes with clean air and your searches will appear here
            </p>
            <a
              href="/"
              className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Search Routes
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {searches.map((search) => (
              <div
                key={search._id}
                className="bg-card border-2 border-primary rounded-xl p-8 hover:shadow-lg transition-shadow"
              >
                {/* Header with Route Details */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="pt-1">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-bold text-foreground">
                          {search.source}
                        </div>
                        <div className="flex items-center justify-center gap-2 my-3 text-muted-foreground">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <Navigation className="w-5 h-5 text-primary rotate-45" />
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                        <div className="text-lg font-bold text-foreground">
                          {search.destination}
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteSearch(search._id)}
                      disabled={isDeletingId === search._id}
                      className="px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isDeletingId === search._id ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>

                {/* Search Date and Time */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
                  <Calendar className="w-4 h-4" />
                  {new Date(search.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>

                {/* Air Quality Information */}
                {search.sourceAQI && search.destinationAQI && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Wind className="w-4 h-4" /> Air Quality at Search Time
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Source AQI */}
                      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                        <div className="text-sm text-muted-foreground mb-1">{search.source}</div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">AQI:</span>
                            <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                              search.sourceAQI.aqi < 50
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : search.sourceAQI.aqi < 100
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}>
                              {search.sourceAQI.aqi}
                            </span>
                          </div>
                          {search.sourceAQI.temperature !== undefined && (
                            <div className="flex justify-between items-center text-sm">
                              <span>Temp:</span>
                              <span className="font-medium">{search.sourceAQI.temperature}°C</span>
                            </div>
                          )}
                          {search.sourceAQI.humidity !== undefined && (
                            <div className="flex justify-between items-center text-sm">
                              <span>Humidity:</span>
                              <span className="font-medium">{search.sourceAQI.humidity}%</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Destination AQI */}
                      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                        <div className="text-sm text-muted-foreground mb-1">{search.destination}</div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">AQI:</span>
                            <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                              search.destinationAQI.aqi < 50
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : search.destinationAQI.aqi < 100
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}>
                              {search.destinationAQI.aqi}
                            </span>
                          </div>
                          {search.destinationAQI.temperature !== undefined && (
                            <div className="flex justify-between items-center text-sm">
                              <span>Temp:</span>
                              <span className="font-medium">{search.destinationAQI.temperature}°C</span>
                            </div>
                          )}
                          {search.destinationAQI.humidity !== undefined && (
                            <div className="flex justify-between items-center text-sm">
                              <span>Humidity:</span>
                              <span className="font-medium">{search.destinationAQI.humidity}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Route Options */}
                {search.routes && search.routes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> Route Options
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {search.routes.map((route, idx) => (
                        <div
                          key={idx}
                          className={`rounded-lg p-4 border-2 transition-all ${
                            search.selectedRoute === route.type
                              ? "border-primary bg-primary/10"
                              : "border-border bg-background"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-semibold text-foreground capitalize">
                                {route.type === 'healthiest' ? '🌿 Healthiest' : route.type === 'fastest' ? '⚡ Fastest' : '⚖️ Balanced'}
                              </div>
                              {search.selectedRoute === route.type && (
                                <span className="text-xs font-bold text-primary">✓ SELECTED</span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Distance:</span>
                              <span className="font-medium">{route.distance} km</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Time:</span>
                              <span className="font-medium">{Math.floor(route.duration / 60)}h {route.duration % 60}m</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Avg AQI:</span>
                              <span className={`font-bold px-2 py-1 rounded text-xs ${
                                route.avgAQI < 50
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : route.avgAQI < 100
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }`}>
                                {Math.round(route.avgAQI)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 pt-2 border-t border-border">
                              {route.pollution === "low" ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : route.pollution === "moderate" ? (
                                <AlertCircle className="w-4 h-4 text-yellow-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              )}
                              <span className="text-xs font-semibold text-foreground capitalize">
                                {route.pollution} Pollution
                              </span>
                            </div>
                          </div>

                          {route.description && (
                            <div className="mt-3 p-3 bg-background rounded border border-border text-xs text-muted-foreground leading-relaxed">
                              {route.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Route Details Summary */}
                {search.selectedRouteDetails && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Selected Route Summary
                    </h4>
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Distance</div>
                          <div className="font-bold text-foreground">{search.selectedRouteDetails.distance} km</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Time</div>
                          <div className="font-bold text-foreground">
                            {Math.floor(search.selectedRouteDetails.duration / 60)}h {search.selectedRouteDetails.duration % 60}m
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Avg AQI</div>
                          <div className={`font-bold px-3 py-1 rounded-full text-center ${
                            search.selectedRouteDetails.avgAQI < 50
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : search.selectedRouteDetails.avgAQI < 100
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}>
                            {Math.round(search.selectedRouteDetails.avgAQI)}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Pollution Level</div>
                          <div className="font-bold text-foreground capitalize">{search.selectedRouteDetails.pollution}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
