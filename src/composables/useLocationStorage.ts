import { ref, onMounted } from 'vue'
import type { Coords } from '@/types'

export type StoredLocation = {
  coords: Coords
  timestamp: number
}

const STORAGE_KEY = 'vue-weather-last-location'
const EXPIRATION_MS = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds

export function useLocationStorage() {
  const hasLastLocation = ref(false)

  function saveLastLocation(coords: Coords): void {
    const storedLocation: StoredLocation = {
      coords,
      timestamp: Date.now(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedLocation))
    hasLastLocation.value = true
  }

  function getLastLocation(): Coords | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return null

      const storedLocation: StoredLocation = JSON.parse(stored)
      const now = Date.now()
      const isExpired = now - storedLocation.timestamp > EXPIRATION_MS

      if (isExpired) {
        clearLastLocation()
        return null
      }

      return storedLocation.coords
    } catch (error) {
      console.warn('Failed to parse stored location:', error)
      clearLastLocation()
      return null
    }
  }

  function clearLastLocation(): void {
    localStorage.removeItem(STORAGE_KEY)
    hasLastLocation.value = false
  }

  function checkLastLocation(): void {
    const lastLocation = getLastLocation()
    hasLastLocation.value = lastLocation !== null
  }

  // Check for last location on mount
  onMounted(() => {
    checkLastLocation()
  })

  return {
    hasLastLocation,
    saveLastLocation,
    getLastLocation,
    clearLastLocation,
    checkLastLocation,
  }
}
