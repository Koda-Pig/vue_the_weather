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
