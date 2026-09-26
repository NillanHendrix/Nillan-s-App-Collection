import type { Character } from './api'

// Externe Profilseiten für einen Charakter.
export function profileLinks({ region, realm, name }: Character) {
  const n = encodeURIComponent(name.toLowerCase())
  return [
    { label: 'Arsenal', url: `https://worldofwarcraft.blizzard.com/de-de/character/${region}/${realm}/${n}` },
    { label: 'Raider.IO', url: `https://raider.io/characters/${region}/${realm}/${n}` },
    { label: 'Warcraft Logs', url: `https://www.warcraftlogs.com/character/${region}/${realm}/${n}` },
    { label: 'WoWProgress', url: `https://www.wowprogress.com/character/${region}/${realm}/${n}` },
    { label: 'Check-PvP', url: `https://check-pvp.fr/${region}/${realm}/${n}` },
  ]
}
