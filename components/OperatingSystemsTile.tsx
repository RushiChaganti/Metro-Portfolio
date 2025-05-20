"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Monitor, Server, Smartphone, Cpu } from "lucide-react"
import Image from "next/image"
import { getImagePath } from "@/lib/utils";

interface OperatingSystemsTileProps {
  operatingSystems: string[]
}

const OperatingSystemsTile: React.FC<OperatingSystemsTileProps> = ({ operatingSystems }) => {
  const [currentOSIndex, setCurrentOSIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Map OS to icons
  const getOSIcon = (os: string) => {
    const osLower = os.toLowerCase();
    
    if (osLower.includes("windows")) {
      return (
        <div className="w-8 h-8 relative">
          <Image src={getImagePath("/icons/windows.svg")} alt="Windows" width={32} height={32} className="invert" />
        </div>
      )
    }
    if (osLower.includes("arch") || osLower.includes("ubuntu") || osLower.includes("debian")) {
      return (
        <div className="w-8 h-8 relative">
          <Image src={getImagePath("/icons/arch.svg")} alt="Linux" width={32} height={32} className="invert" />
        </div>
      )
    }
    if (osLower.includes("mac") || osLower.includes("macos")) {
      return (
        <div className="w-8 h-8 relative">
          <Image src={getImagePath("/icons/mac.svg")} alt="macOS" width={32} height={32} className="invert" />
        </div>
      )
    }
    return <Cpu className="h-8 w-8" />
  }

  useEffect(() => {
    const osInterval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentOSIndex((prevIndex) => (prevIndex + 1) % operatingSystems.length)
        setIsAnimating(false)
      }, 500)
    }, 4000)

    return () => clearInterval(osInterval)
  }, [operatingSystems.length])

  return (
    <div className="w-full h-full p-4 flex flex-col items-center justify-center">
      <h2 className="text-xl font-light mb-2">OS</h2>

      <div
        className={`transition-all duration-500 flex flex-col items-center ${
          isAnimating ? "opacity-0 scale-75" : "opacity-100 scale-100"
        }`}
      >
        {getOSIcon(operatingSystems[currentOSIndex])}
        <p className="text-base mt-2">{operatingSystems[currentOSIndex]}</p>
      </div>
    </div>
  )
}

export default OperatingSystemsTile
