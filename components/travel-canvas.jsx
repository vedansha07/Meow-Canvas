"use client"

import { useState, useRef, useEffect } from "react"
import { Rnd } from "react-rnd"
import { PDFDocument } from "pdf-lib"
import { toPng } from "html-to-image"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Type, FileText, Video, Sticker, ImageIcon, Trash, Eraser } from "lucide-react"
import TextEditor from "./text-editor"
import ImageUploader from "./image-uploader"
import StickerPicker from "./sticker-picker"
import ThemePicker from "./theme-picker"
import VideoPreview from "./video-preview"

export default function TravelCanvas() {
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [currentTheme, setCurrentTheme] = useState("default")
  const [showVideoPreview, setShowVideoPreview] = useState(false)
  const [rotationState, setRotationState] = useState({
    isRotating: false,
    startAngle: 0,
    itemCenterX: 0,
    itemCenterY: 0,
  })

  const canvasRef = useRef(null)
  const { toast } = useToast()

  const addImage = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const newItem = {
        id: `image-${Date.now()}`,
        type: "image",
        content: e.target?.result,
        position: { x: 100, y: 100 },
        size: { width: 200, height: 200 },
        rotation: 0,
        zIndex: items.length + 1,
      }
      setItems([...items, newItem])

      toast({
        title: "Image added",
        description: "Your image has been added to the canvas.",
      })
    }
    reader.readAsDataURL(file)
  }

  const addText = () => {
    const newItem = {
      id: `text-${Date.now()}`,
      type: "text",
      content: "Double click to edit text",
      position: { x: 100, y: 100 },
      size: { width: 200, height: 100 },
      rotation: 0,
      zIndex: items.length + 1,
      style: {
        fontSize: "16px",
        color: "#000000",
        fontFamily: "Arial, sans-serif",
      },
    }
    setItems([...items, newItem])

    toast({
      title: "Text added",
      description: "Double-click to edit your text.",
    })
  }

  const addSticker = (sticker) => {
    const newItem = {
      id: `sticker-${Date.now()}`,
      type: "sticker",
      content: sticker.src,
      position: { x: 100, y: 100 },
      size: { width: 100, height: 100 },
      rotation: 0,
      zIndex: items.length + 1,
    }
    setItems([...items, newItem])

    toast({
      title: "Sticker added",
      description: "Your sticker has been added to the canvas.",
    })
  }

  const updateItemContent = (id, content) => {
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, content } : item)))
  }

  const updateItemStyle = (id, style) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, style: { ...item.style, ...style } } : item)),
    )
  }

  const deleteItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
    setSelectedItem(null)

    toast({
      title: "Item deleted",
      description: "The item has been removed from your canvas.",
    })
  }

  const clearCanvas = () => {
    setItems([])
    setSelectedItem(null)

    toast({
      title: "Canvas cleared",
      description: "All items have been removed from the canvas.",
    })
  }

  const saveJournal = () => {
    // Save to localStorage for demo purposes
    localStorage.setItem(
      "travelStoryJournal",
      JSON.stringify({
        items,
        theme: currentTheme,
        savedAt: new Date().toISOString(),
      }),
    )
  }

  const exportAsPDF = async () => {
    // Save the journal first
    saveJournal()

    if (!canvasRef.current) return

    try {
      // Create a PNG of the canvas
      const dataUrl = await toPng(canvasRef.current, { quality: 0.95 })

      // Create a new PDF document
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([842, 595]) // A4 landscape

      // Convert the PNG to a format PDF-lib can use
      const pngImage = await pdfDoc.embedPng(dataUrl)

      // Calculate dimensions to fit the page
      const { width, height } = pngImage.scale(1)
      const aspectRatio = width / height

      let drawWidth = page.getWidth() - 50
      let drawHeight = drawWidth / aspectRatio

      if (drawHeight > page.getHeight() - 50) {
        drawHeight = page.getHeight() - 50
        drawWidth = drawHeight * aspectRatio
      }

      // Draw the image centered on the page
      page.drawImage(pngImage, {
        x: (page.getWidth() - drawWidth) / 2,
        y: (page.getHeight() - drawHeight) / 2,
        width: drawWidth,
        height: drawHeight,
      })

      // Serialize the PDF to bytes
      const pdfBytes = await pdfDoc.save()

      // Create a download link
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `TravelStory_${new Date().toISOString().slice(0, 10)}.pdf`
      link.click()

      toast({
        title: "PDF exported successfully!",
        description: "Your travel story has been exported as a PDF.",
      })
    } catch (error) {
      console.error("Error exporting PDF:", error)
      toast({
        title: "Error exporting PDF",
        description: "There was an error exporting your travel story.",
        variant: "destructive",
      })
    }
  }

  const generateVideo = () => {
    // Save the journal first
    saveJournal()

    // Then show video preview
    setShowVideoPreview(true)
  }

  const applyTheme = (theme) => {
    setCurrentTheme(theme.id)
  }

  // Start rotation
  const startRotation = (e, id) => {
    e.stopPropagation()

    // Find the item
    const item = items.find((item) => item.id === id)
    if (!item) return

    // Get the center of the item
    const itemElement = document.getElementById(`item-${id}`)
    if (!itemElement) return

    const rect = itemElement.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Get the current pointer position
    const clientX = e.clientX || (e.touches && e.touches[0].clientX)
    const clientY = e.clientY || (e.touches && e.touches[0].clientY)

    // Calculate the initial angle
    const startAngle = Math.atan2(clientY - centerY, clientX - centerX)

    setRotationState({
      isRotating: true,
      startAngle: startAngle - (item.rotation || 0) * (Math.PI / 180),
      itemCenterX: centerX,
      itemCenterY: centerY,
    })

    // Add event listeners
    document.addEventListener("mousemove", handleRotationMove)
    document.addEventListener("touchmove", handleRotationMove)
    document.addEventListener("mouseup", endRotation)
    document.addEventListener("touchend", endRotation)
  }

  // Handle rotation movement
  const handleRotationMove = (e) => {
    if (!rotationState.isRotating || !selectedItem) return

    // Get the current pointer position
    const clientX = e.clientX || (e.touches && e.touches[0].clientX)
    const clientY = e.clientY || (e.touches && e.touches[0].clientY)

    // Calculate the new angle
    const angle = Math.atan2(clientY - rotationState.itemCenterY, clientX - rotationState.itemCenterX)

    // Convert to degrees and update the item
    const degrees = ((angle - rotationState.startAngle) * 180) / Math.PI

    setItems((prevItems) => prevItems.map((item) => (item.id === selectedItem ? { ...item, rotation: degrees } : item)))
  }

  // End rotation
  const endRotation = () => {
    setRotationState({
      isRotating: false,
      startAngle: 0,
      itemCenterX: 0,
      itemCenterY: 0,
    })

    // Remove event listeners
    document.removeEventListener("mousemove", handleRotationMove)
    document.removeEventListener("touchmove", handleRotationMove)
    document.removeEventListener("mouseup", endRotation)
    document.removeEventListener("touchend", endRotation)
  }

  // Load saved journal from localStorage on component mount
  useEffect(() => {
    const savedJournal = localStorage.getItem("travelStoryJournal")
    if (savedJournal) {
      try {
        const { items: savedItems, theme } = JSON.parse(savedJournal)
        setItems(savedItems)
        setCurrentTheme(theme || "default")
      } catch (error) {
        console.error("Error loading saved journal:", error)
      }
    }

    // Clean up event listeners
    return () => {
      document.removeEventListener("mousemove", handleRotationMove)
      document.removeEventListener("touchmove", handleRotationMove)
      document.removeEventListener("mouseup", endRotation)
      document.removeEventListener("touchend", endRotation)
    }
  }, [])

  const getThemeClasses = () => {
    switch (currentTheme) {
      case "beach":
        return "bg-amber-50"
      case "mountains":
        return "bg-blue-50"
      case "sunset":
        return "bg-orange-50"
      case "forest":
        return "bg-green-50"
      default:
        return "bg-white"
    }
  }

  const getThemeOverlay = () => {
    switch (currentTheme) {
      case "beach":
        return (
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-amber-200"></div>
            <div className="absolute top-0 left-0 right-0 h-2/3 bg-blue-200"></div>
          </div>
        )
      case "mountains":
        return (
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-green-200"></div>
            <div className="absolute bottom-1/3 left-0 right-0 h-1/3 bg-gray-200 clip-mountain"></div>
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-blue-200"></div>
          </div>
        )
      case "sunset":
        return (
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute inset-0 bg-gradient-to-b from-orange-200 via-red-200 to-purple-200"></div>
          </div>
        )
      case "forest":
        return (
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-green-200"></div>
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-blue-100"></div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Tabs defaultValue="add" className="w-auto">
            <TabsList>
              <TabsTrigger value="add">Add Content</TabsTrigger>
              <TabsTrigger value="theme">Themes</TabsTrigger>
            </TabsList>
            <TabsContent value="add" className="flex gap-2">
              <ImageUploader onImageUpload={addImage}>
                <Button variant="outline" size="sm">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </ImageUploader>

              <Button variant="outline" size="sm" onClick={addText}>
                <Type className="h-4 w-4 mr-2" />
                Add Text
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Sticker className="h-4 w-4 mr-2" />
                    Add Sticker
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <StickerPicker onSelectSticker={addSticker} />
                </PopoverContent>
              </Popover>

              <Button
                variant="outline"
                size="sm"
                onClick={clearCanvas}
                className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
              >
                <Eraser className="h-4 w-4 mr-2" />
                Clear Canvas
              </Button>
            </TabsContent>

            <TabsContent value="theme">
              <ThemePicker currentTheme={currentTheme} onSelectTheme={applyTheme} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex gap-2 items-center">
          <Button variant="outline" onClick={exportAsPDF}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>

          <Button variant="outline" onClick={generateVideo}>
            <Video className="h-4 w-4 mr-2" />
            Generate Video
          </Button>
        </div>
      </div>

      <div
        ref={canvasRef}
        className={`relative w-full h-[600px] border rounded-lg overflow-hidden transition-colors duration-300 ${getThemeClasses()}`}
      >
        {getThemeOverlay()}

        {items.map((item) => (
          <Rnd
            key={item.id}
            id={`item-${item.id}`}
            default={{
              x: item.position.x,
              y: item.position.y,
              width: item.size.width,
              height: item.size.height,
            }}
            position={{ x: item.position.x, y: item.position.y }}
            size={{ width: item.size.width, height: item.size.height }}
            bounds="parent"
            minWidth={50}
            minHeight={50}
            onDragStop={(e, d) => {
              setItems((prevItems) =>
                prevItems.map((i) => (i.id === item.id ? { ...i, position: { x: d.x, y: d.y } } : i)),
              )
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              setItems((prevItems) =>
                prevItems.map((i) =>
                  i.id === item.id
                    ? {
                        ...i,
                        position: { x: position.x, y: position.y },
                        size: {
                          width: Number.parseInt(ref.style.width),
                          height: Number.parseInt(ref.style.height),
                        },
                      }
                    : i,
                ),
              )
            }}
            className={`${selectedItem === item.id ? "ring-2 ring-blue-400" : ""} transition-shadow`}
            onClick={() => setSelectedItem(item.id)}
            style={{ zIndex: item.zIndex }}
          >
            <div className="relative w-full h-full">
              {selectedItem === item.id && (
                <div className="absolute -top-8 right-0 flex gap-1 bg-white p-1 rounded shadow-sm z-10">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteItem(item.id)}>
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              )}

              {item.type === "image" && (
                <div className="w-full h-full relative">
                  <img
                    src={item.content || "/placeholder.svg"}
                    alt="User uploaded"
                    className="w-full h-full object-cover"
                    style={{ transform: `rotate(${item.rotation || 0}deg)` }}
                  />
                </div>
              )}

              {item.type === "text" && (
                <div className="w-full h-full relative">
                  <div style={{ transform: `rotate(${item.rotation || 0}deg)` }} className="w-full h-full">
                    <TextEditor
                      content={item.content}
                      style={item.style}
                      onUpdate={(content) => updateItemContent(item.id, content)}
                      onStyleChange={(style) => updateItemStyle(item.id, style)}
                      isSelected={selectedItem === item.id}
                    />
                  </div>
                </div>
              )}

              {item.type === "sticker" && (
                <div className="w-full h-full relative">
                  <img
                    src={item.content || "/placeholder.svg"}
                    alt="Sticker"
                    className="w-full h-full object-contain"
                    style={{ transform: `rotate(${item.rotation || 0}deg)` }}
                  />
                </div>
              )}

              {/* Rotation handle */}
              {selectedItem === item.id && (
                <div
                  className="absolute top-1/2 right-0 w-6 h-6 bg-blue-500 rounded-full transform translate-x-1/2 -translate-y-1/2 cursor-move opacity-70 z-20"
                  onMouseDown={(e) => startRotation(e, item.id)}
                  onTouchStart={(e) => startRotation(e, item.id)}
                ></div>
              )}
            </div>
          </Rnd>
        ))}
      </div>

      {showVideoPreview && <VideoPreview items={items} onClose={() => setShowVideoPreview(false)} />}
    </div>
  )
}
