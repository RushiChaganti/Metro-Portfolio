"use client"

import { useState, useEffect } from "react"
import { Cloud, Sun, CloudRain, Snowflake } from "lucide-react"

const WeatherTile = () => {
  const [weatherState, setWeatherState] = useState<"sunny" | "cloudy" | "rainy" | "snowy">("sunny")
  const [temperature, setTemperature] = useState(72)
  const [location, setLocation] = useState("San Francisco")
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    // Cycle through weather states
    const weatherInterval = setInterval(() => {
      setWeatherState((prev) => {
        const states: Array<"sunny" | "cloudy" | "rainy" | "snowy"> = ["sunny", "cloudy", "rainy", "snowy"]
        const currentIndex = states.indexOf(prev)
        return states[(currentIndex + 1) % states.length]
      })

      // Update temperature based on weather
      setTemperature(() => {
        switch (weatherState) {
          case "sunny":
            return Math.floor(Math.random() * 15) + 70 // 70-85
          case "cloudy":
            return Math.floor(Math.random() * 10) + 65 // 65-75
          case "rainy":
            return Math.floor(Math.random() * 10) + 55 // 55-65
          case "snowy":
            return Math.floor(Math.random() * 15) + 20 // 20-35
        }
      })

      // Flip the tile for animation effect
      setIsFlipped(true)
      setTimeout(() => setIsFlipped(false), 500)
    }, 5000)

    return () => clearInterval(weatherInterval)
  }, [weatherState])

  const getWeatherIcon = () => {
    switch (weatherState) {
      case "sunny":
        return <Sun className="h-10 w-10" />
      case "cloudy":
        return <Cloud className="h-10 w-10" />
      case "rainy":
        return <CloudRain className="h-10 w-10" />
      case "snowy":
        return <Snowflake className="h-10 w-10" />
    }
  }

  return (
    <div
      className={`w-full h-full p-4 flex items-center justify-between transition-transform duration-500 ${
        isFlipped ? "scale-90" : "scale-100"
      }`}
    >
      <div className="flex flex-col">
        <h2 className="text-2xl font-light mb-1">Weather</h2>
        <p className="text-xl">{location}</p>
        <p className="text-3xl font-light mt-2">{temperature}°F</p>
      </div>
      <div className="flex flex-col items-center">
        {getWeatherIcon()}
        <p className="text-lg mt-2 capitalize">{weatherState}</p>
      </div>
    </div>
  )
}

export default WeatherTile
