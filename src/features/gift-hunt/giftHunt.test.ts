/// <reference types="vitest/globals" />
import type { GiftDefinition, HuntLetter } from './data/types'
import { initialGiftHuntState, type GiftHuntState } from './state/giftInitialState'
import { giftReducer } from './state/giftReducer'
import { validateGiftConfig } from './utils/configValidator'
import { parseSchedule } from './utils/dateUtils'
import { giftConfig } from './data/giftData'
import { dependencyMet, evaluatePin, finaleUnlocked, statusFor } from './utils/giftRules'
import { isCompletePin, sanitizePin } from './utils/pinInput'
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
      value: `100${order}`,
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
    physicalCard: null,
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
      pin: '0000',
      now,
      gifts,
    })
    expect(wrong.completedGiftIds).toEqual([])
    expect(wrong.attemptsByPinId[gift.pinConfig!.pinId]).toBe(1)

    const right = giftReducer(initialGiftHuntState, {
      type: 'verify-pin',
      giftId: gift.giftId,
      pin: '1001',
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
    expect(evaluatePin(tired, gifts, gift.giftId, '1001', now)).toBe('locked-out')
    const next = giftReducer(tired, { type: 'verify-pin', giftId: gift.giftId, pin: '1001', now, gifts })
    expect(next.completedGiftIds).toEqual([])
    expect(next.attemptsByPinId[gift.pinConfig!.pinId]).toBe(2)
  })

  it('does not complete a gift whose hour has not come', () => {
    const early = giftReducer(initialGiftHuntState, {
      type: 'verify-pin',
      giftId: gift.giftId,
      pin: '1001',
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
    const warnings = validateGiftConfig({ birthdayDate: '2026-11-24', timezone: 'Asia/Kolkata', intro: { title: '', subtitle: '', waiting: '', cta: '' }, gifts: [broken, broken] }, letter)
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
    expect(loadProgress(store).completedGiftIds).toEqual(['gift-04'])
    expect(loadProgress(store).attemptsByPinId).toEqual({ 'pin-02': 1 })
    expect(loadProgress(store).revealedHintIds).toEqual(['hint-02'])
    expect(parseStoredProgress('{')).toBeNull()
    expect(parseStoredProgress(JSON.stringify({ started: true }))).toBeNull()
  })

  it('does not lose a completed gift when the list is reordered', () => {
    const second = makeGift(2)
    const done = giftReducer(initialGiftHuntState, {
      type: 'verify-pin',
      giftId: second.giftId,
      pin: '1002',
      now: at(12),
      gifts: [second],
    })
    const reordered = [makeGift(1), second]
    expect(done.completedGiftIds).toEqual([second.giftId])
    expect(statusFor(second, reordered, new Set(done.completedGiftIds), at(12))).toBe('completed')
  })
})

