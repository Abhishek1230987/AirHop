import type React from "react"
import type { Metadata } from "next"
import "leaflet/dist/leaflet.css";
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { AuthProvider } from "@/components/auth-context"


export const metadata: Metadata = {
  title: "AIRHOP - Smarter Routes with Clean Air",
  description:
    "Find the healthiest routes with real-time air quality data. Navigate your city with pollution-aware route planning.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
