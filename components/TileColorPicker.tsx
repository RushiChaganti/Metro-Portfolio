"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Palette, RotateCcw } from "lucide-react"

interface TileColorPickerProps {
  tileId: string
  currentColor: string
  defaultColor: string
  onChange: (color: string) => void
  onReset?: () => void
}

const TileColorPicker: React.FC<TileColorPickerProps> = ({ 
  tileId, 
  currentColor, 
  defaultColor,
  onChange,
  onReset 
}) => {
  const [isOpen, setIsOpen] = useState(false)

  // Windows Phone Metro UI color palette
  const metroColors = [
    "#0078D7", // Blue
    "#107C10", // Green
    "#D92B6A", // Pink
    "#5E35B1", // Purple
    "#00B294", // Teal
    "#E3A21A", // Yellow
    "#8A2BE2", // BlueViolet
    "#2E8B57", // SeaGreen
    "#1DB954", // Spotify Green
    "#FF5722", // Orange
    "#607D8B", // Blue Grey
    "#F44336", // Red
  ]

  const formatTileId = (id: string) => {
    return id
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Add useEffect to update color when defaultColor changes
  useEffect(() => {
    if (currentColor === "#0078D7" && defaultColor !== "#0078D7") {
      onChange(defaultColor);
    }
  }, [defaultColor, currentColor, onChange]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm">{formatTileId(tileId)}</span>
        <div className="flex space-x-1">
          {onReset && (
            <button
              className="flex items-center text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20"
              onClick={onReset}
              title="Reset to default color"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          )}
          <button
            className="flex items-center text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Palette className="h-3 w-3 mr-1" />
            Change
          </button>
        </div>
      </div>

      <div
        className="h-6 w-full rounded cursor-pointer"
        style={{ backgroundColor: currentColor }}
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="grid grid-cols-4 gap-1 mt-2 p-2 bg-black/50 rounded">
          {metroColors.map((color, index) => (
            <div
              key={index}
              className="h-6 w-6 rounded cursor-pointer hover:ring-2 hover:ring-white transition-all"
              style={{ backgroundColor: color }}
              onClick={() => {
                onChange(color)
                setIsOpen(false)
              }}
            />
          ))}
          <div className="col-span-4 mt-2">
            <input
              type="color"
              value={currentColor}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-6 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default TileColorPicker
