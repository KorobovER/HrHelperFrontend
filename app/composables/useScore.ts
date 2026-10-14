export function scoreColor(score: number | null): string {
  if (score === null) return '#BBB9EF'
  if (score >= 70) return '#22c55e'
  if (score >= 40) return '#f59e0b'
  return '#ef4444'
}

export function scoreChipClass(score: number | null): string {
  if (score === null) return 'bg-blue-100 text-blue-700'
  if (score >= 70) return 'bg-green-100 text-green-700'
  if (score >= 40) return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
}
