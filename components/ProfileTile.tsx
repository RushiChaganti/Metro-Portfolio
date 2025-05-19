"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { getImagePath } from "@/lib/utils";

const profileImages = [
  getImagePath("/user_1.jpg?height=400&width=400"),
  getImagePath("/user_3.webp?height=400&width=400"),
  getImagePath("/user_2.jpg?height=400&width=400"),
]

const ProfileTile = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const imageInterval = setInterval(() => {
      nextImage()
    }, 5000)

    return () => clearInterval(imageInterval)
  }, [])

  const nextImage = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % profileImages.length)
      setIsAnimating(false)
    }, 300)
  }

  const prevImage = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? profileImages.length - 1 : prevIndex - 1
      )
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden rounded-xl">
      <div className="absolute top-0 left-0 w-full p-4 z-10 bg-gradient-to-b from-black/50 to-transparent">
        <h2 className="text-xl font-light text-white">Profile</h2>
      </div>

      <div
        className={`w-full h-full transition-opacity duration-300 ${isAnimating ? "opacity-50" : "opacity-100"}`}
        style={{
          backgroundImage: `url(${profileImages[currentImageIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="absolute bottom-4 left-0 w-full flex justify-center space-x-2 z-10">
        {profileImages.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full ${currentImageIndex === index ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>

      <button
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 p-1 rounded-full hover:bg-black/50 transition-colors z-10"
        onClick={(e) => {
          e.stopPropagation()
          prevImage()
        }}
      >
        <ChevronLeft className={`${isMobile ? "h-4 w-4" : "h-6 w-6"} text-white`} />
      </button>

      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 p-1 rounded-full hover:bg-black/50 transition-colors z-10"
        onClick={(e) => {
          e.stopPropagation()
          nextImage()
        }}
      >
        <ChevronRight className={`${isMobile ? "h-4 w-4" : "h-6 w-6"} text-white`} />
      </button>
    </div>
  )
}

export default ProfileTile
