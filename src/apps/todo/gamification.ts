// Spiel-Logik der Quests-App: Level-Kurve und Streak-Berechnung.
// In eigene Datei ausgelagert, damit sie ohne Supabase/React isoliert nachvollziehbar bleibt.

export interface Difficulty {
  key: string
  label: string
  points: number
  emoji: string
}

export const DIFFICULTIES: Difficulty[] = [
  { key: 'easy', label: 'Leicht', points: 10, emoji: '🟢' },
  { key: 'medium', label: 'Mittel', points: 25, emoji: '🟡' },
  { key: 'hard', label: 'Schwer', points: 50, emoji: '🔴' },
  { key: 'epic', label: 'Episch', points: 100, emoji: '🟣' },
]

// Jedes Level braucht mehr XP als das vorherige (Level n kostet n*50),
// damit Fortschritt spürbar bleibt, ohne dass hohe Level trivial werden.
export function levelRequirement(level: number): number {
  return level * 50
}

export interface LevelInfo {
  level: number
  into: number
  need: number
}

export function levelInfo(totalXp: number): LevelInfo {
  let level = 1
  let remaining = Math.max(0, totalXp)
  let need = levelRequirement(level)
  while (remaining >= need) {
    remaining -= need
    level++
    need = levelRequirement(level)
  }
  return { level, into: remaining, need }
}

const dayKey = (d: Date) => d.toLocaleDateString('sv') // liefert YYYY-MM-DD in lokaler Zeit

/** Zählt aufeinanderfolgende Tage mit mindestens einer erledigten Quest, endend heute oder gestern. */
export function computeStreak(completedAt: (string | null)[]): number {
  const days = new Set(completedAt.filter((d): d is string => !!d).map((d) => dayKey(new Date(d))))
  const cursor = new Date()
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1)
  let streak = 0
  while (days.has(dayKey(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}
