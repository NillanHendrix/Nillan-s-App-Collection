import { lazy } from 'react'
import type { AppManifest } from '../../registry/types'

const manifest: AppManifest = {
  id: 'wow',
  name: 'WoW Companion',
  icon: '⚔️',
  version: '1.0.0',
  order: 30,
  component: lazy(() => import('./App')),
}

export default manifest
