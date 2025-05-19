"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize from localStorage only after mount
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const item = window.localStorage.getItem(key)
      if (item !== null) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error("Error loading from localStorage", error)
    } finally {
      setIsInitialized(true)
    }
  }, [key])

  // Only update localStorage if initialized
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== "undefined" && isInitialized) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error("Error setting localStorage", error)
    }
  }

  return [storedValue, setValue]
}
