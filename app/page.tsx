import { Wind, Route, Heart, TrendingDown, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Wind className="w-4 h-4" />
              <span>Breathe Better, Travel Smarter</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Smarter Routes with Clean Air
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              Navigate your city with real-time air quality data. Find the fastest and healthiest routes for your
              journey.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">Routes Analyzed</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">97%</div>
              <div className="text-sm text-muted-foreground">Cleaner Air Routes</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Real-time Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose AIRHOP?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              More than just navigation - we help you breathe easier while you travel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 text-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Wind className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Real-time AQI Data</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Access live air quality index data from multiple monitoring stations across your city.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 text-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Route className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Smart Route Planning</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get multiple route options optimized for speed, distance, and air quality.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 text-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Health-First Approach</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Prioritize your respiratory health with routes that avoid high pollution areas.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 text-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <TrendingDown className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Reduce Exposure</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Minimize your exposure to harmful pollutants with our intelligent routing algorithm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Breathe Easier?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of users who are already taking control of their air quality exposure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-4 bg-background text-foreground rounded-lg font-semibold hover:bg-secondary transition-colors inline-flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border-2 border-primary-foreground rounded-lg font-semibold hover:bg-primary-foreground/10 transition-colors"
            >
              Sign In
            </Link>
          </div>
          <p className="text-sm mt-6 opacity-75">No credit card required. Start planning cleaner routes today.</p>
        </div>
      </section>
    </div>
  )
}
