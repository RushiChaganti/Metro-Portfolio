"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Star, Calendar, Github, GitBranch, GitPullRequest, X } from "lucide-react"

interface GitHubEvent {
  type: string
  repo: {
    name: string
  }
  created_at: string
}

interface ActivityTileProps {
  username: string
}

const ActivityTile: React.FC<ActivityTileProps> = ({ username }) => {
  const [events, setEvents] = useState<GitHubEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showAllActivity, setShowAllActivity] = useState(false)

  useEffect(() => {
    const fetchGitHubActivity = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://api.github.com/users/${username}/events/public`)

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`)
        }

        const data = await response.json()
        setEvents(data.slice(0, 30)) // Get more events to show in the detailed view
        setLoading(false)
      } catch (err) {
        console.error("Error fetching GitHub activity:", err)
        setError("Failed to load GitHub activity")
        setLoading(false)
      }
    }

    fetchGitHubActivity()
  }, [username])

  useEffect(() => {
    if (events.length > 0 && !showAllActivity) {
      const activityInterval = setInterval(() => {
        setIsAnimating(true)
        setTimeout(() => {
          setCurrentEventIndex((prevIndex) => (prevIndex + 1) % Math.min(events.length, 5))
          setIsAnimating(false)
        }, 500)
      }, 5000)

      return () => clearInterval(activityInterval)
    }
  }, [events.length, showAllActivity])

  // Add ESC key handler to close expanded view
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showAllActivity) {
        setShowAllActivity(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showAllActivity])

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "PushEvent":
        return <GitBranch className="h-6 w-6" />
      case "PullRequestEvent":
        return <GitPullRequest className="h-6 w-6" />
      case "WatchEvent":
        return <Star className="h-6 w-6" />
      case "CreateEvent":
        return <Calendar className="h-6 w-6" />
      default:
        return <Github className="h-6 w-6" />
    }
  }

  const formatEventType = (eventType: string) => {
    switch (eventType) {
      case "PushEvent":
        return "Pushed to"
      case "PullRequestEvent":
        return "Opened PR in"
      case "WatchEvent":
        return "Starred"
      case "CreateEvent":
        return "Created"
      case "ForkEvent":
        return "Forked"
      case "IssuesEvent":
        return "Updated issue in"
      case "IssueCommentEvent":
        return "Commented on"
      default:
        return eventType.replace("Event", "")
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    } else {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleTileClick = () => {
    setShowAllActivity(true)
  }

  if (loading) {
    return (
      <div className="w-full h-full p-4 flex flex-col justify-between">
        <h2 className="text-xl font-light mb-2">GitHub Activity</h2>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-full p-4 flex flex-col justify-between">
        <h2 className="text-xl font-light mb-2">GitHub Activity</h2>
        <div className="flex items-center justify-center">
          <p className="text-sm opacity-70">{error}</p>
        </div>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="w-full h-full p-4 flex flex-col justify-between">
        <h2 className="text-xl font-light mb-2">GitHub Activity</h2>
        <div className="flex items-center justify-center">
          <p className="text-sm opacity-70">No recent activity</p>
        </div>
      </div>
    )
  }

  if (showAllActivity) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 overflow-auto p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-light">GitHub Activity</h2>
            <button
              onClick={() => setShowAllActivity(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={index} className="bg-white/10 p-4 rounded-md">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">{getEventIcon(event.type)}</div>
                  <div>
                    <p className="text-base">
                      {formatEventType(event.type)} {event.repo.name}
                    </p>
                    <p className="text-xs opacity-70">{formatDate(event.created_at)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const currentEvent = events[currentEventIndex]

  return (
    <div className="w-full h-full p-4 flex flex-col justify-between cursor-pointer" onClick={handleTileClick}>
      <h2 className="text-xl font-light mb-2">GitHub Activity</h2>

      <div
        className={`flex items-center transition-all duration-500 ${
          isAnimating ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="mr-3">{getEventIcon(currentEvent.type)}</div>
        <div>
          <p className="text-base">
            {formatEventType(currentEvent.type)} {currentEvent.repo.name}
          </p>
          <p className="text-xs opacity-70">{formatTimeAgo(currentEvent.created_at)}</p>
        </div>
      </div>

      <div className="flex mt-2">
        {events.slice(0, 5).map((_, index) => (
          <div key={index} className={`h-1 w-6 mr-1 ${index === currentEventIndex ? "bg-white" : "bg-white/30"}`} />
        ))}
      </div>
    </div>
  )
}

export default ActivityTile
