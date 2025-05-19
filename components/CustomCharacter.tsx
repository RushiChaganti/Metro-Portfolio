"use client"

import { useState, useEffect, useRef } from "react"

interface CustomCharacterProps {
  enabled: boolean
  characterData: {
    name: string
    imageUrl: string
  }
}

export default function CustomCharacter({ enabled, characterData }: CustomCharacterProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 })
  const characterRef = useRef<HTMLDivElement>(null)
  const [facingLeft, setFacingLeft] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const interval = setInterval(() => {
      const maxX = window.innerWidth - 100
      const maxY = window.innerHeight - 100

      setTargetPosition({
        x: Math.random() * maxX,
        y: Math.random() * maxY
      })
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

        setFacingLeft(vx < 0)

        return {
          x: current.x + vx,
          y: current.y + vy
        }
      })
    }

    const frameId = requestAnimationFrame(function animate() {
      animateFrame()
      requestAnimationFrame(animate)
    })

    return () => cancelAnimationFrame(frameId)
  }, [position, targetPosition, enabled])

  if (!enabled) return null

  return (
    <div
      ref={characterRef}
      className="fixed z-50 pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `scaleX(${facingLeft ? -1 : 1})`,
      }}
    >
      <div className="relative">
        <img
          src={characterData.imageUrl || "/placeholder.svg"}
          alt={characterData.name}
          className="h-16 w-16 object-contain"
        />
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 px-2 py-0.5 rounded text-xs whitespace-nowrap">
        </div>
      </div>
    </div>
  )
}
