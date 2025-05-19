"use client"

import React, { useState, useEffect } from "react"
import { 
  Code, 
  Database, 
  Globe, 
  Server, 
  Layout, 
  Terminal, 
  GitBranch, 
  Package, 
  Cpu,
  Cloud
} from "lucide-react"

// Skill icon component props
interface SkillsTileProps {
  skills: string[]
}

// Mapping local skill SVGs to filenames
const localSkillIcons: Record<string, string> = {
  "python": "/icons/python.svg",
  "c++": "/icons/cpp.svg",
  "c": "/icons/c.svg",
  "docker": "/icons/docker.svg",
  "java": "/icons/java.svg",
  "linux": "/icons/linux.svg",
  "windows": "/icons/windows.svg",
  "mac": "/icons/mac.svg",
  "anime": "/icons/anime.svg",
  "arch": "/icons/arch.svg",
  "chess": "/icons/chess.svg",
  "bash": "/icons/bash.svg",
  "model": "/icons/model.svg",
}

const SkillsTile: React.FC<SkillsTileProps> = ({ skills }) => {
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Select either a local SVG or a Lucide icon
  const getSkillIcon = (skill: string) => {
    const skillKey = skill.toLowerCase()

    // Render local icon if available
    if (localSkillIcons[skillKey]) {
      return (
        <img 
          src={localSkillIcons[skillKey]} 
          alt={skill} 
          className="h-8 w-8 invert" // Add invert class to make SVGs visible
        />
      )
    }

    // Fallback to Lucide icons
    if (skillKey.includes("javascript") || skillKey.includes("typescript")) 
      return <Code className="h-8 w-8" />
    if (skillKey.includes("react") || skillKey.includes("vue") || skillKey.includes("angular")) 
      return <Layout className="h-8 w-8" />
    if (skillKey.includes("node") || skillKey.includes("express")) 
      return <Server className="h-8 w-8" />
    if (skillKey.includes("html") || skillKey.includes("css") || skillKey.includes("tailwind")) 
      return <Globe className="h-8 w-8" />
    if (skillKey.includes("mongo") || skillKey.includes("sql") || skillKey.includes("postgres")) 
      return <Database className="h-8 w-8" />
    if (skillKey.includes("git")) 
      return <GitBranch className="h-8 w-8" />
    if (skillKey.includes("docker")) 
      return <Package className="h-8 w-8" />
    if (skillKey.includes("aws") || skillKey.includes("azure") || skillKey.includes("cloud")) 
      return <Cloud className="h-8 w-8" />

    return <Terminal className="h-8 w-8" />
  }

  useEffect(() => {
    const skillsInterval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentSkillIndex((prevIndex) => (prevIndex + 1) % skills.length)
        setIsAnimating(false)
      }, 500)
    }, 3000)

    return () => clearInterval(skillsInterval)
  }, [skills.length])

  return (
    <div className="w-full h-full p-4 flex flex-col items-center justify-center">
      <h2 className="text-xl font-light mb-2">SKILLS</h2>

      <div
        className={`transition-all duration-500 flex flex-col items-center ${
          isAnimating ? "opacity-0 scale-75" : "opacity-100 scale-100"
        }`}
      >
        {getSkillIcon(skills[currentSkillIndex])}
        <p className="text-base mt-2">{skills[currentSkillIndex]}</p>
      </div>
    </div>
  )
}

export default SkillsTile
