"use client"

import type React from "react"
import { getImagePath } from "@/lib/utils";

import { useState, useEffect, useRef } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import {
  FileText,
  Github,
  Linkedin,
  Twitter,
  Upload,
  Settings,
  Briefcase,
  Code,
  Layout,
  MessageSquare,
  Monitor,
  Globe,
  Maximize2,
  Minimize2,
  Palette,
  Server,
  Database,
  GitBranch,
  Package,
  Cloud,
  Terminal,
  Camera,
  BookOpen,
  Mountain,
  Cpu,
  Trash,
  User,
} from "lucide-react"
import Link from "next/link"
import personalData from "@/data/personal-data.json"
import ClockTile from "@/components/ClockTile"
import ActivityTile from "@/components/ActivityTile"
import ProfileTile from "@/components/ProfileTile"
import SpotifyTile from "@/components/SpotifyTile"
import TileColorPicker from "@/components/TileColorPicker"
import SkillsTile from "@/components/SkillsTile"
import OperatingSystemsTile from "@/components/OperatingSystemsTile"
import ChessTile from "@/components/ChessTile"
import LeviCharacter from "@/components/LeviCharacter"
import HobbiesLiveTile from "@/components/HobbiesLiveTile"
import { useIsMobile } from "@/hooks/use-mobile"
import CustomCharacter from "@/components/CustomCharacter"
import CharacterUploader from "@/components/CharacterUploader"
import CustomCharacterTile from "@/components/CustomCharacterTile"

