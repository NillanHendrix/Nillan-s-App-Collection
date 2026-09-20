import type { AppManifest } from './types'

// Jede App liegt in src/apps/<id>/manifest.ts. Neue Ordner werden automatisch erkannt.
const modules = import.meta.glob<{ default: AppManifest }>('../apps/*/manifest.ts', {
  eager: true,
})

export const apps: AppManifest[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => (a.order ?? 100) - (b.order ?? 100) || a.name.localeCompare(b.name))

export const findApp = (id: string | undefined) => apps.find((a) => a.id === id)
