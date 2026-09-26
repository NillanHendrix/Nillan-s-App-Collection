# Everything App

Shell mit Header, der zwischen Mini-Apps wechselt, ohne die Seite neu zu laden. React + Vite + Supabase + Vercel.

## Setup

1. `npm install`
2. `.env.example` nach `.env` kopieren und Supabase-URL und Anon-Key eintragen.
3. Migrationen aus `supabase/migrations/` im Supabase SQL-Editor ausführen.
4. `npm run dev`

## Neue App hinzufügen

Lege einen Ordner `src/apps/<id>/` an, mit zwei Dateien. Die Shell erkennt ihn automatisch, sie muss nicht geändert werden.

`manifest.ts`:

```ts
import { lazy } from 'react'
import type { AppManifest } from '../../registry/types'

const manifest: AppManifest = {
  id: '<id>', // = Ordnername, wird zu /apps/<id>
  name: 'Meine App',
  icon: '🚀',
  version: '1.0.0',
  order: 30,
  component: lazy(() => import('./App')),
}
export default manifest
```

`App.tsx`: `export default function App() { ... }`

Datenbanktabellen bekommen das Präfix `<id>_`, eine `user_id uuid default auth.uid()`-Spalte und eine RLS-Policy (siehe `supabase/migrations/0001_notes.sql`). Migration als neue Datei `supabase/migrations/000N_<id>.sql` ablegen.

## Neue Version ausliefern

`version` im Manifest erhöhen, committen, pushen. Vercel baut und deployt automatisch. Jede App ist ein eigener Chunk. Offene Tabs laden nach einem Deploy einmalig neu, falls ein Chunk nicht mehr existiert (`vite:preloadError` in `src/main.tsx`).

## Deployment auf Vercel

Repo importieren (Framework: Vite), Env-Vars `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY` setzen. `vercel.json` leitet alle Routen außer `/api/*` auf `index.html` um.

Für die WoW-App (`wow`) zusätzlich `BLIZZARD_CLIENT_ID` und `BLIZZARD_CLIENT_SECRET` setzen (API-Client unter https://develop.battle.net anlegen). Die Blizzard API läuft über die Vercel Function `api/wow.ts`; lokal entweder `npx vercel dev` nutzen oder in `.env` `API_PROXY_TARGET` auf ein Deployment setzen.