// Define tile size types
type TileSize = "small" | "medium" | "large"
type TileSizes = Record<string, TileSize>
type TileColors = Record<string, string>
type CustomCharacter = {
  id: string
  name: string
  imageUrl: string
  enabled: boolean
}

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeSection, setActiveSection] = useState("home")
  const [tileColor, setTileColor] = useLocalStorage<string>("tileColor", "#0078D7") // Default Windows blue
  const [tileOpacity, setTileOpacity] = useLocalStorage<number>("tileOpacity", 1)
  const [backgroundImage, setBackgroundImage] = useLocalStorage<string>("backgroundImage", "")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [selectedExperience, setSelectedExperience] = useState<number | null>(null)
  const [selectedContribution, setSelectedContribution] = useState<number | null>(null)
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0)
  const [activeTile, setActiveTile] = useState<string | null>(null)
  const [showLevi, setShowLevi] = useLocalStorage<boolean>("showLevi", true)
  const isMobile = useIsMobile()
  const [customCharacters, setCustomCharacters] = useLocalStorage<CustomCharacter[]>("customCharacters", [])
  const [showCharacterUploader, setShowCharacterUploader] = useState(false)

  // Tile sizes state
  const [tileSizes, setTileSizes] = useLocalStorage<TileSizes>("tileSizes", {
    profile: "large",
    about: "small",
    skills: "medium",
    "project-0": "medium",
    "project-1": "medium",
    "project-2": "small",
    "project-3": "small",
    "exp-0": "medium",
    "exp-1": "small",
    "exp-2": "small",
    "contrib-0": "medium",
    "contrib-1": "small",
    "contrib-2": "small",
    "hobbies-live": "small",
    activity: "medium",
    spotify: "medium",
    clock: "small",
    date: "small",
    github: "small",
    linkedin: "small",
    twitter: "small",
    instagram: "small",
    settings: "small",
    "operating-systems": "small",
    chess: "small",
    "levi-toggle": "small",
    resume: "small",
    contact: "small",
  })

  // Individual tile colors
  const [tileColors, setTileColors] = useLocalStorage<TileColors>("tileColors", {
    skills: "#0078D7",
    quote: "#D92B6A",
    "hobbies-live": "#5E35B1",
    activity: "#00B294",
    profile: "#107C10",
    spotify: "#1DB954",
    about: "#0078D7",
    contact: "#0078D7",
    resume: "#0078D7",
    clock: "#0078D7",
    date: "#0078D7",
    github: "#0078D7",
    linkedin: "#0078D7",
    twitter: "#0078D7",
    instagram: "#E1306C",
    settings: "#0078D7",
    "operating-systems": "#607D8B",
    chess: "#8A2BE2",
    "levi-toggle": "#0078D7",
    // Project tiles
    "project-0": "#0078D7",
    "project-1": "#107C10",
    "project-2": "#D92B6A",
    "project-3": "#5E35B1",
    // Experience tiles
    "exp-0": "#2E8B57",
    "exp-1": "#2E8B57",
    "exp-2": "#2E8B57",
    // Contribution tiles
    "contrib-0": "#8A2BE2",
    "contrib-1": "#8A2BE2",
    "contrib-2": "#8A2BE2",
  })

  // Project icons mapping
  const projectIcons = [
    <Monitor key="monitor" className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />,
    <MessageSquare key="message" className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />,
    <Layout key="layout" className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />,
    <Globe key="globe" className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />,
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  // Skills live tile effect
  useEffect(() => {
    const skillsInterval = setInterval(() => {
      setCurrentSkillIndex((prevIndex) => (prevIndex === personalData.skills.length - 1 ? 0 : prevIndex + 1))
    }, 3000) // Change skill every 3 seconds

    return () => clearInterval(skillsInterval)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDay = (date: Date) => {
    return date.toLocaleDateString([], { weekday: "long" })
  }

  const formatDate = (date: Date) => {
    return date.getDate()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Function to change individual tile color
  const changeTileColor = (tileId: string, color: string) => {
    // Don't allow changing Profile, Levi's or Spotify's color
    if (tileId === "levi-toggle" || tileId === "spotify" || tileId === "profile") return

    setTileColors((prev) => ({ ...prev, [tileId]: color }))
  }

  // Replace the changeTileSize function with this new version that shows options
  const changeTileSize = (tileId: string, size?: TileSize) => {
    if (size) {
      // If size is provided, set it directly
      setTileSizes((prev) => ({ ...prev, [tileId]: size }))
    } else {
      // Otherwise toggle through sizes as before
      setTileSizes((prev) => {
        const currentSize = prev[tileId]
        let newSize: TileSize = "small"

        if (currentSize === "small") newSize = "medium"
        else if (currentSize === "medium") newSize = "large"
        else newSize = "small"

        return { ...prev, [tileId]: newSize }
      })
    }
  }

  // Add this new state for tracking which tile is showing resize options
  const [showingResizeOptions, setShowingResizeOptions] = useState<string | null>(null)

  // Add this function to handle showing resize options
  const toggleResizeOptions = (tileId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    // Don't show resize options for Profile tile
    if (tileId === "profile") return
    setShowingResizeOptions(showingResizeOptions === tileId ? null : tileId)
    setShowingColorOptions(null) // Close color options when opening resize
  }

  // Add this function to render resize options
  const renderResizeOptions = (tileId: string) => {
    if (showingResizeOptions !== tileId) return null

    return (
      <div className="absolute top-10 left-2 bg-black/80 rounded p-2 z-30">
        <div className="flex flex-col gap-1">
          <button
            className={`px-2 py-1 rounded text-xs flex items-center ${
              tileSizes[tileId] === "small" ? "bg-white/20" : "hover:bg-white/10"
            }`}
            onClick={(e) => {
              e.stopPropagation()
              setTileSizes((prev) => ({ ...prev, [tileId]: "small" }))
              setShowingResizeOptions(null)
            }}
          >
            <div className="w-4 h-4 border border-white mr-2"></div>
            Small
          </button>
          <button
            className={`px-2 py-1 rounded text-xs flex items-center ${
              tileSizes[tileId] === "medium" ? "bg-white/20" : "hover:bg-white/10"
            }`}
            onClick={(e) => {
              e.stopPropagation()
              setTileSizes((prev) => ({ ...prev, [tileId]: "medium" }))
              setShowingResizeOptions(null)
            }}
          >
            <div className="w-8 h-4 border border-white mr-2"></div>
            Medium
          </button>
          <button
            className={`px-2 py-1 rounded text-xs flex items-center ${
              tileSizes[tileId] === "large" ? "bg-white/20" : "hover:bg-white/10"
            }`}
            onClick={(e) => {
              e.stopPropagation()
              setTileSizes((prev) => ({ ...prev, [tileId]: "large" }))
              setShowingResizeOptions(null)
            }}
          >
            <div className="w-8 h-8 border border-white mr-2"></div>
            Large
          </button>
        </div>
      </div>
    )
  }

  // Add this state for tracking which tile is showing color options
  const [showingColorOptions, setShowingColorOptions] = useState<string | null>(null)

  // Add this function to toggle color options
  const toggleColorOptions = (tileId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // Don't show color options for Profile tile
    if (tileId === "profile") return
    setShowingColorOptions(showingColorOptions === tileId ? null : tileId)
    setShowingResizeOptions(null) // Close resize options when opening color
  }

  // Add this function to render color options
  const renderColorOptions = (tileId: string) => {
    if (showingColorOptions !== tileId) return null

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

    return (
      <div className="absolute top-10 left-2 bg-black/80 rounded p-2 z-20">
        <div className="grid grid-cols-4 gap-1">
          {metroColors.map((color, index) => (
            <div
              key={index}
              className="h-6 w-6 rounded cursor-pointer hover:ring-2 hover:ring-white transition-all"
              style={{ backgroundColor: color }}
              onClick={(e) => {
                e.stopPropagation()
                changeTileColor(tileId, color)
                setShowingColorOptions(null)
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-light mb-6">{personalData.name}</h1>
            <p className="text-xl font-light">{personalData.introduction}</p>
          </div>
        )
      case "about":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-light mb-6">About</h1>
            <p className="text-xl font-light">{personalData.about}</p>
          </div>
        )
      case "skills":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-light mb-6">Skills</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {personalData.skills.map((skill, index) => {
                // Get the appropriate icon for each skill
                const getSkillIcon = (skill: string) => {
                  const skillLower = skill.toLowerCase()

                  // Check for local SVG icons first
                  const localSkillIcons: Record<string, string> = {
                    python: "/icons/python.svg",
                    "c++": "/icons/cpp.svg",
                    c: "/icons/c.svg",
                    docker: "/icons/docker.svg",
                    java: "/icons/java.svg",
                    bash: "/icons/bash.svg",
                    model: "/icons/model.svg",
                  }

                  if (localSkillIcons[skillLower]) {
                    return (
                      <img
                        src={getImagePath(localSkillIcons[skillLower] || "/placeholder.svg")}
                        alt={skill}
                        className="h-6 w-6 invert"
                      />
                    )
                  }

                  // Fallback to Lucide icons
                  if (skillLower.includes("javascript") || skillLower.includes("typescript"))
                    return <Code className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
                  if (skillLower.includes("react") || skillLower.includes("vue") || skillLower.includes("angular"))
                    return <Layout className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
                  if (skillLower.includes("node") || skillLower.includes("express"))
                    return <Server className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
                  if (skillLower.includes("html") || skillLower.includes("css") || skillLower.includes("tailwind"))
                    return <Globe className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
                  if (skillLower.includes("mongo") || skillLower.includes("sql") || skillLower.includes("postgres"))
                    return <Database className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
                  if (skillLower.includes("git")) return <GitBranch className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
                  if (skillLower.includes("docker"))
                    return <Package className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
                  if (skillLower.includes("aws") || skillLower.includes("azure") || skillLower.includes("cloud"))
                    return <Cloud className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
                  if (skillLower.includes("machine") || skillLower.includes("neural") || skillLower.includes("ai"))
                    return <Cpu className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />

                  // Default icon
                  return <Terminal className={`${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
                }

                return (
                  <div key={index} className="bg-blue-500 p-4 rounded-md flex items-center">
                    <div className="mr-3 text-white">{getSkillIcon(skill)}</div>
                    <p className="text-white text-lg">{skill}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )
      case "projects":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-light mb-6">Projects</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {personalData.projects.map((project, index) => (
                <div
                  key={index}
                  className={`bg-blue-500 p-6 rounded-md cursor-pointer transition-all duration-300 ${selectedProject === index ? "scale-105 shadow-lg" : ""}`}
                  onClick={() => setSelectedProject(selectedProject === index ? null : index)}
                >
                  <div className="flex items-center mb-2">
                    {projectIcons[index % projectIcons.length]}
                    <h2 className="text-white text-2xl ml-2">{project.title}</h2>
                  </div>

                  {selectedProject === index && (
                    <div className="mt-3 mb-4 bg-blue-600 p-3 rounded">
                      <p className="text-white opacity-90">{project.description}</p>
                    </div>
                  )}
                  {selectedProject === index && project.deployedUrl && (
                    <Link
                      href={project.deployedUrl}
                      className="flex items-center text-white hover:underline mt-2"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Globe className="h-5 w-5 mr-2" />
                      View Live
                    </Link>
                  )}

                  {project.githubUrl && (
                    <Link
                      href={project.githubUrl}
                      className="flex items-center text-white hover:underline mt-2"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="h-5 w-5 mr-2" />
                      View on GitHub
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      case "experience":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-light mb-6">Experience</h1>
            <div className="space-y-6">
              {personalData.experience.map((exp, index) => (
                <div
                  key={index}
                  className={`bg-green-600 p-6 rounded-md cursor-pointer transition-all duration-300 ${selectedExperience === index ? "scale-105 shadow-lg" : ""}`}
                  onClick={() => setSelectedExperience(selectedExperience === index ? null : index)}
                >
                  <h2 className="text-white text-2xl mb-2">{exp.company}</h2>
                  <p className="text-white opacity-90">{exp.period}</p>

                  {selectedExperience === index && (
                    <div className="mt-4 bg-green-700 p-3 rounded">
                      <p className="text-white">{exp.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      case "contributions":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-light mb-6">Open Source Contributions</h1>
            <div className="space-y-4">
              {personalData.openSourceContributions.map((contribution, index) => (
                <div
                  key={index}
                  className={`bg-purple-600 p-4 rounded-md cursor-pointer transition-all duration-300 ${selectedContribution === index ? "scale-105 shadow-lg" : ""}`}
                  onClick={() => setSelectedContribution(selectedContribution === index ? null : index)}
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-white text-xl">{contribution.title}</h2>
                    {contribution.githubUrl && (
                      <Link
                        href={contribution.githubUrl}
                        className="text-white hover:text-gray-200"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="h-5 w-5" />
                      </Link>
                    )}
                  </div>

                  {selectedContribution === index && contribution.description && (
                    <div className="mt-3 bg-purple-700 p-3 rounded">
                      <p className="text-white">{contribution.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      case "hobbies":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-light mb-6">Hobbies</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalData.hobbies.map((hobby, index) => {
                // Use the same hobby icons as in HobbiesLiveTile
                const hobbyIcons = [
                  <Camera key="camera" className="h-6 w-6 mr-3" />,
                  <BookOpen key="book" className="h-6 w-6 mr-3" />,

                  <Mountain key="mountain" className="h-6 w-6 mr-3" />,
                ]

                return (
                  <div key={index} className="bg-purple-700/50 p-4 rounded-md flex items-center">
                    {hobbyIcons[index % hobbyIcons.length]}
                    <p className="text-lg">{hobby}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )
      case "contact":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-light mb-6">Contact</h1>
            <div className="space-y-4">
              <p className="text-xl font-light">Email: {personalData.contact.email}</p>
              <p className="text-xl font-light">Phone: {personalData.contact.phone}</p>
              <p className="text-xl font-light">Location: {personalData.contact.location}</p>
              <div className="flex space-x-4 mt-6">
                {personalData.contact.social.map((social, index) => (
                  <Link
                    key={index}
                    href={social.url}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.platform === "GitHub" && <Github className="h-5 w-5 mr-2" />}
                    {social.platform === "LinkedIn" && <Linkedin className="h-5 w-5 mr-2" />}
                    {social.platform === "Twitter" && <Twitter className="h-5 w-5 mr-2" />}
                    {social.platform}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )
      case "experienceDetail":
        if (selectedExperience !== null) {
          const exp = personalData.experience[selectedExperience]
          return (
            <div className="p-6 max-w-4xl mx-auto">
              <h1 className="text-3xl font-light mb-6">{exp.company}</h1>
              <p className="text-xl font-light mb-4">{exp.period}</p>
              <div className="bg-green-700/50 p-6 rounded-md">
                <p className="text-xl">{exp.description}</p>
              </div>
            </div>
          )
        }
        return null
      case "contributionDetail":
        if (selectedContribution !== null) {
          const contribution = personalData.openSourceContributions[selectedContribution]
          return (
            <div className="p-6 max-w-4xl mx-auto">
              <div className="flex items-center mb-6">
                <h1 className="text-3xl font-light text-center sm:text-left">{contribution.title}</h1>
              </div>

              {/* Show on md and larger only */}
              <div className="hidden md:block bg-purple-700/50 p-6 rounded-md mb-6">
                <p className="text-xl text-center sm:text-left">{contribution.description}</p>
              </div>

              {/* GitHub link */}
              {contribution.githubUrl && (
                <div className="flex justify-between items-center">
                  <Link
                    href={contribution.githubUrl}
                    className="text-white hover:text-purple-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-6 w-6" />
                  </Link>

                  <Link
                    href={contribution.githubUrl}
                    className="flex items-center text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md w-fit ml-auto"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-5 w-5 mr-2" />
                    View on GitHub
                  </Link>
                </div>
              )}
            </div>
          )
        }

        return null

      case "settings":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-light mb-6">Settings</h1>

            {/* Customization options */}
            <div className="bg-black/50 rounded-md p-6 mb-6">
              <h2 className="text-2xl font-light mb-4">Customize Tiles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-lg">Default Tile Color</label>
                  <input
                    type="color"
                    value={tileColor}
                    onChange={(e) => setTileColor(e.target.value)}
                    className="w-full h-12 cursor-pointer"
                  />
                  <p className="text-xs mt-1 text-gray-400">
                    Changing this color will immediately update all tiles except for Levi Mode (always red) and Spotify
                    (always green). Individual tile colors can be customized below.
                  </p>
                </div>
                <div>
                  <label className="block mb-2 text-lg">Opacity: {tileOpacity}</label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={tileOpacity}
                    onChange={(e) => setTileOpacity(Number.parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Individual tile colors */}
              <div className="mt-6">
                <h3 className="text-lg mb-3">Individual Tile Colors</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.keys(tileColors).map((tileId) => (
                    <TileColorPicker
                      key={tileId}
                      tileId={tileId}
                      currentColor={tileColors[tileId]}
                      defaultColor={tileColor}
                      onChange={(color) => changeTileColor(tileId, color)}
                      onReset={() => changeTileColor(tileId, tileColor)}
                    />
                  ))}
                </div>
              </div>

              {/* Add layout preview */}
              <div className="mt-6">
                <h3 className="text-lg mb-3">Layout Preview</h3>
                <div className="bg-gray-900 p-3 rounded-lg">
                  <div className="grid grid-cols-4 gap-1 scale-[0.6] origin-top-left h-64 overflow-hidden">
                    {/* Row 1 - Sample tiles */}
                    <div className="rounded-md h-32" style={{ backgroundColor: tileColor, opacity: tileOpacity }}></div>
                    <div className="rounded-md h-32" style={{ backgroundColor: tileColor, opacity: tileOpacity }}></div>
                    <div className="rounded-md h-32" style={{ backgroundColor: tileColor, opacity: tileOpacity }}></div>
                    <div className="rounded-md h-32" style={{ backgroundColor: tileColor, opacity: tileOpacity }}></div>

                    {/* Row 2 - Sample tiles */}
                    <div className="rounded-md h-32" style={{ backgroundColor: tileColor, opacity: tileOpacity }}></div>
                    <div className="rounded-md h-32" style={{ backgroundColor: tileColor, opacity: tileOpacity }}></div>
                    <div className="rounded-md h-32" style={{ backgroundColor: tileColor, opacity: tileOpacity }}></div>
                    <div className="rounded-md h-32" style={{ backgroundColor: tileColor, opacity: tileOpacity }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background image options */}
            <div className="bg-black/50 rounded-md p-6">
              <h2 className="text-2xl font-light mb-4">Background Image</h2>
              <div className="flex flex-wrap gap-4 items-center">
                <button
                  onClick={triggerFileInput}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  <Upload size={18} />
                  Upload Image
                </button>
                {backgroundImage && (
                  <button
                    onClick={() => setBackgroundImage("")}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Clear Image
                  </button>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              {backgroundImage && (
                <div className="mt-4 p-2 border border-white/20 inline-block rounded">
                  <p className="text-sm mb-1">Current background:</p>
                  <div
                    className="w-32 h-24 bg-cover bg-center rounded"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                  ></div>
                </div>
              )}
            </div>

            {/* Custom Character options */}
            <div className="bg-black/50 rounded-md p-6 mt-6">
              <h2 className="text-2xl font-light mb-4">Custom Characters</h2>
              <div className="flex flex-wrap gap-4 items-center">
                <button
                  onClick={() => setShowCharacterUploader(true)}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  <User size={18} />
                  Add Character
                </button>
              </div>

              {customCharacters.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {customCharacters.map((character) => (
                    <div key={character.id} className="p-2 border border-white/20 rounded flex items-center gap-3">
                      <img
                        src={character.imageUrl || "/placeholder.svg"}
                        alt={character.name}
                        className="w-12 h-12 object-contain"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{character.name}</p>
                        <p className="text-xs text-gray-400">{character.enabled ? "Active" : "Inactive"}</p>
                      </div>
                      <button
                        onClick={() => {
                          setCustomCharacters(prev => prev.filter(c => c.id !== character.id));
                          setTileSizes(prev => {
                            const newSizes = { ...prev };
                            delete newSizes[character.id];
                            return newSizes;
                          });
                          setTileColors(prev => {
                            const newColors = { ...prev };
                            delete newColors[character.id];
                            return newColors;
                          });
                        }}
                        className="p-2 text-red-500 hover:text-red-400 transition-colors"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleCustomCharacter(character.id)}
                        className={`px-2 py-1 rounded text-xs ${
                          character.enabled ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {character.enabled ? "Disable" : "Enable"}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {showCharacterUploader && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                  <CharacterUploader
                    onSave={handleSaveCustomCharacter}
                    onCancel={() => setShowCharacterUploader(false)}
                  />
                </div>
              )}
            </div>
          </div>
        )
      default:
        return <div>Select a tile to view content</div>
    }
  }

  const handleSaveCustomCharacter = (characterData: { name: string; imageUrl: string }) => {
    const newCharacter: CustomCharacter = {
      id: `character-${Date.now()}`,
      name: characterData.name,
      imageUrl: characterData.imageUrl,
      enabled: true,
    }

    setCustomCharacters((prev) => [...prev, newCharacter])

    // Add a new tile for this character
    setTileSizes((prev) => ({
      ...prev,
      [newCharacter.id]: "small",
    }))

    setTileColors((prev) => ({
      ...prev,
      [newCharacter.id]: tileColor,
    }))

    setShowCharacterUploader(false)
  }

  const toggleCustomCharacter = (characterId: string) => {
    setCustomCharacters((prev) =>
      prev.map((char) => (char.id === characterId ? { ...char, enabled: !char.enabled } : char)),
    )
  }

  // Function to handle experience tile click
  const handleExperienceDetailClick = (index: number) => {
    setSelectedExperience(index)
    setActiveSection("experienceDetail")
  }

  // Function to handle contribution tile click
  const handleContributionDetailClick = (index: number) => {
    setSelectedContribution(index)
    setActiveSection("contributionDetail")
  }

  // Function to handle project tile click
  // const handleProjectTileClick = (index: number) => {
  //   setActiveSection("projects")
  //   // Set a timeout to allow the section to render before selecting the project
  //   setTimeout(() => {
  //     setSelectedProject(index)
  //   }, 100)
  // }

  // Function to get tile size classes
  const getTileSizeClasses = (tileId: string) => {
    const size = tileSizes[tileId]

    switch (size) {
      case "small":
        return "col-span-1 row-span-1 h-32" // Slightly taller for better content display
      case "medium":
        return "col-span-2 row-span-1 h-32" // Same height as small, double width
      case "large":
        return "col-span-2 row-span-2 h-64" // Double height of small/medium
      default:
        return "col-span-1 row-span-1 h-32"
    }
  }

  // Create a grid of tiles for the home screen
  const renderHomeTiles = () => {
    // Create an array of all tiles
    const tiles = []
    // Add project tiles
    personalData.projects.forEach((project, index) => {
      tiles.push(
        <div
          key={`project-${index}`}
          className={`rounded-md cursor-pointer p-4 relative transition-all duration-200 group ${
            activeTile === `project-${index}` ? "ring-4 ring-white" : ""
          } ${getTileSizeClasses(`project-${index}`)}`}
          onClick={() => {
            setSelectedProject(index)
            setActiveSection("projects")
          }}
          style={{ backgroundColor: tileColors[`project-${index}`] || tileColor, opacity: tileOpacity }}
          onMouseEnter={() => setActiveTile(`project-${index}`)}
          onMouseLeave={() => setActiveTile(null)}
        >
          {renderResizeOptions(`project-${index}`)}
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => toggleResizeOptions(`project-${index}`, e)}
              className="text-white hover:bg-white/20 p-1 rounded"
            >
              {tileSizes[`project-${index}`] === "small" ? (
                <Maximize2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
              ) : tileSizes[`project-${index}`] === "medium" ? (
                <Maximize2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
              ) : (
                <Minimize2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
              )}
            </button>
            <button
              onClick={(e) => toggleColorOptions(`project-${index}`, e)}
              className="text-white hover:bg-white/20 p-1 rounded"
            >
              <Palette className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            </button>
          </div>
          {renderColorOptions(`project-${index}`)}
          <div className="flex flex-col h-full">
            {/* Title and icon at the top */}
            <div className="flex items-center mb-2">
              <div className="mr-2">{projectIcons[index % projectIcons.length]}</div>
              <h2 className="text-xl font-light truncate">{project.title}</h2>
            </div>

            {/* Description - with scroll for medium and large tiles */}
            {(tileSizes[`project-${index}`] === "medium" || tileSizes[`project-${index}`] === "large") && (
              <div
                className="mt-2 overflow-auto text-sm"
                style={{ maxHeight: tileSizes[`project-${index}`] === "medium" ? "60px" : "120px" }}
              >
                <p>{project.description}</p>
              </div>
            )}

           {/* Links section at the bottom */}
<div className="mt-auto pt-2 flex items-center space-x-3">
  {/* GitHub link */}
  {project.githubUrl && (
    <button
      className="text-white hover:text-gray-200 flex items-center"
      onClick={(e) => {
        e.stopPropagation()
        window.open(project.githubUrl, "_blank")
      }}
    >
      <Github className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />
    </button>
  )}

  {/* Deployed link */}
  {project.deployedUrl && (
    <button
      className="text-white hover:text-gray-200 flex items-center"
      onClick={(e) => {
        e.stopPropagation()
        window.open(project.deployedUrl, "_blank")
      }}
    >
      <Globe className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} mr-1`} />
    </button>
  )}
</div>

          </div>
        </div>,
      )
    })

    // Add experience tiles
    personalData.experience.forEach((exp, index) => {
      tiles.push(
        <div
          key={`exp-${index}`}
          className={`rounded-md cursor-pointer flex flex-col justify-between p-4 relative transition-all duration-200 group ${
            activeTile === `exp-${index}` ? "ring-4 ring-white" : ""
          } ${getTileSizeClasses(`exp-${index}`)}`}
          onClick={() => handleExperienceDetailClick(index)}
          style={{ backgroundColor: tileColors[`exp-${index}`] || "#2E8B57", opacity: tileOpacity }}
          onMouseEnter={() => setActiveTile(`exp-${index}`)}
          onMouseLeave={() => setActiveTile(null)}
        >
          {renderResizeOptions(`exp-${index}`)}
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleResizeOptions(`exp-${index}`, e)
              }}
              className="text-white hover:bg-white/20 p-1 rounded"
            >
              {tileSizes[`exp-${index}`] === "small" ? (
                <Maximize2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
              ) : tileSizes[`exp-${index}`] === "medium" ? (
                <Maximize2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
              ) : (
                <Minimize2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleColorOptions(`exp-${index}`, e)
              }}
              className="text-white hover:bg-white/20 p-1 rounded"
            >
              <Palette className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            </button>
          </div>
          {renderColorOptions(`exp-${index}`)}

          <div className="flex flex-col h-full w-full overflow-hidden">
            <div className="flex items-center mb-2">
              <Briefcase className="h-5 w-5 mr-2 flex-shrink-0" />
              <h3 className="text-lg font-light truncate">{exp.company}</h3>
            </div>
            <div>
              <p className="text-xs opacity-70 truncate">{exp.period}</p>
            </div>

            {/* Description - only show for medium or large tiles */}
            {(tileSizes[`exp-${index}`] === "medium" || tileSizes[`exp-${index}`] === "large") && exp.description && (
              <div className="mt-2 flex-grow overflow-hidden">
                <p className="text-sm line-clamp-3">{exp.description}</p>
              </div>
            )}
          </div>
        </div>,
      )
    })
    personalData.openSourceContributions.forEach((contribution, index) => {
      tiles.push(
        <div
          key={`contrib-${index}`}
          className={`rounded-md cursor-pointer p-4 relative transition-all duration-200 group ${
            activeTile === `contrib-${index}` ? "ring-4 ring-white" : ""
          } ${getTileSizeClasses(`contrib-${index}`)}`}
          onClick={() => handleContributionDetailClick(index)}
          style={{ backgroundColor: tileColors[`contrib-${index}`] || "#8A2BE2", opacity: tileOpacity }}
          onMouseEnter={() => setActiveTile(`contrib-${index}`)}
          onMouseLeave={() => setActiveTile(null)}
        >
          {renderResizeOptions(`contrib-${index}`)}
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => toggleResizeOptions(`contrib-${index}`, e)}
              className="text-white hover:bg-white/20 p-1 rounded"
            >
              {tileSizes[`contrib-${index}`] === "small" ? (
                <Maximize2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
              ) : tileSizes[`contrib-${index}`] === "medium" ? (
                <Maximize2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
              ) : (
                <Minimize2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
              )}
            </button>
            <button
              onClick={(e) => toggleColorOptions(`contrib-${index}`, e)}
              className="text-white hover:bg-white/20 p-1 rounded"
            >
              <Palette className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            </button>
          </div>
          {renderColorOptions(`contrib-${index}`)}
          <div className="flex flex-col h-full">
            {/* Icon and title - updated to horizontal layout */}
            <div className="flex items-center mb-2">
              <div className="mr-2">
                <Code className={`${isMobile ? "h-6 w-6" : "h-8 w-8"}`} />
              </div>
              <h2 className="text-xl font-light truncate">{contribution.title}</h2>
            </div>

            {/* Description - with scroll for medium and large tiles */}
            {(tileSizes[`contrib-${index}`] === "medium" || tileSizes[`contrib-${index}`] === "large") && (
              <div
                className="mt-2 overflow-auto text-sm"
                style={{ maxHeight: tileSizes[`contrib-${index}`] === "medium" ? "60px" : "120px" }}
              >
                <p>{contribution.description}</p>
              </div>
            )}

            {/* GitHub link */}
            <div className="mt-auto pt-2 flex items-center">
              {contribution.githubUrl && (
                <Link
                  href={contribution.githubUrl}
                  className="text-white hover:text-gray-200 flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} mr-1`} />
                  <span className="text-xs">GitHub</span>
                </Link>
              )}
            </div>
          </div>
        </div>,
      )
    })

    // Add custom character tiles
    customCharacters.forEach((character) => {
      tiles.push(
        <div
          key={character.id}
          className={`rounded-md cursor-pointer relative transition-all duration-200 group ${
            activeTile === character.id ? "ring-4 ring-white" : ""
          } ${getTileSizeClasses(character.id)}`}
          onClick={() => toggleCustomCharacter(character.id)}
          style={{ backgroundColor: tileColors[character.id] || tileColor, opacity: tileOpacity }}
          onMouseEnter={() => setActiveTile(character.id)}
          onMouseLeave={() => setActiveTile(null)}
        >
          {renderResizeOptions(character.id)}
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => toggleResizeOptions(character.id, e)}
              className="text-white hover:bg-white/20 p-1 rounded"
            >
              {tileSizes[character.id] === "small" ? (
                <Maximize2 className="h-4 w-4" />
              ) : tileSizes[character.id] === "medium" ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={(e) => toggleColorOptions(character.id, e)}
              className="text-white hover:bg-white/20 p-1 rounded"
            >
              <Palette className="h-4 w-4" />
            </button>
          </div>
          {renderColorOptions(character.id)}
          <CustomCharacterTile
            character={character}
            isEnabled={character.enabled}
            size={tileSizes[character.id] || "small"}
          />
        </div>,
      )
    })

    // Add skills live tile
    tiles.push(
      <div
        key="skills"
        className={`rounded-md cursor-pointer p-4 flex flex-col items-center justify-center relative transition-all duration-200 group ${
          activeTile === "skills" ? "ring-4 ring-white" : ""
        } ${getTileSizeClasses("skills")}`}
        onClick={() => setActiveSection("skills")}
        style={{ backgroundColor: tileColors["skills"] || tileColor, opacity: tileOpacity }}
        onMouseEnter={() => setActiveTile("skills")}
        onMouseLeave={() => setActiveTile(null)}
      >
        <div className={`absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
          <button
            onClick={(e) => toggleResizeOptions("skills", e)}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          <button onClick={(e) => toggleColorOptions("skills", e)} className="text-white hover:bg-white/20 p-1 rounded">
            <Palette className="h-4 w-4" />
          </button>
        </div>

        {renderResizeOptions("skills")}
        {renderColorOptions("skills")}

        <SkillsTile skills={personalData.skills} />
      </div>,
    )

    // Add the new Operating Systems tile
    tiles.push(
      <div
        key="operating-systems"
        className={`rounded-md cursor-pointer relative transition-all duration-200 group ${
          activeTile === "operating-systems" ? "ring-4 ring-white" : ""
        } ${getTileSizeClasses("operating-systems")}`}
        style={{ backgroundColor: tileColors["operating-systems"] || tileColor, opacity: tileOpacity }}
        onMouseEnter={() => setActiveTile("operating-systems")}
        onMouseLeave={() => setActiveTile(null)}
      >
        {renderResizeOptions("operating-systems")}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => toggleResizeOptions("operating-systems", e)}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            {tileSizes["operating-systems"] === "small" ? (
              <Maximize2 className="h-4 w-4" />
            ) : tileSizes["operating-systems"] === "medium" ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={(e) => toggleColorOptions("operating-systems", e)}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            <Palette className="h-4 w-4" />
          </button>
        </div>
        {renderColorOptions("operating-systems")}

        <OperatingSystemsTile operatingSystems={["Windows", "Arch", "macOS"]} />
      </div>,
    )

    
    // Add Profile Tile
    tiles.push(
      <div
        key="profile"
        className={`rounded-md cursor-pointer relative transition-all duration-200 group ${
          activeTile === "profile" ? "ring-4 ring-white" : ""
        } ${getTileSizeClasses("profile")}`}
        style={{ backgroundColor: tileColors["profile"], opacity: tileOpacity }}
        onMouseEnter={() => setActiveTile("profile")}
        onMouseLeave={() => setActiveTile(null)}
      >
        {renderResizeOptions("profile")}
        <div className="absolute top-2 right-2 flex space-x-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => toggleResizeOptions("profile", e)}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            {tileSizes["profile"] === "small" ? (
              <Maximize2 className="h-4 w-4" />
            ) : tileSizes["profile"] === "medium" ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
        </div>
        <ProfileTile />
      </div>,
    )

    // Add Spotify Music Tile
    tiles.push(
      <div
        key="spotify"
        className={`rounded-md cursor-pointer relative transition-all duration-200 group ${
          activeTile === "spotify" ? "ring-4 ring-white" : ""
        } ${getTileSizeClasses("spotify")}`}
        style={{ backgroundColor: "#1DB954", opacity: tileOpacity }} // Always use Spotify green
        onMouseEnter={() => setActiveTile("spotify")}
        onMouseLeave={() => setActiveTile(null)}
      >
        {renderResizeOptions("spotify")}
        <div className="absolute top-2 right-2 flex space-x-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => toggleResizeOptions("spotify", e)}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            {tileSizes["spotify"] === "small" ? (
              <Maximize2 className="h-4 w-4" />
            ) : tileSizes["spotify"] === "medium" ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
          {/* No color picker for Spotify */}
        </div>
        <SpotifyTile size={tileSizes["spotify"]} />
      </div>,
    )

    // Add Hobbies Live Tile
    tiles.push(
      <div
        key="hobbies-live"
        className={`rounded-md cursor-pointer relative transition-all duration-200 group ${
          activeTile === "hobbies-live" ? "ring-4 ring-white" : ""
        } ${getTileSizeClasses("hobbies-live")}`}
        onClick={() => setActiveSection("hobbies")}
        style={{ backgroundColor: tileColors["hobbies-live"] || "#8B5CF6", opacity: tileOpacity }}
        onMouseEnter={() => setActiveTile("hobbies-live")}
        onMouseLeave={() => setActiveTile(null)}
      >
        {renderResizeOptions("hobbies-live")}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleResizeOptions("hobbies-live", e)
            }}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            {tileSizes["hobbies-live"] === "small" ? (
              <Maximize2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            ) : tileSizes["hobbies-live"] === "medium" ? (
              <Maximize2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            ) : (
              <Minimize2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleColorOptions("hobbies-live", e)
            }}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            <Palette className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
          </button>
        </div>
        {renderColorOptions("hobbies-live")}
        <HobbiesLiveTile hobbies={personalData.hobbies} />
      </div>,
    )

    // Add Activity Live Tile
    tiles.push(
      <div
        key="activity"
        className={`rounded-md cursor-pointer relative transition-all duration-200 group ${
          activeTile === "activity" ? "ring-4 ring-white" : ""
        } ${getTileSizeClasses("activity")}`}
        style={{ backgroundColor: tileColors["activity"], opacity: tileOpacity }}
        onMouseEnter={() => setActiveTile("activity")}
        onMouseLeave={() => setActiveTile(null)}
      >
        {renderResizeOptions("activity")}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => toggleResizeOptions("activity", e)}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            {tileSizes["activity"] === "small" ? (
              <Maximize2 className="h-4 w-4" />
            ) : tileSizes["activity"] === "medium" ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
        </div>
        <ActivityTile username="RushiChaganti" />
      </div>,
    )
    // Add about tile
    tiles.push(
      <div
        key="about"
        className={`rounded-md cursor-pointer p-4 relative transition-all duration-200 group ${
          activeTile === "about" ? "ring-4 ring-white" : ""
        } ${getTileSizeClasses("about")}`}
        onClick={() => setActiveSection("about")}
        style={{ backgroundColor: tileColors["about"], opacity: tileOpacity }}
        onMouseEnter={() => setActiveTile("about")}
        onMouseLeave={() => setActiveTile(null)}
      >
        {renderResizeOptions("about")}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => toggleResizeOptions("about", e)} className="text-white hover:bg-white/20 p-1 rounded">
            {tileSizes["about"] === "small" ? (
              <Maximize2 className="h-4 w-4" />
            ) : tileSizes["about"] === "medium" ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
          <button onClick={(e) => toggleColorOptions("about", e)} className="text-white hover:bg-white/20 p-1 rounded">
            <Palette className="h-4 w-4" />
          </button>
        </div>
        {renderColorOptions("about")}
        <div className="flex flex-col h-full">
          <h2 className="text-2xl font-light text-center">ABOUT</h2>

          {/* Show about content when tile is medium or large */}
          {(tileSizes["about"] === "medium" || tileSizes["about"] === "large") && (
            <div className="mt-2 overflow-auto text-sm">
              <p>{personalData.about}</p>
            </div>
          )}
        </div>
      </div>,
    )

    // Add contact tile
    tiles.push(
      <div
        key="contact"
        className={`rounded-md cursor-pointer p-4 relative transition-all duration-200 group ${
          activeTile === "contact" ? "ring-4 ring-white" : ""
        } ${getTileSizeClasses("contact")}`}
        onClick={() => setActiveSection("contact")}
        style={{ backgroundColor: tileColors["contact"], opacity: tileOpacity }}
        onMouseEnter={() => setActiveTile("contact")}
        onMouseLeave={() => setActiveTile(null)}
      >
        {renderResizeOptions("contact")}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => toggleResizeOptions("contact", e)}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            {tileSizes["contact"] === "small" ? (
              <Maximize2 className="h-4 w-4" />
            ) : tileSizes["contact"] === "medium" ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={(e) => toggleColorOptions("contact", e)}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            <Palette className="h-4 w-4" />
          </button>
        </div>
        {renderColorOptions("contact")}
        <div className="flex flex-col h-full">
          <h2 className="text-2xl font-light text-center">CONTACT</h2>

          {/* Show phone number when tile is medium or large */}
          {(tileSizes["contact"] === "medium" || tileSizes["contact"] === "large") && (
            <div className="mt-2 text-center">
              <p className="text-sm">{personalData.contact.phone}</p>
            </div>
          )}
        </div>
      </div>,
    )

    // Add resume tile
    tiles.push(
      <div
        key="resume"
        className={`rounded-md cursor-pointer flex flex-col items-center justify-center p-4 relative transition-all duration-200 group ${
          activeTile === "resume" ? "ring-4 ring-white" : ""
        } ${getTileSizeClasses("resume")}`}
        onClick={() => {
          window.open(getImagePath("/Rushi_chaganti.pdf"), "_blank")
        }}
        
        style={{ backgroundColor: tileColors["resume"], opacity: tileOpacity }}
        onMouseEnter={() => setActiveTile("resume")}
        onMouseLeave={() => setActiveTile(null)}
      >
        {renderResizeOptions("resume")}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => toggleResizeOptions("resume", e)}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            {tileSizes["resume"] === "small" ? (
              <Maximize2 className="h-4 w-4" />
            ) : tileSizes["resume"] === "medium" ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
          <button onClick={(e) => toggleColorOptions("resume", e)} className="text-white hover:bg-white/20 p-1 rounded">
            <Palette className="h-4 w-4" />
          </button>
        </div>
        {renderColorOptions("resume")}
        <FileText className="h-8 w-8 mb-2" />
        <h2 className="text-xl font-light text-center">Resume</h2>
      </div>,
    )

    // Add clock tile
    tiles.push(
      <div
        key="clock"
        className={`rounded-md relative transition-all duration-200 group ${
          activeTile === "clock" ? "ring-4 ring-white" : ""
        } ${getTileSizeClasses("clock")}`}
        style={{ backgroundColor: tileColors["clock"], opacity: tileOpacity }}
        onMouseEnter={() => setActiveTile("clock")}
        onMouseLeave={() => setActiveTile(null)}
      >
        {renderResizeOptions("clock")}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => toggleResizeOptions("clock", e)} className="text-white hover:bg-white/20 p-1 rounded">
            {tileSizes["clock"] === "small" ? (
              <Maximize2 className="h-4 w-4" />
            ) : tileSizes["clock"] === "medium" ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
          <button onClick={(e) => toggleColorOptions("clock", e)} className="text-white hover:bg-white/20 p-1 rounded">
            <Palette className="h-4 w-4" />
          </button>
        </div>
        {renderColorOptions("clock")}
        <ClockTile tileColor={tileColors["clock"]} tileOpacity={tileOpacity} />
      </div>,
    )

    // Add date tile
    tiles.push(
      <div
        key="date"
        className={`rounded-md flex flex-col items-center justify-center p-4 relative transition-all duration-200 group ${
          activeTile === "date" ? "ring-4 ring-white" : ""
        } ${getTileSizeClasses("date")}`}
        style={{ backgroundColor: tileColors["date"], opacity: tileOpacity }}
        onMouseEnter={() => setActiveTile("date")}
        onMouseLeave={() => setActiveTile(null)}
      >
        {renderResizeOptions("date")}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => toggleResizeOptions("date", e)} className="text-white hover:bg-white/20 p-1 rounded">
            {tileSizes["date"] === "small" ? (
              <Maximize2 className="h-4 w-4" />
            ) : tileSizes["date"] === "medium" ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
          <button onClick={(e) => toggleColorOptions("date", e)} className="text-white hover:bg-white/20 p-1 rounded">
            <Palette className="h-4 w-4" />
          </button>
        </div>
        {renderColorOptions("date")}
        <p className="text-2xl font-light">{formatDate(currentTime)}</p>
        <p className="text-xl font-light">{formatDay(currentTime)}</p>
      </div>,
    )

    // Add social tiles
    tiles.push(
      <div
        key="github"
        className={`rounded-md cursor-pointer flex flex-col items-center justify-center p-4 relative transition-all duration-200 group ${
          activeTile === "github" ? "ring-4 ring-white" : ""
        } ${getTileSizeClasses("github")}`}
        onClick={() => window.open(personalData.contact.social[0].url, "_blank")}
        style={{ backgroundColor: tileColors["github"] || tileColor, opacity: tileOpacity }}
        onMouseEnter={() => setActiveTile("github")}
        onMouseLeave={() => setActiveTile(null)}
      >
        {renderResizeOptions("github")}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => toggleResizeOptions("github", e)}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            {tileSizes["github"] === "small" ? (
              <Maximize2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            ) : tileSizes["github"] === "medium" ? (
              <Maximize2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            ) : (
              <Minimize2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            )}
          </button>
          <button onClick={(e) => toggleColorOptions("github", e)} className="text-white hover:bg-white/20 p-1 rounded">
            <Palette className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
          </button>
        </div>
        {renderColorOptions("github")}
        <Github className={`${isMobile ? "h-6 w-6" : "h-8 w-8"} mb-2`} />
        <h2 className="text-xl font-light text-center">GitHub</h2>
      </div>,
    )

    // Add LinkedIn tile
    tiles.push(
      <div
        key="linkedin"
        className={`rounded-md cursor-pointer flex flex-col items-center justify-center p-4 relative transition-all duration-200 group ${
          activeTile === "linkedin" ? "ring-4 ring-white" : ""
        } ${getTileSizeClasses("linkedin")}`}
        onClick={() => window.open(personalData.contact.social[1].url, "_blank")}
        style={{ backgroundColor: tileColors["linkedin"] || tileColor, opacity: tileOpacity }}
        onMouseEnter={() => setActiveTile("linkedin")}
        onMouseLeave={() => setActiveTile(null)}
      >
        {renderResizeOptions("linkedin")}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => toggleResizeOptions("linkedin", e)}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            {tileSizes["linkedin"] === "small" ? (
              <Maximize2 className="h-4 w-4" />
            ) : tileSizes["linkedin"] === "medium" ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={(e) => toggleColorOptions("linkedin", e)}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            <Palette className="h-4 w-4" />
          </button>
        </div>
        {renderColorOptions("linkedin")}
        <Linkedin className="h-8 w-8 mb-2" />
        <h2 className="text-xl font-light text-center">LinkedIn</h2>
      </div>,
    )

    // Add Twitter tile
    tiles.push(
      <div
        key="twitter"
        className={`rounded-md cursor-pointer flex flex-col items-center justify-center p-4 relative transition-all duration-200 group ${
          activeTile === "twitter" ? "ring-4 ring-white" : ""
        } ${getTileSizeClasses("twitter")}`}
        onClick={() => window.open(personalData.contact.social[2].url, "_blank")}
        style={{ backgroundColor: tileColors["twitter"], opacity: tileOpacity }}
        onMouseEnter={() => setActiveTile("twitter")}
        onMouseLeave={() => setActiveTile(null)}
      >
        {renderResizeOptions("twitter")}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => toggleResizeOptions("twitter", e)}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            {tileSizes["twitter"] === "small" ? (
              <Maximize2 className="h-4 w-4" />
            ) : tileSizes["twitter"] === "medium" ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
        </div>
        <Twitter className="h-8 w-8 mb-2" />
        <h2 className="text-xl font-light text-center">Twitter</h2>
      </div>,
    )

    // Add Instagram tile
    tiles.push(
      <div
        key="instagram"
        className={`rounded-md cursor-pointer flex flex-col items-center justify-center p-4 relative transition-all duration-200 group ${
          activeTile === "instagram" ? "ring-4 ring-white" : ""
        } ${getTileSizeClasses("instagram")}`}
        onClick={() => window.open("https://www.instagram.com/rushi_chaganti/", "_blank")}
        style={{ backgroundColor: tileColors["instagram"], opacity: tileOpacity }}
        onMouseEnter={() => setActiveTile("instagram")}
        onMouseLeave={() => setActiveTile(null)}
      >
        {renderResizeOptions("instagram")}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => toggleResizeOptions("instagram", e)}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            {tileSizes["instagram"] === "small" ? (
              <Maximize2 className="h-4 w-4" />
            ) : tileSizes["instagram"] === "medium" ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={(e) => toggleColorOptions("instagram", e)}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            <Palette className="h-4 w-4" />
          </button>
        </div>
        {renderColorOptions("instagram")}

        {/* For medium and large sizes, show description */}
        {(tileSizes["instagram"] === "medium" || tileSizes["instagram"] === "large") && (
          <div className="text-center mb-2">
            <p className="text-sm">Follow me on Instagram for photos of my adventures and daily life</p>
          </div>
        )}

        {/* Always show icon and title */}
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 mb-2 flex items-center justify-center">
            {/* Instagram icon - using a custom SVG since Lucide doesn't have Instagram */}
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <circle cx="12" cy="12" r="4"></circle>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </div>
          <h2 className="text-xl font-light text-center">Instagram</h2>
        </div>
      </div>,
    )

    // Add settings tile
    tiles.push(
      <div
        key="settings"
        className={`rounded-md cursor-pointer flex flex-col items-center justify-center p-4 relative transition-all duration-200 group ${
          activeTile === "settings" ? "ring-4 ring-white" : ""
        } ${getTileSizeClasses("settings")}`}
        onClick={() => setActiveSection("settings")}
        style={{ backgroundColor: tileColors["settings"], opacity: tileOpacity }}
        onMouseEnter={() => setActiveTile("settings")}
        onMouseLeave={() => setActiveTile(null)}
      >
        {renderResizeOptions("settings")}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => toggleResizeOptions("settings", e)}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            {tileSizes["settings"] === "small" ? (
              <Maximize2 className="h-4 w-4" />
            ) : tileSizes["settings"] === "medium" ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
        </div>
        <Settings className="h-8 w-8 mb-2" />
        <h2 className="text-xl font-light text-center">Settings</h2>
      </div>,
    )

    // Add the Chess tile
    tiles.push(
      <div
        key="chess"
        className={`rounded-md cursor-pointer relative transition-all duration-200 group ${
          activeTile === "chess" ? "ring-4 ring-white" : ""
        } ${getTileSizeClasses("chess")}`}
        style={{ backgroundColor: tileColors["chess"] || tileColor, opacity: tileOpacity }}
        onMouseEnter={() => setActiveTile("chess")}
        onMouseLeave={() => setActiveTile(null)}
      >
        {renderResizeOptions("chess")}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => toggleResizeOptions("chess", e)} className="text-white hover:bg-white/20 p-1 rounded">
            {tileSizes["chess"] === "small" ? (
              <Maximize2 className="h-4 w-4" />
            ) : tileSizes["chess"] === "medium" ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
          <button onClick={(e) => toggleColorOptions("chess", e)} className="text-white hover:bg-white/20 p-1 rounded">
            <Palette className="h-4 w-4" />
          </button>
        </div>
        {renderColorOptions("chess")}

        <ChessTile username="rushichaganti" />
      </div>,
    )

    // Add Levi toggle tile with fixed color
    tiles.push(
      <div
        key="levi-toggle"
        className={`rounded-md cursor-pointer flex flex-col items-center justify-center p-4 relative transition-all duration-200 group ${
          activeTile === "levi-toggle" ? "ring-4 ring-white" : ""
        } ${getTileSizeClasses("levi-toggle")}`}
        onClick={() => setShowLevi((prev) => !prev)}
        style={{ backgroundColor: "#8B0000", opacity: tileOpacity }} // Always use red color, ignore tileColors
        onMouseEnter={() => setActiveTile("levi-toggle")}
        onMouseLeave={() => setActiveTile(null)}
      >
        {renderResizeOptions("levi-toggle")}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => toggleResizeOptions("levi-toggle", e)}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            {tileSizes["levi-toggle"] === "small" ? (
              <Maximize2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            ) : tileSizes["levi-toggle"] === "medium" ? (
              <Maximize2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            ) : (
              <Minimize2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            )}
          </button>
          {/* No color picker for Levi */}
        </div>

        <div className="flex flex-col items-center">
          <div className="h-8 w-8 mb-2" />
          <h2 className="text-xl font-light text-center">Levi Mode</h2>
          <p className="text-xs mt-1">{showLevi ? "ON" : "OFF"}</p>
        </div>
      </div>,
    )

    return tiles
  }

  // Update the useEffect hook to handle both Levi and Spotify special colors
  useEffect(() => {
    // Create a new object to avoid direct state mutation
    const updatedTileColors = { ...tileColors }

    // For each tile, update to the new default color except for special tiles
    Object.keys(tileSizes).forEach((tileId) => {
      // Skip the Levi tile which should always remain red
      if (tileId === "levi-toggle") {
        updatedTileColors[tileId] = "#8B0000" // Ensure Levi is always red
        return
      }

      // Skip the Spotify tile which should always remain green
      if (tileId === "spotify") {
        updatedTileColors[tileId] = "#1DB954" // Ensure Spotify is always green
        return
      }

      // Update the tile color to the new default
      updatedTileColors[tileId] = tileColor
    })

    // Update the state with the new colors
    setTileColors(updatedTileColors)
  }, [tileColor, tileSizes]) // Include tileSizes to ensure all tiles are covered

  // Add useEffect for keyboard event handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && activeSection !== "home") {
        setActiveSection("home")
        // Reset any selected items when returning to home
        setSelectedProject(null)
        setSelectedExperience(null)
        setSelectedContribution(null)
      }
    }

    // Add event listener when component mounts
    window.addEventListener("keydown", handleKeyDown)

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [activeSection]) // Re-run effect when activeSection changes

  return (
    <main
      className="min-h-screen bg-gray-900 text-white font-light"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Add Levi character */}
      <LeviCharacter enabled={showLevi} />

      {/* Render all enabled custom characters */}
      {customCharacters.map(
        (character) =>
          character.enabled && (
            <CustomCharacter key={character.id} enabled={character.enabled} characterData={character} />
          ),
      )}

      {activeSection === "home" ? (
        <div className="p-4 max-w-6xl mx-auto">
          {/* Windows Phone style grid - adjust for mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 auto-rows-auto">{renderHomeTiles()}</div>
        </div>
      ) : (
        <div>
          <div className="bg-black p-4 flex justify-between items-center">
            <button onClick={() => setActiveSection("home")} className="text-white text-xl">
              ← Back
            </button>
            <p className="text-white text-xl">{activeSection.toUpperCase()}</p>
          </div>
          {renderContent()}
        </div>
      )}
    </main>
  )
}
