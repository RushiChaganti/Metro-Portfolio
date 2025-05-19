"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface ClockTileProps {
  tileColor: string
  tileOpacity: number
}

const ClockTile: React.FC<ClockTileProps> = ({ tileColor, tileOpacity }) => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Format time in IST
  const formatISTTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    }
    return date.toLocaleTimeString([], options)
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <p className="text-2xl font-light">{formatISTTime(time)}</p>
      <p className="text-sm font-light mt-1">IST</p>
    </div>
  )
}

export default ClockTile
