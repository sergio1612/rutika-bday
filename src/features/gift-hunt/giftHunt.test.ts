/// <reference types="vitest/globals" />
import type { GiftDefinition, HuntLetter } from './data/types'
import { initialGiftHuntState, type GiftHuntState } from './state/giftInitialState'
import { giftReducer } from './state/giftReducer'
import { validateGiftConfig } from './utils/configValidator'
import { parseSchedule } from './utils/dateUtils'
import { dependencyMet, evaluatePin, finaleUnlocked, statusFor } from './utils/giftRules'
import { GIFT_HUNT_STORAGE_KEY, loadProgress, parseStoredProgress, saveProgress } from './utils/storageUtils'

const at = (hour: number) => Date.parse(`2026-11-24T${String(hour).padStart(2, '0')}:00:00+05:30`)

function makeGift(order: number, overrides: Partial<GiftDefinition> = {}): GiftDefinition {
  const slug = overrides.giftId ?? `gift-sample-${order}`
  return {
    giftId: slug,
    eventId: `event-${slug}`,
    order,
    enabled: true,
    role: 'sequential',
    required: true,
    requiresPin: true,
    dependsOnGiftId: null,
    name: `Gift ${order}`,
    description: 'A little surprise',
    unlockAt: `2026-11-24T${String(8 + order).padStart(2, '0')}:00:00+05:30`,
    pinConfig: {
      pinId: `pin-${slug}`,
      value: `CODE-${order}`,
      maxAttempts: 2,
    },
    clues: [
      {
        clueId: `clue-${slug}`,
        title: 'Hint',
        description: 'Look here.',
        hints: [{ hintId: `hint-${slug}`, text: 'Nudge' }],
      },
    ],
    location: 'CHANGE_ME',
    completionMessage: { messageId: `message-${slug}`, text: 'Found.' },
    image: null,
    ...overrides,
  }
}

const letter: HuntLetter = {
  heading: 'Letter',
  preamble: 'Hello',
  sections: [{ letterSectionId: 'letter-section-test-001', text: 'Words' }],
  closing: 'Yours,',
  signature: 'Manav',
}

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

describe('unlock rules', () => {
  const first = makeGift(1)
  const second = makeGift(2)
  const gifts = [second, first]

  it('keeps the first gift locked until its hour', () => {
    expect(statusFor(first, gifts, new Set(), at(8))).toBe('locked')
    expect(statusFor(first, gifts, new Set(), at(9))).toBe('available')
  })

  it('holds the next gift until the previous one is found, even after its hour', () => {
    expect(statusFor(second, gifts, new Set(), at(12))).toBe('locked')
    expect(dependencyMet(second, gifts, new Set([first.giftId]))).toBe(true)
    expect(statusFor(second, gifts, new Set([first.giftId]), at(9))).toBe('locked')
    expect(statusFor(second, gifts, new Set([first.giftId]), at(10))).toBe('available')
  })

  it('skips a disabled gift when deciding who comes next', () => {
    const skipped = makeGift(2, { enabled: false, giftId: 'gift-skipped' })
    const third = makeGift(3)
    const chain = [first, skipped, third]
    expect(statusFor(third, chain, new Set([first.giftId]), at(12))).toBe('available')
  })

  it('opens the letter only when every required gift is complete', () => {
    const bonus = makeGift(3, { role: 'bonus', required: false, giftId: 'gift-bonus' })
    const chain = [first, second, bonus]
    expect(finaleUnlocked(chain, new Set([first.giftId]))).toBe(false)
    expect(finaleUnlocked(chain, new Set([first.giftId, second.giftId]))).toBe(true)
    expect(finaleUnlocked([makeGift(1, { enabled: false })], new Set())).toBe(false)
  })
})

describe('pin verification', () => {
  const gift = makeGift(1)
  const gifts = [gift]
  const now = at(10)

  it('completes a gift only for the right code', () => {
    const wrong = giftReducer(initialGiftHuntState, {
      type: 'verify-pin',
      giftId: gift.giftId,
      pin: 'nope',
      now,
      gifts,
    })
    expect(wrong.completedGiftIds).toEqual([])
    expect(wrong.attemptsByPinId[gift.pinConfig!.pinId]).toBe(1)

    const right = giftReducer(initialGiftHuntState, {
      type: 'verify-pin',
      giftId: gift.giftId,
      pin: 'CODE-1',
      now,
      gifts,
    })
    expect(right.completedGiftIds).toEqual([gift.giftId])
  })

  it('stops counting once the attempt limit is reached', () => {
    const tired: GiftHuntState = {
      ...initialGiftHuntState,
      attemptsByPinId: { [gift.pinConfig!.pinId]: 2 },
    }
    expect(evaluatePin(tired, gifts, gift.giftId, 'CODE-1', now)).toBe('locked-out')
    const next = giftReducer(tired, { type: 'verify-pin', giftId: gift.giftId, pin: 'CODE-1', now, gifts })
    expect(next.completedGiftIds).toEqual([])
    expect(next.attemptsByPinId[gift.pinConfig!.pinId]).toBe(2)
  })

  it('does not complete a gift whose hour has not come', () => {
    const early = giftReducer(initialGiftHuntState, {
      type: 'verify-pin',
      giftId: gift.giftId,
      pin: 'CODE-1',
      now: at(8),
      gifts,
    })
    expect(early.completedGiftIds).toEqual([])
  })
})

describe('ids and storage', () => {
  it('reads a schedule in India time', () => {
    expect(parseSchedule('2026-11-24T09:00:00+05:30')).toBe(Date.parse('2026-11-24T09:00:00+05:30'))
    expect(Number.isNaN(parseSchedule('not-a-time'))).toBe(true)
  })

  it('warns about duplicate ids and a broken clock', () => {
    const broken = makeGift(1, { giftId: 'gift-same', eventId: 'gift-same', unlockAt: 'tomorrow' })
    const warnings = validateGiftConfig({ birthdayDate: '2026-11-24', timezone: 'Asia/Kolkata', intro: { title: '', subtitle: '', cta: '' }, gifts: [broken, broken] }, letter)
    expect(warnings.some((warning) => warning.includes('Duplicate'))).toBe(true)
    expect(warnings.some((warning) => warning.includes('unlock time'))).toBe(true)
  })

  it('keeps progress by gift id across a reload', () => {
    const store = memoryStore()
    const saved: GiftHuntState = {
      ...initialGiftHuntState,
      started: true,
      completedGiftIds: ['gift-photo-frames-001'],
      attemptsByPinId: { 'pin-eye-mask-001': 1 },
      revealedHintIds: ['hint-eye-mask-001'],
      letterOpened: false,
    }
    saveProgress(saved, store)
    expect(store.getItem(GIFT_HUNT_STORAGE_KEY)).toContain('gift-photo-frames-001')
    expect(loadProgress(store).completedGiftIds).toEqual(['gift-photo-frames-001'])
    expect(parseStoredProgress('{')).toBeNull()
    expect(parseStoredProgress(JSON.stringify({ started: true }))).toBeNull()
  })

  it('does not lose a completed gift when the list is reordered', () => {
    const second = makeGift(2)
    const done = giftReducer(initialGiftHuntState, {
      type: 'verify-pin',
      giftId: second.giftId,
      pin: 'CODE-2',
      now: at(12),
      gifts: [second],
    })
    const reordered = [makeGift(1), second]
    expect(done.completedGiftIds).toEqual([second.giftId])
    expect(statusFor(second, reordered, new Set(done.completedGiftIds), at(12))).toBe('completed')
  })
})
