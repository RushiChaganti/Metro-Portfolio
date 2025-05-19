"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react"

interface SpotifyTileProps {
  size?: "small" | "medium" | "large"
}

const SpotifyTile: React.FC<SpotifyTileProps> = ({ size = "large" }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Set initial volume to 0.6
  const [volume, setVolume] = useState(0.6)
  const [prevVolume, setPrevVolume] = useState(0.6)
  const [isMuted, setIsMuted] = useState(false)

  const tracks = [
    {
      name: "Lose Yourself",
      artist: "Eminem",
      src: "https://dn721802.ca.archive.org/0/items/01.-eminem-lose-yourself/01.%20Eminem%20-%20Lose%20Yourself.mp3",
    },
    {
      name: "Without Me",
      artist: "Eminem",
      src: "https://dn721805.ca.archive.org/0/items/eminem-w/Eminem%20-%20Without%20Me%20%28Official%20Music%20Video%29.mp3",
    },
    {
      name: "Tank! (TV Edit)",
      artist: "Cowboy Bebop",
      src: "https://ia802305.us.archive.org/35/items/Cowboy-Bebop-OST-Collection/Cowboy%20Bebop%20OST%20Collection/Cowboy%20Bebop%20CD-BOX%20Original%20Sound%20Track%20Limited%20Edition/Disc%201/02.%20Seatbelts%20-%20Tank%21%20%28TV%20Edit%29.mp3",
    },
    {
      name: "L's Theme",
      artist: "Death Note",
      src: "https://ia800202.us.archive.org/6/items/LsTheme/L.mp3",
    },

  ];

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio(tracks[currentTrack].src)
    audioRef.current.volume = volume

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    // Change track
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = tracks[currentTrack].src
      audioRef.current.load()
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [currentTrack])

  useEffect(() => {
    // Play/pause handler
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  useEffect(() => {
    // Volume change handler
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length)
  }

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev === 0 ? tracks.length - 1 : prev - 1))
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (isMuted && newVolume > 0) {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false)
    } else {
      setPrevVolume(volume)
      setIsMuted(true)
    }
  }

  return (
    <div className={`w-full h-full ${size === "small" ? "p-2" : "p-4"} flex flex-col justify-between`}>
      <div className="space-y-1">
        <div className="flex items-center">
          {/* Spotify Logo */}
          <svg className={`${size === "small" ? "h-4 w-4" : "h-6 w-6"} mr-2`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          <h2 className={`${size === "small" ? "text-sm" : "text-xl"} font-light`}>Spotify</h2>
        </div>
        {size !== "small" && (
          <p className="text-sm text-white-400">A mix of my favorite tracks from rap to anime OSTs</p>
        )}
      </div>

      {/* Track info and controls */}
      <div className="flex justify-between items-center mt-2">
        <div className={size === "small" ? "w-1/2" : "w-3/5"}>
          {size !== "small" && (
            <>
              <p className={`${size === "medium" ? "text-base" : "text-lg"} font-medium truncate`}>{tracks[currentTrack].name}</p>
              <p className="text-sm opacity-70 truncate">{tracks[currentTrack].artist}</p>
            </>
          )}
          {size === "small" && (
            <p className="text-xs truncate">{tracks[currentTrack].name}</p>
          )}
        </div>

        <div className={`flex items-center ${size === "small" ? "space-x-1" : "space-x-2"}`}>
          <button className={`${size === "small" ? "p-1" : "p-1"} hover:bg-white/10 rounded-full transition-colors`} onClick={prevTrack}>
            <SkipBack className={`${size === "small" ? "h-3 w-3" : "h-4 w-4"}`} />
          </button>

          <button
            className={`${size === "small" ? "p-1" : "p-2"} bg-[#1DB954] text-black rounded-full hover:scale-105 transition-transform`}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className={`${size === "small" ? "h-3 w-3" : "h-5 w-5"}`} />
            ) : (
              <Play className={`${size === "small" ? "h-3 w-3" : "h-5 w-5"}`} />
            )}
          </button>

          <button className={`${size === "small" ? "p-1" : "p-1"} hover:bg-white/10 rounded-full transition-colors`} onClick={nextTrack}>
            <SkipForward className={`${size === "small" ? "h-3 w-3" : "h-4 w-4"}`} />
          </button>
        </div>
      </div>

      {size === "large" && (
        <div className="flex items-center mt-4">
          <button onClick={toggleMute} className="hover:bg-white/10 p-1 rounded-full transition-colors">
            {isMuted ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}
    </div>
  )
}

export default SpotifyTile
