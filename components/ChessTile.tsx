"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Trophy, X, Swords } from "lucide-react"
import Image from "next/image"

interface ChessGame {
  url: string
  pgn: string
  time_control: string
  end_time: number
  rated: boolean
  tcn: string
  uuid: string
  white: {
    username: string
    rating: number
    result: string
  }
  black: {
    username: string
    rating: number
    result: string
  }
}

interface ChessGamesResponse {
  games: ChessGame[]
}

interface ChessTileProps {
  username: string
}

const ChessTile: React.FC<ChessTileProps> = ({ username }) => {
  const [games, setGames] = useState<ChessGame[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentGameIndex, setCurrentGameIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showAllGames, setShowAllGames] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const fetchChessComActivity = async () => {
      try {
        setLoading(true)
    
        const response = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`)
        if (!response.ok) throw new Error(`Chess.com API error: ${response.status}`)
    
        const archivesData = await response.json()
        const archiveUrls: string[] = archivesData.archives
    
        if (!archiveUrls || archiveUrls.length === 0) {
          setGames([])
          setLoading(false)
          return
        }
    
        // Get the last 3 archives or fewer if not available
        const recentArchiveUrls = archiveUrls.slice(-3)
        const allGames: ChessGame[] = []
    
        for (const archiveUrl of recentArchiveUrls) {
          const gamesRes = await fetch(archiveUrl)
          if (gamesRes.ok) {
            const archive: ChessGamesResponse = await gamesRes.json()
            allGames.push(...archive.games)
          }
        }
    
        // Sort games by end_time descending and pick most recent 10
        allGames.sort((a, b) => b.end_time - a.end_time)
    
        setGames(allGames.slice(0, 10))
        setLoading(false)
      } catch (err) {
        console.error("Error fetching Chess.com activity:", err)
        setError("Failed to load Chess.com games")
        setLoading(false)
      }
    }
    
    fetchChessComActivity()
  }, [username])

  // Only run the animation effect after component has mounted on client
  useEffect(() => {
    if (!mounted || games.length === 0 || showAllGames) return;
    
    const gameInterval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentGameIndex((prevIndex) => (prevIndex + 1) % Math.min(games.length, 5))
        setIsAnimating(false)
      }, 500)
    }, 5000)

    return () => clearInterval(gameInterval)
  }, [games, showAllGames, mounted])

  // Add ESC key handler to close expanded view
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showAllGames) {
        setShowAllGames(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showAllGames])

  // Render a loading state until client-side code takes over
  if (!mounted) {
    return (
      <div className="w-full h-full p-4 flex flex-col justify-between">
        <h2 className="text-xl font-light mb-2">Chess</h2>
        <div className="flex items-center justify-center h-full">
          <div className="h-6 w-6 border-t-2 border-white"></div>
        </div>
      </div>
    )
  }

  const formatTimeControl = (timeControl: string) => {
    // Format time control like "600" to "10 min"
    if (timeControl.includes("+")) {
      const [base, increment] = timeControl.split("+")
      return `${Math.floor(parseInt(base) / 60)} min + ${increment} sec`
    } else {
      return `${Math.floor(parseInt(timeControl) / 60)} min`
    }
  }

  const formatDate = (timestamp: number) => {
    if (!mounted) return ""; // Return empty string during server-side rendering
    
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getGameResult = (game: ChessGame) => {
    const isPlayerWhite = game.white.username.toLowerCase() === username.toLowerCase()
    const playerResult = isPlayerWhite ? game.white.result : game.black.result
    
    if (playerResult === "win") return "Won"
    if (playerResult === "checkmated" || playerResult === "resigned" || 
        playerResult === "timeout" || playerResult === "abandoned") return "Lost"
    return "Draw"
  }

  const getResultColor = (result: string) => {
    if (result === "Won") return "text-green-400"
    if (result === "Lost") return "text-red-400"
    return "text-yellow-400"
  }

  const handleTileClick = () => {
    setShowAllGames(true)
  }

  if (loading) {
    return (
      <div className="w-full h-full p-4 flex flex-col justify-between">
        <h2 className="text-xl font-light mb-2">Chess</h2>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-full p-4 flex flex-col justify-between">
        <h2 className="text-xl font-light mb-2">Chess</h2>
        <div className="flex items-center justify-center">
          <p className="text-sm opacity-70">{error}</p>
        </div>
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="w-full h-full p-4 flex flex-col justify-between">
        <h2 className="text-xl font-light mb-2">Chess</h2>
        <div className="flex items-center justify-center">
          <p className="text-sm opacity-70">No recent games</p>
        </div>
      </div>
    )
  }

  if (showAllGames) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 overflow-auto p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 relative">
                <Image src="/icons/chess.svg" alt="Chess" width={24} height={24} className="invert" />
              </div>
              <h2 className="text-2xl font-light">Recent Chess Games</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.open(`https://www.chess.com/play/online/new?opponent=${username}`, "_blank")}
                className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded hover:bg-white/20 transition-colors"
              >
                <Swords className="h-4 w-4" />
                Challenge
              </button>
              <button
                onClick={() => setShowAllGames(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {games.map((game, index) => {
              const isPlayerWhite = game.white.username.toLowerCase() === username.toLowerCase()
              const opponent = isPlayerWhite ? game.black : game.white
              const result = getGameResult(game)
              
              return (
                <div key={index} className="bg-white/10 p-4 rounded-md">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <Trophy className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-base">
                          vs {opponent.username} ({opponent.rating})
                        </p>
                        <p className="text-xs opacity-70">
                          {formatTimeControl(game.time_control)} • {formatDate(game.end_time)}
                        </p>
                      </div>
                    </div>
                    <div className={`font-medium ${getResultColor(result)}`}>
                      {result}
                    </div>
                  </div>
                  <div className="mt-2">
                    <a 
                      href={game.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 inline-block"
                    >
                      View Game
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const currentGame = games[currentGameIndex]
  const isPlayerWhite = currentGame.white.username.toLowerCase() === username.toLowerCase()
  const opponent = isPlayerWhite ? currentGame.black : currentGame.white
  const result = getGameResult(currentGame)

  return (
    <div className="w-full h-full p-3 flex flex-col justify-between cursor-pointer" onClick={handleTileClick}>
      <div className="flex items-center">
        <div className="w-5 h-5 relative mr-2">
          <Image src="/icons/chess.svg" alt="Chess" width={20} height={20} className="invert" />
        </div>
        <h2 className="text-lg font-light">Chess</h2>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center w-[55%]">
          <Trophy className="h-4 w-4 min-w-[16px] mr-1.5" />
          <div className="overflow-hidden">
            <p className="text-xs truncate">vs {opponent.username}</p>
            <p className="text-xs opacity-70 truncate">{formatTimeControl(currentGame.time_control)}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end w-[40%]">
          <p className={`text-xs font-medium ${getResultColor(result)}`}>{result}</p>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://www.chess.com/play/online/new?opponent=${username}`, "_blank");
            }}
            className="flex items-center gap-1 text-xs bg-white/20 px-1.5 py-0.5 rounded hover:bg-white/30 mt-0.5"
          >
            <Swords className="h-3 w-3" />
            <span className="truncate">Challenge</span>
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <div className="flex">
          {games.slice(0, 5).map((_, index) => (
            <div key={index} className={`h-1 w-4 mr-1 ${index === currentGameIndex ? "bg-white" : "bg-white/30"}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChessTile
