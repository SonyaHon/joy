export function lerp(
  from: number,
  to: number,
  t: number,
  fn?: (t: number) => number
) {
  if (fn) {
    t = fn(t)
  }
  return from + (to - from) * t
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max))
}
