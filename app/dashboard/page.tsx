"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { Wind, Map, History, TrendingDown, ArrowRight } from "lucide-react"
import Link from "next/link"
import SearchBar from "@/components/search-bar"

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <Wind className="w-6 h-6 text-primary animate-spin" />
          </div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Welcome Section */}
      <section className="py-12 px-4 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Welcome, {user.email}! </h1>
              <p className="text-lg text-muted-foreground">Find clean air routes and plan your healthier journey</p>
            </div>
            <div className="bg-primary/10 text-primary p-4 rounded-xl">
              <Wind className="w-8 h-8" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Link
              href="/search"
              className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-primary/10 text-primary p-3 rounded-lg group-hover:scale-110 transition-transform">
                  <Map className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Find Routes</h3>
              <p className="text-sm text-muted-foreground">Search for routes with the best air quality</p>
            </Link>

            {/* Search History */}
            <Link
              href="/search-history"
              className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-primary/10 text-primary p-3 rounded-lg group-hover:scale-110 transition-transform">
                  <History className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">View History</h3>
              <p className="text-sm text-muted-foreground">Check your previous searches and saved routes</p>
            </Link>

            {/* AQI Information */}
            <Link
              href="/information"
              className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-primary/10 text-primary p-3 rounded-lg group-hover:scale-110 transition-transform">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">AQI Information</h3>
              <p className="text-sm text-muted-foreground">Learn about air quality index and health impacts</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6">Why AIRHOP?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3"> Real-time Data</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Access live air quality index data from monitoring stations across your city to make informed
                decisions about your travel routes.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3"> Smart Routes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get multiple route options optimized for speed, distance, and air quality to find the healthiest path
                to your destination.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3"> Health First</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Breathe easier knowing you're choosing routes that prioritize your health and minimize pollution
                exposure.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3"> Track History</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Keep track of all your searches and favorite routes. Your search history is saved for quick access to
                frequently traveled paths.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-autobg-gradient-to-r  from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Find Clean Air Routes?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Start searching for the healthiest routes in your area. Your journey to cleaner air begins here.
          </p>
          <Link
            href="/search"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Search Now →
          </Link>
        </div>
      </section>
    </div>
  )
}
