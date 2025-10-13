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
