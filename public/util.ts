export function colorize(s: string = '') {
  const hash = [...s].reduce((acc, char) => char.charCodeAt(0) + acc, 0)
  const hue = hash % 360
  return `hsl(${hue}, 60%, 55%)`
}
