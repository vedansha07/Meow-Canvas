"use client"

import { useState, useRef, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

export default function TextEditor({ content, style = {}, onUpdate, onStyleChange, isSelected }) {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(content)
  const editorRef = useRef(null)

  const defaultStyle = {
    fontSize: "16px",
    color: "#000000",
    fontFamily: "Arial, sans-serif",
    fontWeight: "normal",
    fontStyle: "normal",
    textDecoration: "none",
    textAlign: "left",
    ...style,
  }

  const [currentStyle, setCurrentStyle] = useState(defaultStyle)

  useEffect(() => {
    setCurrentStyle({ ...defaultStyle, ...style })
  }, [style])

  useEffect(() => {
    setText(content)
  }, [content])

  const handleDoubleClick = () => {
    if (!isEditing) {
      setIsEditing(true)
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
    onUpdate(text)
  }

  const updateStyle = (newStyle) => {
    const updatedStyle = { ...currentStyle, ...newStyle }
    setCurrentStyle(updatedStyle)
    onStyleChange(updatedStyle)
  }

  const getFontSizeNumber = () => {
    return Number.parseInt(currentStyle.fontSize) || 16
  }

  const fonts = [
    { value: "Arial, sans-serif", label: "Arial" },
    { value: "Times New Roman, serif", label: "Times" },
    { value: "Courier New, monospace", label: "Courier" },
    { value: "Georgia, serif", label: "Georgia" },
    { value: "Verdana, sans-serif", label: "Verdana" },
    { value: "Comic Sans MS, cursive", label: "Comic Sans" },
  ]

  return (
    <div className="w-full h-full relative">
      {isSelected && !isEditing && (
        <div className="absolute -top-10 left-0 bg-white shadow-sm rounded p-1 flex gap-1 z-10">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-2">
                Style
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Text Style</h4>
                  <div className="flex gap-2">
                    <Button
                      variant={currentStyle.fontWeight === "bold" ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        updateStyle({ fontWeight: currentStyle.fontWeight === "bold" ? "normal" : "bold" })
                      }
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={currentStyle.fontStyle === "italic" ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        updateStyle({ fontStyle: currentStyle.fontStyle === "italic" ? "normal" : "italic" })
                      }
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={currentStyle.textDecoration === "underline" ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        updateStyle({
                          textDecoration: currentStyle.textDecoration === "underline" ? "none" : "underline",
                        })
                      }
                    >
                      <Underline className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Alignment</h4>
                  <div className="flex gap-2">
                    <Button
                      variant={currentStyle.textAlign === "left" ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateStyle({ textAlign: "left" })}
                    >
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={currentStyle.textAlign === "center" ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateStyle({ textAlign: "center" })}
                    >
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={currentStyle.textAlign === "right" ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateStyle({ textAlign: "right" })}
                    >
                      <AlignRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="fontSize">Font Size: {getFontSizeNumber()}px</Label>
                  </div>
                  <Slider
                    id="fontSize"
                    min={8}
                    max={72}
                    step={1}
                    defaultValue={[getFontSizeNumber()]}
                    onValueChange={(value) => updateStyle({ fontSize: `${value[0]}px` })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontColor">Font Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="fontColor"
                      type="color"
                      value={currentStyle.color}
                      className="w-12 h-8 p-1"
                      onChange={(e) => updateStyle({ color: e.target.value })}
                    />
                    <Input
                      value={currentStyle.color}
                      onChange={(e) => updateStyle({ color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <select
                    id="fontFamily"
                    value={currentStyle.fontFamily}
                    onChange={(e) => updateStyle({ fontFamily: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    {fonts.map((font) => (
                      <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {isEditing ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          className="w-full h-full p-2 border-none focus:outline-none resize-none"
          style={currentStyle}
        />
      ) : (
        <div
          ref={editorRef}
          onDoubleClick={handleDoubleClick}
          className="w-full h-full p-2 cursor-text overflow-auto"
          style={currentStyle}
        >
          {text}
        </div>
      )}
    </div>
  )
}
