import type { ComponentType, LazyExoticComponent } from 'react'

export interface AppManifest {
  /** URL-Segment, z. B. "notes" -> /apps/notes. Muss dem Ordnernamen entsprechen. */
  id: string
  name: string
  icon: string
  version: string
  /** Sortierung im Header (kleiner = weiter links). */
  order?: number
  component: LazyExoticComponent<ComponentType>
}
