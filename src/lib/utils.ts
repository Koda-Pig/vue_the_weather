import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  timeout: number,
) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: T) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), timeout)
  }
}

export const kelvinToCelsius = (kelvin: number) => Math.round(kelvin - 273.15)

export const formatTime = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

export const setBodyClass = () => {
  const now = new Date()
  const hours = now.getHours()
  const isDayTime = hours >= 6 && hours < 18

  document.body.classList.remove('day-time', 'night-time')
  document.body.classList.add(isDayTime ? 'day-time' : 'night-time')
}
