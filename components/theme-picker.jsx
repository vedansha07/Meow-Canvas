"use client"

import { Button } from "@/components/ui/button"

export default function ThemePicker({ currentTheme, onSelectTheme }) {
  const themes = [
    { id: "default", name: "Default", color: "bg-white" },
    { id: "beach", name: "Beach", color: "bg-amber-50" },
    { id: "mountains", name: "Mountains", color: "bg-blue-50" },
    { id: "sunset", name: "Sunset", color: "bg-orange-50" },
    { id: "forest", name: "Forest", color: "bg-green-50" },
  ]

  return (
    <div className="flex gap-2">
      {themes.map((theme) => (
        <Button
          key={theme.id}
          variant={currentTheme === theme.id ? "default" : "outline"}
          className="flex flex-col items-center"
          onClick={() => onSelectTheme(theme)}
        >
          <div className={`w-6 h-6 rounded-full ${theme.color} border mb-1`}></div>
          {theme.name}
        </Button>
      ))}
    </div>
  )
}
