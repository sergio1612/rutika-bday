import { birthdayConfig } from './birthdayConfig'

const DEV_CLOCK_KEY = 'birthday-access-lock:dev-clock'

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

type ClockStore = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export function unlockInstant(iso = birthdayConfig.unlockAt): number {
  const value = Date.parse(iso)
  return Number.isNaN(value) ? Number.NaN : value
}

/** True at the configured instant. An unreadable timestamp stays locked. */
export function isUnlocked(nowMs: number, targetMs = unlockInstant()): boolean {
  if (Number.isNaN(targetMs)) return false
  return nowMs >= targetMs
}

export function remainingUntil(targetMs: number, nowMs: number): Remaining {
  const total = Math.max(0, targetMs - nowMs)
  const days = Math.floor(total / 86_400_000)
  const hours = Math.floor((total % 86_400_000) / 3_600_000)
  const minutes = Math.floor((total % 3_600_000) / 60_000)
  const seconds = Math.floor((total % 60_000) / 1000)
  return { total, days, hours, minutes, seconds }
}

function readClock(store: ClockStore): DevClock | null {
  const raw = store.getItem(DEV_CLOCK_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<DevClock>
    if (typeof parsed.simulated !== 'number' || typeof parsed.setAtReal !== 'number') return null
    return { simulated: parsed.simulated, setAtReal: parsed.setAtReal }
  } catch {
    return null
  }
}

/** Moves forward from a simulated instant. Used by tests and the dev preview. */
export function previewNow(realNow: number, store: ClockStore): number {
  const clock = readClock(store)
  if (!clock) return realNow
  return clock.simulated + (realNow - clock.setAtReal)
}

export function writePreview(iso: string | null, realNow: number, store: ClockStore): void {
  if (!iso) {
    store.removeItem(DEV_CLOCK_KEY)
    return
  }
  const simulated = Date.parse(iso)
  if (Number.isNaN(simulated)) return
  const payload: DevClock = { simulated, setAtReal: realNow }
  store.setItem(DEV_CLOCK_KEY, JSON.stringify(payload))
}

/**
 * Real time in production. The preview clock is compiled out of the call path
 * when DEV is false, and it is never read for a production build.
 */
export function accessNow(realNow = Date.now()): number {
  if (!import.meta.env.DEV) return realNow
  if (typeof sessionStorage === 'undefined') return realNow
  return previewNow(realNow, sessionStorage)
}

export function accessPreviewActive(): boolean {
  if (!import.meta.env.DEV || typeof sessionStorage === 'undefined') return false
  return readClock(sessionStorage) !== null
}

export function setAccessPreview(iso: string | null, realNow = Date.now()): void {
  if (!import.meta.env.DEV || typeof sessionStorage === 'undefined') return
  writePreview(iso, realNow, sessionStorage)
}
