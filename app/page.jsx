import '../styles/globals.css';

import { Suspense } from "react"
import TravelCanvas from "@/components/travel-canvas"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">TravelStory</h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Create your own travel journal by adding images, text, and stickers to the canvas below.
        </p>
        <Suspense fallback={<div className="h-[600px] w-full bg-gray-100 animate-pulse rounded-lg"></div>}>
          <TravelCanvas />
        </Suspense>
      </div>
      <Toaster />
    </main>
  )
}
