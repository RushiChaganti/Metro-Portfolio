"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Camera, BookOpen, Music, Coffee, Mountain, X } from "lucide-react"
import Image from "next/image"
import { getImagePath } from "@/lib/utils";

interface HobbiesLiveTileProps {
  hobbies: string[]
}

const HobbiesLiveTile: React.FC<HobbiesLiveTileProps> = ({ hobbies }) => {
  const [currentHobbyIndex, setCurrentHobbyIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showAllHobbies, setShowAllHobbies] = useState(false)

  // Map hobbies to icons
  const getHobbyIcon = (hobby: string, index: number) => {
    const hobbyLower = hobby.toLowerCase()
    
    if (hobbyLower.includes("anime") || hobbyLower.includes("watching")) {
      return (
        <div className="w-8 h-8 relative">
          <Image src={getImagePath("/icons/anime.svg")} alt="Anime" width={32} height={32} className="invert" />
        </div>
      )
    }
    if (hobbyLower.includes("chess")) {
      return (
        <div className="w-8 h-8 relative">
          <Image src={getImagePath("/icons/chess.svg")} alt="Chess" width={32} height={32} className="invert" />
        </div>
      )
    }
    
    // Fallback to default icons
    const defaultIcons = [
      <Mountain key="mountain" className="h-8 w-8" />,
    ]
    
    return defaultIcons[index % defaultIcons.length]
  }

  useEffect(() => {
    if (!showAllHobbies) {
      const hobbyInterval = setInterval(() => {
        setIsAnimating(true)
        setTimeout(() => {
          setCurrentHobbyIndex((prevIndex) => (prevIndex + 1) % hobbies.length)
          setIsAnimating(false)
        }, 500)
      }, 4000)

      return () => clearInterval(hobbyInterval)
    }
  }, [hobbies.length, showAllHobbies])

  const handleTileClick = () => {
    setShowAllHobbies(true)
  }

  if (showAllHobbies) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 overflow-auto p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-light">Hobbies</h2>
            <button
              onClick={() => setShowAllHobbies(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hobbies.map((hobby, index) => (
              <div key={index} className="bg-purple-700/50 p-4 rounded-md flex items-center">
                <div className="mr-4">
                  {getHobbyIcon(hobby, index)}
                </div>
                <p className="text-lg">{hobby}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full p-4 flex flex-col items-center justify-center cursor-pointer" onClick={handleTileClick}>
      <h2 className="text-xl font-light mb-2">Hobbies</h2>

      <div
        className={`transition-all duration-500 flex flex-col items-center ${
          isAnimating ? "opacity-0 scale-75" : "opacity-100 scale-100"
        }`}
      >
        {getHobbyIcon(hobbies[currentHobbyIndex], currentHobbyIndex)}
        <p className="text-base mt-2">{hobbies[currentHobbyIndex]}</p>
      </div>
    </div>
  )
}

export default HobbiesLiveTile