describe('configured gifts', () => {
  const gifts = giftConfig.gifts
  const presents = gifts.filter((gift) => gift.required)
  const first = presents[0]
  const later = Date.parse('2026-11-24T21:00:00+05:30')

  it('lists the eight gifts with unique string PINs', () => {
    expect(presents.map((gift) => gift.giftId)).toEqual([
      'gift-01',
      'gift-02',
      'gift-03',
      'gift-04',
      'gift-05',
      'gift-06',
      'gift-07',
      'gift-08',
    ])
    expect(presents.map((gift) => gift.name)).toEqual([
      'Butterfly-shaped hair claw clip',
      'Cute eye mask',
      'Small cute round container',
      'Personalized photo frame',
      'Tiny metal ring container with a secret note',
      'Panda silicone lamp',
      'Collection of 12 earrings',
      'Bracelet',
    ])
    const pins = presents.map((gift) => gift.pinConfig?.value)
    expect(pins).toEqual(['9062', '5831', '7426', '1964', '8357', '4209', '6713', '2948'])
    expect(new Set(pins).size).toBe(pins.length)
    expect(pins.every((pin) => typeof pin === 'string' && isCompletePin(pin ?? ''))).toBe(true)
    expect(presents.every((gift) => gift.required && gift.enabled)).toBe(true)
    expect(new Set(gifts.map((gift) => gift.unlockAt))).toEqual(new Set(['2026-11-24T19:00:00+05:30']))
  })

  it('accepts only gift 1’s PIN for gift 1', () => {
    expect(evaluatePin(initialGiftHuntState, gifts, first.giftId, '9062', later)).toBe('success')
    expect(evaluatePin(initialGiftHuntState, gifts, first.giftId, '5831', later)).toBe('incorrect')
    expect(evaluatePin(initialGiftHuntState, gifts, first.giftId, 'abcd', later)).toBe('empty')
    expect(evaluatePin(initialGiftHuntState, gifts, first.giftId, '12', later)).toBe('empty')
    expect(evaluatePin(initialGiftHuntState, gifts, first.giftId, '', later)).toBe('empty')

    const wrong = giftReducer(initialGiftHuntState, {
      type: 'verify-pin',
      giftId: first.giftId,
      pin: '5831',
      now: later,
      gifts,
    })
    expect(wrong.completedGiftIds).toEqual([])
    expect(wrong.attemptsByPinId[first.pinConfig!.pinId]).toBe(1)

    const right = giftReducer(wrong, {
      type: 'verify-pin',
      giftId: first.giftId,
      pin: '9062',
      now: later,
      gifts,
    })
    expect(right.completedGiftIds).toEqual([first.giftId])
    expect(right.completedGiftIds).not.toContain(gifts[1].giftId)
  })

  it('keeps letters, spaces, and extra digits out of the field', () => {
    expect(sanitizePin('abcd')).toBe('')
    expect(sanitizePin('12ab')).toBe('12')
    expect(sanitizePin('12 34')).toBe('1234')
    expect(sanitizePin('12345')).toBe('1234')
    expect(sanitizePin('12😀34')).toBe('1234')
    expect(sanitizePin('0906')).toBe('0906')
    expect(isCompletePin('123')).toBe(false)
    expect(isCompletePin('1234')).toBe(true)
  })

  it('opens the final surprise only after the last configured gift', () => {
    const seven = gifts.slice(0, 7).map((gift) => gift.giftId)
    expect(finaleUnlocked(gifts, new Set(seven))).toBe(false)
    expect(finaleUnlocked(gifts, new Set(gifts.map((gift) => gift.giftId)))).toBe(true)
  })

  it('keeps the opening riddle free of the hiding place', () => {
    expect(giftConfig.intro.waiting).toBe('Your first little surprise is waiting for the perfect moment... ❤️')
    expect(giftConfig.intro.subtitle).toContain('Eight little surprises, eight hidden places')
    const riddle = first.clues[0]
    expect(riddle?.title).toBe('Your First Little Adventure')
    expect(riddle?.description).toContain('where your daily ride waits')
    expect(riddle?.description).not.toContain(first.location)
    expect(riddle?.hints).toEqual([])
    expect(gifts.slice(1).every((gift) => gift.clues.length === 0)).toBe(true)
    const beforeEvening = Date.parse('2026-11-24T18:59:00+05:30')
    const evening = Date.parse('2026-11-24T19:00:00+05:30')
    expect(statusFor(first, gifts, new Set(), beforeEvening)).toBe('locked')
    expect(statusFor(first, gifts, new Set(), evening)).toBe('available')
    expect(statusFor(gifts[1], gifts, new Set([first.giftId]), evening)).toBe('available')
    expect(statusFor(gifts[2], gifts, new Set([first.giftId]), evening)).toBe('locked')
    expect(riddle?.description.includes('Activa')).toBe(false)
  })

  it('points each note at the next gift without naming that place', () => {
    const openings = [
      'Tiny paws, playful days',
      'Three quiet companions, parked in a row',
      'White kept its secret, short and true',
      'Blue has spoken, one still remains',
      'Where aromas dance and ingredients stay',
      'A peaceful corner, filled with grace',
      'After a long day, you rest right here',
      'Someone who shares your home and your days',
      'Little colours, little art',
      'Eight little surprises, one beautiful day',
    ]
    gifts.forEach((gift, index) => {
      const next = gifts[index + 1]
      expect(gift.physicalCard?.verse.startsWith(openings[index] ?? '')).toBe(true)
      expect(gift.physicalCard?.nextGiftId ?? null).toBe(next?.giftId ?? null)
      expect(gift.physicalCard?.verse.includes(gift.location)).toBe(false)
      if (gift.pinConfig?.value) expect(gift.physicalCard?.verse.includes(gift.pinConfig.value)).toBe(false)
      if (!next) return
      expect(gift.physicalCard?.verse.includes(next.location)).toBe(false)
      expect(gift.physicalCard?.verse.includes(next.name)).toBe(false)
    })
  })

  it('unlocks only the next gift after the right code', () => {
    expect(statusFor(gifts[1], gifts, new Set(), later)).toBe('locked')
    let state = initialGiftHuntState
    gifts.forEach((gift, index) => {
      if (!gift.requiresPin) {
        state = giftReducer(state, {
          type: 'complete-without-pin',
          giftId: gift.giftId,
          now: later,
          gifts,
        })
      } else {
        const other = gifts.find((item) => item.requiresPin && item.giftId !== gift.giftId)
        const rejected = giftReducer(state, {
          type: 'verify-pin',
          giftId: gift.giftId,
          pin: other?.pinConfig?.value ?? '',
          now: later,
          gifts,
        })
        expect(rejected.completedGiftIds).not.toContain(gift.giftId)
        state = giftReducer(state, {
          type: 'verify-pin',
          giftId: gift.giftId,
          pin: gift.pinConfig?.value ?? '',
          now: later,
          gifts,
        })
      }
      expect(state.completedGiftIds).toContain(gift.giftId)
      const following = gifts[index + 1]
      const afterThat = gifts[index + 2]
      if (following) expect(statusFor(following, gifts, new Set(state.completedGiftIds), later)).toBe('available')
      if (afterThat) expect(statusFor(afterThat, gifts, new Set(state.completedGiftIds), later)).toBe('locked')
    })
    expect(finaleUnlocked(gifts, new Set(state.completedGiftIds))).toBe(true)
  })
})
