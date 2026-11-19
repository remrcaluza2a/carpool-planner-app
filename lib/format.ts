export function formatTripDate(date: string, time?: string) {
  if (!date) return 'Date TBD'
  const d = new Date(`${date}T${time || '00:00'}`)
  if (Number.isNaN(d.getTime())) return date
  const day = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
  if (!time) return day
  const t = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  return `${day} · ${t}`
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}
