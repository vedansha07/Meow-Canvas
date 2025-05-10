"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StickerPicker({ onSelectSticker }) {
  // Travel-themed stickers
  const travelStickers = [
    { id: "travel-1", src: "/placeholder.svg?height=50&width=50", alt: "Airplane" },
    { id: "travel-2", src: "/placeholder.svg?height=50&width=50", alt: "Camera" },
    { id: "travel-3", src: "/placeholder.svg?height=50&width=50", alt: "Suitcase" },
    { id: "travel-4", src: "/placeholder.svg?height=50&width=50", alt: "Map" },
    { id: "travel-5", src: "/placeholder.svg?height=50&width=50", alt: "Compass" },
    { id: "travel-6", src: "/placeholder.svg?height=50&width=50", alt: "Passport" },
  ]

  const decorativeStickers = [
    { id: "decorative-1", src: "/placeholder.svg?height=50&width=50", alt: "Star" },
    { id: "decorative-2", src: "/placeholder.svg?height=50&width=50", alt: "Heart" },
    { id: "decorative-3", src: "/placeholder.svg?height=50&width=50", alt: "Flower" },
    { id: "decorative-4", src: "/placeholder.svg?height=50&width=50", alt: "Sun" },
    { id: "decorative-5", src: "/placeholder.svg?height=50&width=50", alt: "Cloud" },
    { id: "decorative-6", src: "/placeholder.svg?height=50&width=50", alt: "Rainbow" },
  ]

  const emojiStickers = [
    {
      id: "emoji-1",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cool.jpg-88FtoLhhUBlNcU5rFDGCBmXN6v13vf.jpeg",
      alt: "Cool Emoji",
    },
    {
      id: "emoji-2",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/laugh.jpg-dZRCuS6CVdBlQO9HO1yi7tTD7dhIiz.jpeg",
      alt: "Laughing Emoji",
    },
    {
      id: "emoji-3",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wow.jpg-thSjmEiXTx7vFLV4opUvLOk3B3n25j.png",
      alt: "Wow Emoji",
    },
    {
      id: "emoji-4",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/love.jpg-wWO0SznjgEKvqJqti8G2ajhlB70JCo.jpeg",
      alt: "Love Emoji",
    },
    {
      id: "emoji-5",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sad.jpg-2CRuEURj29bgf3u6famlbwRIZn2vjv.jpeg",
      alt: "Sad Emoji",
    },
    {
      id: "emoji-6",
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/smile.jpg-9KVEDzDIlkvHcJ4NXOEaumHuQb7U0c.png",
      alt: "Smile Emoji",
    },
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
                <img src={sticker.src || "/placeholder.svg"} alt={sticker.alt} className="w-full h-auto" />
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
                <img src={sticker.src || "/placeholder.svg"} alt={sticker.alt} className="w-full h-auto" />
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
                <img src={sticker.src || "/placeholder.svg"} alt={sticker.alt} className="w-full h-auto" />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
