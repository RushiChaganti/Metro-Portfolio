"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Save, X } from "lucide-react"

interface CharacterUploaderProps {
  onSave: (characterData: { name: string; imageUrl: string }) => void
  onCancel: () => void
}

export default function CharacterUploader({ onSave, onCancel }: CharacterUploaderProps) {
  const [characterName, setCharacterName] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (previewUrl && characterName.trim()) {
      onSave({
        name: characterName,
        imageUrl: previewUrl,
      })
    }
  }

  return (
    <div className="bg-black/80 p-4 rounded-md w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-light">Add Custom Character</h2>
        <button onClick={onCancel} className="text-white hover:text-gray-300">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block mb-2 text-sm">Character Name</label>
          <input
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white"
            placeholder="Enter character name"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm">Character Image</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              <Upload size={16} />
              Upload Image
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          </div>

          {previewUrl && (
            <div className="mt-4 p-2 border border-gray-700 inline-block rounded">
              <p className="text-sm mb-1">Preview:</p>
              <div className="flex items-center gap-4">
                <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-16 h-16 object-contain" />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!previewUrl || !characterName.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            Save Character
          </button>
        </div>
      </div>
    </div>
  )
}
