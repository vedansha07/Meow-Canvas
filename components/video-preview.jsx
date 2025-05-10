"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Player } from "@remotion/player"
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion"

// Animation component for each item
const AnimatedItem = ({ item, index }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Stagger the animations
  const delay = index * 5
  const entryFrame = delay

  // Calculate spring animation
  const opacity = spring({
    frame: frame - entryFrame,
    fps,
    config: { damping: 15 },
  })

  const scale = spring({
    frame: frame - entryFrame,
    fps,
    from: 0.5,
    to: 1,
    config: { damping: 15 },
  })

  const y = spring({
    frame: frame - entryFrame,
    fps,
    from: 50,
    to: 0,
    config: { damping: 15 },
  })

  // Don't render before entry frame
  if (frame < entryFrame) return null

  return (
    <div
      style={{
        position: "absolute",
        left: `${item.position.x}px`,
        top: `${item.position.y}px`,
        width: `${item.size.width}px`,
        height: `${item.size.height}px`,
        opacity,
        transform: `scale(${scale}) translateY(${y}px) rotate(${item.rotation || 0}deg)`,
        zIndex: item.zIndex,
      }}
    >
      {item.type === "image" && (
        <img
          src={item.content || "/placeholder.svg"}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}

      {item.type === "text" && (
        <div
          style={{
            width: "100%",
            height: "100%",
            padding: "8px",
            ...item.style,
          }}
        >
          {item.content}
        </div>
      )}

      {item.type === "sticker" && (
        <img
          src={item.content || "/placeholder.svg"}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      )}
    </div>
  )
}

// Main composition
const TravelStoryComposition = ({ items }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "white" }}>
      {items.map((item, index) => (
        <AnimatedItem key={item.id} item={item} index={index} />
      ))}
    </AbsoluteFill>
  )
}

export default function VideoPreview({ items, onClose }) {
  const [isOpen, setIsOpen] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [videoUrl, setVideoUrl] = useState(null)
  const { toast } = useToast()

  const handleClose = () => {
    setIsOpen(false)
    onClose()
  }

  const generateVideo = async () => {
    setIsGenerating(true)

    // In a real implementation, you would use Remotion's server-side rendering
    // to generate the actual video. For this demo, we'll simulate the process.

    setTimeout(() => {
      setIsGenerating(false)
      setVideoUrl("/placeholder.svg?height=400&width=600")

      toast({
        title: "Video generated!",
        description: "Your travel story video has been created.",
      })
    }, 3000)
  }

  const downloadVideo = () => {
    // In a real implementation, this would download the actual video file
    toast({
      title: "Video downloaded",
      description: "Your travel story video has been downloaded.",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Travel Story Video Preview</DialogTitle>
        </DialogHeader>

        <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
          {videoUrl ? (
            <img src={videoUrl || "/placeholder.svg"} alt="Video preview" className="w-full h-full object-cover" />
          ) : (
            <Player
              component={TravelStoryComposition}
              durationInFrames={120}
              fps={30}
              compositionWidth={800}
              compositionHeight={450}
              style={{ width: "100%", height: "100%" }}
              controls
              loop
              autoPlay
              inputProps={{ items }}
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>

          {!videoUrl ? (
            <Button onClick={generateVideo} disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate Video"}
            </Button>
          ) : (
            <Button onClick={downloadVideo}>Download Video</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
