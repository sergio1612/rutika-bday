export const HUNT_TIME_ZONE = 'Asia/Kolkata'
const DEV_CLOCK_KEY = 'birthday-gift-hunt:dev-clock'

export type Remaining = {
  total: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

type DevClock = {
  simulated: number
  setAtReal: number
}

export function parseSchedule(iso: string): number {
  const value = Date.parse(iso)
  return Number.isNaN(value) ? Number.NaN : value
}

export function remainingUntil(targetMs: number, nowMs: number): Remaining {
  const total = Math.max(0, targetMs - nowMs)
  const days = Math.floor(total / 86_400_000)
  const hours = Math.floor((total % 86_400_000) / 3_600_000)
  const minutes = Math.floor((total % 3_600_000) / 60_000)
  const seconds = Math.floor((total % 60_000) / 1000)
  return { total, days, hours, minutes, seconds }
}

export function formatInKolkata(ms: number): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: HUNT_TIME_ZONE,
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: '2-digit',
  }).format(ms)
}

function readDevClock(): DevClock | null {
  if (!import.meta.env.DEV || typeof sessionStorage === 'undefined') return null
  const raw = sessionStorage.getItem(DEV_CLOCK_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<DevClock>
    if (typeof parsed.simulated !== 'number' || typeof parsed.setAtReal !== 'number') return null
    return { simulated: parsed.simulated, setAtReal: parsed.setAtReal }
  } catch {
    return null
  }
}

/** Real time in production. In dev, a preview clock can stand in for her birthday. */
export function effectiveNow(realNow = Date.now()): number {
  const clock = readDevClock()
  if (!clock) return realNow
  return clock.simulated + (realNow - clock.setAtReal)
}

export function simulatedClockActive(): boolean {
  return readDevClock() !== null
}

export function setDevClock(iso: string | null, realNow = Date.now()): void {
  if (!import.meta.env.DEV || typeof sessionStorage === 'undefined') return
  if (!iso) {
    sessionStorage.removeItem(DEV_CLOCK_KEY)
    return
  }
  const simulated = Date.parse(iso)
  if (Number.isNaN(simulated)) return
  const payload: DevClock = { simulated, setAtReal: realNow }
  sessionStorage.setItem(DEV_CLOCK_KEY, JSON.stringify(payload))
}
