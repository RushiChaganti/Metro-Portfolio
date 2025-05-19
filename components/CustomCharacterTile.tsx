"use client"

interface CustomCharacterTileProps {
  character: {
    name: string
    imageUrl: string
  }
  isEnabled: boolean
  size: "small" | "medium" | "large"
}

export default function CustomCharacterTile({ character, isEnabled, size }: CustomCharacterTileProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-2">
      <div className="relative mb-1">
        <img
          src={character.imageUrl || "/placeholder.svg"}
          alt={character.name}
          className="w-10 h-10 object-contain rounded-full"
        />
        <div
          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${isEnabled ? "bg-green-500" : "bg-red-500"}`}
        ></div>
      </div>

      {/* Show name for all sizes */}
      <h3 className="text-sm font-light text-center truncate w-full">{character.name}</h3>

      {/* Show status text for medium and large tiles */}
      {(size === "medium" || size === "large") && <p className="text-xs mt-1">{isEnabled ? "Active" : "Inactive"}</p>}

      {/* Show description for large tiles */}
      {size === "large" && <p className="text-xs mt-2 text-center">Click to toggle this custom character on or off</p>}
    </div>
  )
}
