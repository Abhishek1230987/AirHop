"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Navigation, Search } from "lucide-react"
import { useAuth } from "./auth-context"
import { useToast } from "@/hooks/use-toast"

interface SearchBarProps {
  onSearch?: (source: string, destination: string) => void
  className?: string
}

export default function SearchBar({ onSearch, className = "" }: SearchBarProps) {
  const [source, setSource] = useState("")
  const [destination, setDestination] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!source || !destination) return

    setIsLoading(true)

    // Call the callback first
    onSearch?.(source, destination)

    // If user is authenticated, save to search history
    if (user?.id) {
      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            source,
            destination,
          }),
        })

        if (!response.ok) {
          console.error("Failed to save search to history")
        } else {
          const data = await response.json()
          console.log("Search saved to history:", data.search._id)
          toast({
            title: "Search saved",
            description: "Your search has been added to history",
          })
        }
      } catch (err) {
        console.error("Error saving search:", err)
      }
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className={`bg-card border border-border rounded-xl shadow-lg p-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Source Input */}
        <div className="relative">
          <label htmlFor="source" className="block text-sm font-medium text-foreground mb-2">
            Starting Point
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <input
              type="text"
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Enter your location"
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Destination Input */}
        <div className="relative">
          <label htmlFor="destination" className="block text-sm font-medium text-foreground mb-2">
            Destination
          </label>
          <div className="relative">
            <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where are you going?"
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 text-black dark:text-white border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        disabled={!source || !destination || isLoading}
        className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Search className="w-5 h-5" />
        {isLoading ? "Saving..." : "Find Clean Routes"}
      </button>
    </form>
  )
}
