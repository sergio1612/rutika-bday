/// <reference types="vitest/globals" />
import { birthdayConfig } from './birthdayConfig'
import { isUnlocked, previewNow, remainingUntil, unlockInstant, writePreview } from './birthdayAccess'

function memoryStore() {
  const data = new Map<string, string>()
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value)
    },
    removeItem: (key: string) => {
      data.delete(key)
    },
  }
}

describe('birthday access lock', () => {
  const target = unlockInstant()

  it('reads the unlock instant as midnight IST', () => {
    expect(birthdayConfig.unlockAt).toBe('2026-11-24T00:00:00+05:30')
    expect(birthdayConfig.timezone).toBe('Asia/Kolkata')
    expect(target).toBe(Date.parse('2026-11-23T18:30:00Z'))
  })

  it('stays locked through 11:59:59 pm IST on 23 November', () => {
    expect(isUnlocked(Date.parse('2026-11-23T23:59:59+05:30'), target)).toBe(false)
  })

  it('unlocks at midnight IST and stays open after', () => {
    expect(isUnlocked(target, target)).toBe(true)
    expect(isUnlocked(Date.parse('2026-11-24T00:00:01+05:30'), target)).toBe(true)
  })

  it('follows the IST instant when the browser clock is expressed in another offset', () => {
    expect(isUnlocked(Date.parse('2026-11-23T18:29:59Z'), target)).toBe(false)
    expect(isUnlocked(Date.parse('2026-11-23T13:00:00-05:30'), target)).toBe(true)
  })

  it('keeps an unreadable timestamp locked', () => {
    expect(isUnlocked(Date.now(), Number.NaN)).toBe(false)
  })

  it('counts the last hour before midnight as one hour, not a day', () => {
    const now = Date.parse('2026-11-23T23:00:00+05:30')
    expect(remainingUntil(target, now)).toEqual({
      total: 3_600_000,
      days: 0,
      hours: 1,
      minutes: 0,
      seconds: 0,
    })
  })

  it('advances a simulated preview clock and ignores a cleared one', () => {
    const store = memoryStore()
    writePreview('2026-11-24T09:00:00+05:30', 1_000, store)
    expect(previewNow(5_000, store)).toBe(Date.parse('2026-11-24T09:00:00+05:30') + 4_000)
    store.removeItem('birthday-access-lock:dev-clock')
    expect(previewNow(5_000, store)).toBe(5_000)
  })

  it('drops a corrupt preview clock', () => {
    const store = memoryStore()
    store.setItem('birthday-access-lock:dev-clock', '{')
    expect(previewNow(80, store)).toBe(80)
  })
})
