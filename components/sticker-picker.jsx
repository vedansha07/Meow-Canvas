"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StickerPicker({ onSelectSticker }) {
  const travelStickers = [
    { id: "travel-1", src: "/travelstickers/Airplane.jpg", alt: "Airplane" },
    { id: "travel-2", src: "/travelstickers/Camera.jpg", alt: "Camera" },
    { id: "travel-3", src: "/travelstickers/Suitcase.jpeg", alt: "Suitcase" },
    { id: "travel-4", src: "/travelstickers/Map.jpg", alt: "Map" },
    { id: "travel-5", src: "/travelstickers/Compass.jpg", alt: "Compass" },
    { id: "travel-6", src: "/travelstickers/Passport.jpg", alt: "Passport" },
  ]

  const decorativeStickers = [
    { id: "decorative-1", src: "/decorativestickers/star.jpg", alt: "Star" },
    { id: "decorative-2", src: "/decorativestickers/heart.jpg", alt: "Heart" },
    { id: "decorative-3", src: "/decorativestickers/flower.jpg", alt: "Flower" },
    { id: "decorative-4", src: "/decorativestickers/sun.jpg", alt: "Sun" },
    { id: "decorative-5", src: "/decorativestickers/cloud.jpg", alt: "Cloud" },
    { id: "decorative-6", src: "/decorativestickers/rainbow.jpg", alt: "Rainbow" },
  ]

  const emojiStickers = [
    { id: "emoji-1", src: "/emojistickers/cool.jpg", alt: "Cool Emoji" },
    { id: "emoji-2", src: "/emojistickers/laugh.jpg", alt: "Laughing Emoji" },
    { id: "emoji-3", src: "/emojistickers/wow.jpg", alt: "Wow Emoji" },
    { id: "emoji-4", src: "/emojistickers/love.jpg", alt: "Love Emoji" },
    { id: "emoji-5", src: "/emojistickers/sad.jpg", alt: "Sad Emoji" },
    { id: "emoji-6", src: "/emojistickers/smile.jpg", alt: "Smile Emoji" },
  ]

  return (
    <div className="p-2">
      <h3 className="font-medium mb-2">Select a Sticker</h3>
      <Tabs defaultValue="emoji">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="travel">Travel</TabsTrigger>
          <TabsTrigger value="decorative">Decorative</TabsTrigger>
          <TabsTrigger value="emoji">Emoji</TabsTrigger>
        </TabsList>

        <TabsContent value="travel" className="mt-2">
          <div className="grid grid-cols-3 gap-2">
            {travelStickers.map((sticker) => (
              <div
                key={sticker.id}
                className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => onSelectSticker(sticker)}
              >
                <img
                  src={sticker.src || "/placeholder.svg"}
                  alt={sticker.alt}
                  className="w-12 h-12 object-contain mx-auto"
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="decorative" className="mt-2">
          <div className="grid grid-cols-3 gap-2">
            {decorativeStickers.map((sticker) => (
              <div
                key={sticker.id}
                className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => onSelectSticker(sticker)}
              >
                <img
                  src={sticker.src || "/placeholder.svg"}
                  alt={sticker.alt}
                  className="w-12 h-12 object-contain mx-auto"
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="emoji" className="mt-2">
          <div className="grid grid-cols-3 gap-2">
            {emojiStickers.map((sticker) => (
              <div
                key={sticker.id}
                className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => onSelectSticker(sticker)}
              >
                <img
                  src={sticker.src || "/placeholder.svg"}
                  alt={sticker.alt}
                  className="w-12 h-12 object-contain mx-auto"
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
