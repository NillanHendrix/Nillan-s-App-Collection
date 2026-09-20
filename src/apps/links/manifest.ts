import { lazy } from 'react'
import type { AppManifest } from '../../registry/types'

const manifest: AppManifest = {
  id: 'links',
  name: 'Links',
  icon: '🔗',
  version: '1.0.0',
  order: 15,
  component: lazy(() => import('./App')),
}

export default manifest
