import { Wind, MapPin, Heart, TrendingDown, Code, Leaf } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground p-4 rounded-2xl mb-6">
            <Wind className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">About AIRHOP</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're on a mission to help people breathe easier by providing intelligent route planning based on real-time
            air quality data.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-card border border-border rounded-xl p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
            AIRHOP combines cutting-edge mapping technology with real-time air quality monitoring to help you make
            informed decisions about your daily routes. We believe everyone deserves to breathe clean air, and we're
            committed to making that easier through smart technology.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="bg-primary/10 text-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Real-time Mapping</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Interactive maps with live air quality data from monitoring stations across your city.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="bg-primary/10 text-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Wind className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">AQI Monitoring</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Comprehensive air quality index tracking with detailed pollution level breakdowns.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="bg-primary/10 text-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Save Favorites</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bookmark your frequently used routes and track your air quality exposure over time.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="bg-primary/10 text-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <TrendingDown className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Smart Routing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Intelligent algorithms that balance speed, distance, and air quality for optimal routes.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="bg-primary/10 text-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Export Routes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Download and share your routes with friends or import them into your favorite navigation apps.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="bg-primary/10 text-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Open API</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Developer-friendly API for integrating air quality data into your own applications.
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-card border border-border rounded-xl p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Built With Modern Technology</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-muted rounded-lg p-6 mb-3">
                <p className="font-semibold text-foreground">Next.js</p>
              </div>
              <p className="text-sm text-muted-foreground">React Framework</p>
            </div>
            <div className="text-center">
              <div className="bg-muted rounded-lg p-6 mb-3">
                <p className="font-semibold text-foreground">TailwindCSS</p>
              </div>
              <p className="text-sm text-muted-foreground">Styling</p>
            </div>
            <div className="text-center">
              <div className="bg-muted rounded-lg p-6 mb-3">
                <p className="font-semibold text-foreground">Leaflet</p>
              </div>
              <p className="text-sm text-muted-foreground">Mapping</p>
            </div>
            <div className="text-center">
              <div className="bg-muted rounded-lg p-6 mb-3">
                <p className="font-semibold text-foreground">AQI APIs</p>
              </div>
              <p className="text-sm text-muted-foreground">Data Source</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            We're always looking for passionate individuals who want to make a difference in public health and
            environmental awareness.
          </p>
          <button className="px-8 py-3 bg-background text-foreground rounded-lg font-semibold hover:bg-secondary transition-colors">
            Get In Touch
          </button>
        </div>
      </div>
    </div>
  )
}
