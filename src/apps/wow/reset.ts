import type { Region } from './api'

// Wöchentlicher Reset (UTC, ohne Sommerzeit-Feinheiten): EU Mittwoch 04:00, US Dienstag 15:00.
const RESET: Record<Region, { day: number; hour: number }> = {
  eu: { day: 3, hour: 4 },
  us: { day: 2, hour: 15 },
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

export function lastWeeklyReset(region: Region, now = new Date()) {
  const { day, hour } = RESET[region]
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hour))
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() - day + 7) % 7))
  if (d > now) d.setTime(d.getTime() - WEEK_MS)
  return d
}

export function nextWeeklyReset(region: Region, now = new Date()) {
  return new Date(lastWeeklyReset(region, now).getTime() + WEEK_MS)
}

export function formatDuration(ms: number) {
  const h = Math.floor(ms / 3_600_000)
  return h >= 24 ? `${Math.floor(h / 24)} T ${h % 24} Std` : `${h} Std ${Math.floor((ms % 3_600_000) / 60_000)} Min`
}
