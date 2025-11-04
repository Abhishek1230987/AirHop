"use client"

import { useState } from "react"
import { Lightbulb, TrendingDown, Sun, Cloud, Wind, ChevronLeft, ChevronRight } from "lucide-react"
import AQIIndicator from "@/components/aqi-indicator"

const facts = [
  {
    id: 1,
    title: "Morning Air Quality",
    description: "Air quality is typically best in the early morning hours between 6-8 AM when traffic is lighter.",
    icon: Sun,
  },
  {
    id: 2,
    title: "Green Routes",
    description: "Routes with more trees and vegetation can have up to 25% better air quality than busy highways.",
    icon: TrendingDown,
  },
  {
    id: 3,
    title: "Weather Impact",
    description: "Rain and wind help disperse pollutants, often improving air quality within hours.",
    icon: Cloud,
  },
  {
    id: 4,
    title: "Peak Pollution Hours",
    description: "Rush hours (7-9 AM and 5-7 PM) typically have the highest pollution levels in urban areas.",
    icon: Wind,
  },
]

const tips = [
  "Plan your outdoor activities during times when air quality is better",
  "Choose routes through parks and green spaces when possible",
  "Avoid exercising near busy roads during rush hour",
  "Check AQI levels before planning your daily commute",
  "Use air quality apps to stay informed about real-time conditions",
  "Consider alternative transportation during high pollution days",
]

export default function InformationPage() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0)

  const nextFact = () => {
    setCurrentFactIndex((prev) => (prev + 1) % facts.length)
  }

  const prevFact = () => {
    setCurrentFactIndex((prev) => (prev - 1 + facts.length) % facts.length)
  }

  const currentFact = facts[currentFactIndex]
  const FactIcon = currentFact.icon

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Air Quality Information</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn about air quality, its impact on your health, and how to make smarter travel decisions.
          </p>
        </div>

        {/* Did You Know Carousel */}
        <div className="bg-card border border-border rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-primary" />
            Did You Know?
          </h2>
          <div className="relative">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-primary/10 text-primary w-20 h-20 rounded-full flex items-center justify-center">
                <FactIcon className="w-10 h-10" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground text-center mb-4">{currentFact.title}</h3>
            <p className="text-muted-foreground text-center leading-relaxed mb-6">{currentFact.description}</p>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={prevFact}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Previous fact"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex gap-2">
                {facts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFactIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentFactIndex ? "bg-primary w-8" : "bg-muted"
                    }`}
                    aria-label={`Go to fact ${index + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={nextFact}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Next fact"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Understanding AQI Levels</h2>

          {/* AQI Indicator Component */}
          <AQIIndicator />

          {/* Detailed Descriptions */}
          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-4 p-4 bg-success/10 dark:bg-success/20 rounded-lg">
              <div className="w-16 h-16 bg-success text-success-foreground rounded-lg flex items-center justify-center font-bold">
                0-50
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Good</h3>
                <p className="text-sm text-muted-foreground">
                  Air quality is satisfactory, and air pollution poses little or no risk.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-warning/10 dark:bg-warning/20 rounded-lg">
              <div className="w-16 h-16 bg-warning text-warning-foreground rounded-lg flex items-center justify-center font-bold">
                51-100
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Moderate</h3>
                <p className="text-sm text-muted-foreground">
                  Air quality is acceptable. However, there may be a risk for some people, particularly those who are
                  unusually sensitive to air pollution.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-destructive/10 dark:bg-destructive/20 rounded-lg">
              <div className="w-16 h-16 bg-destructive text-destructive-foreground rounded-lg flex items-center justify-center font-bold">
                101+
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Unhealthy</h3>
                <p className="text-sm text-muted-foreground">
                  Members of sensitive groups may experience health effects. The general public is less likely to be
                  affected.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-card border border-border rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Tips for Cleaner Air Travel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-sm text-foreground leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fun Facts Counters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">2.5x</div>
            <p className="text-sm text-muted-foreground">
              Pollution levels can be 2.5 times higher inside cars during rush hour
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">30%</div>
            <p className="text-sm text-muted-foreground">
              Walking through parks can reduce pollution exposure by up to 30%
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">7M</div>
            <p className="text-sm text-muted-foreground">
              7 million premature deaths annually are linked to air pollution worldwide
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
