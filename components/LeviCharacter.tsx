"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getImagePath } from "@/lib/utils";

interface LeviCharacterProps {
  enabled: boolean
}

const LeviCharacter: React.FC<LeviCharacterProps> = ({ enabled }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 })
  const [isSwinging, setIsSwinging] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const interval = setInterval(() => {
      const maxX = window.innerWidth - 100
      const maxY = window.innerHeight - 100

      setTargetPosition({
        x: Math.random() * maxX,
        y: Math.random() * maxY
      })

      setIsSwinging(true)
      setTimeout(() => setIsSwinging(false), 1000)
    }, 5000)

    return () => clearInterval(interval)
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    const animateFrame = () => {
      setPosition(current => {
        const dx = targetPosition.x - current.x
        const dy = targetPosition.y - current.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 5) return current

        const speed = Math.min(distance * 0.05, 10)
        const vx = (dx / distance) * speed
        const vy = (dy / distance) * speed

        return {
          x: current.x + vx,
          y: current.y + vy
        }
      })
    }

    const frameId = requestAnimationFrame(animateFrame)
    return () => cancelAnimationFrame(frameId)
  }, [position, targetPosition, enabled])

  if (!enabled) return null

  return (
    <div 
      className="fixed pointer-events-none z-50 transition-transform"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: isSwinging ? 'rotate(45deg)' : 'rotate(0deg)',
        transition: 'transform 0.5s ease-in-out'
      }}
    >
      <div className="relative w-24 h-24">
        <Image
          src={getImagePath("/levi-2d.png")}  // Replace with actual path if needed
          alt="Levi Ackerman Anime Style"
          fill
          style={{ objectFit: 'contain' }}
        />
        {isSwinging && (
          <div 
            className="absolute top-0 left-1/2 w-1 bg-gray-400 origin-top"
            style={{ 
              height: '100px',
              transform: 'translateX(-50%) rotate(-45deg)',
              transformOrigin: 'top center'
            }}
          />
        )}
      </div>
    </div>
  )
}

export default LeviCharacter
