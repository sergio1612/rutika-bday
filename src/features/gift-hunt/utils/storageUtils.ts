import type { GiftHuntState } from '../state/giftInitialState'
import { initialGiftHuntState } from '../state/giftInitialState'

export const GIFT_HUNT_STORAGE_KEY = 'birthday-gift-hunt:v1'

type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

function browserStore(): Store | null {
  if (typeof localStorage === 'undefined') return null
  return localStorage
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

/** Earlier builds stored descriptive ids. Progress follows the gift, not the old name. */
const LEGACY_IDS: Record<string, string> = {
  'gift-butterfly-clip-001': 'gift-01',
  'gift-eye-mask-001': 'gift-02',
  'gift-round-container-001': 'gift-03',
  'gift-photo-frames-001': 'gift-04',
  'gift-ring-container-001': 'gift-05',
  'gift-panda-lamp-001': 'gift-06',
  'gift-earrings-001': 'gift-07',
  'pin-butterfly-clip-001': 'pin-01',
  'pin-eye-mask-001': 'pin-02',
  'pin-round-container-001': 'pin-03',
  'pin-photo-frames-001': 'pin-04',
  'pin-ring-container-001': 'pin-05',
  'pin-panda-lamp-001': 'pin-06',
  'pin-earrings-001': 'pin-07',
  'hint-butterfly-clip-001': 'hint-01',
  'hint-eye-mask-001': 'hint-02',
  'hint-round-container-001': 'hint-03',
  'hint-photo-frames-001': 'hint-04',
  'hint-ring-container-001': 'hint-05',
  'hint-panda-lamp-001': 'hint-06',
  'hint-earrings-001': 'hint-07',
}

function migrateId(id: string): string {
  return LEGACY_IDS[id] ?? id
}

function isAttemptMap(value: unknown): value is Record<string, number> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  return Object.entries(value).every(([, attempts]) => typeof attempts === 'number' && attempts >= 0)
}

export function parseStoredProgress(raw: string | null): GiftHuntState | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<GiftHuntState>
    if (!isStringList(parsed.completedGiftIds) || !isStringList(parsed.revealedHintIds)) return null
    if (typeof parsed.started !== 'boolean' || typeof parsed.letterOpened !== 'boolean') return null
    if (!isAttemptMap(parsed.attemptsByPinId)) return null
    const attemptsByPinId: Record<string, number> = {}
    for (const [pinId, attempts] of Object.entries(parsed.attemptsByPinId)) {
      attemptsByPinId[migrateId(pinId)] = attempts
    }
    return {
      started: parsed.started,
      completedGiftIds: [...new Set(parsed.completedGiftIds.map(migrateId))],
      attemptsByPinId,
      revealedHintIds: [...new Set(parsed.revealedHintIds.map(migrateId))],
      letterOpened: parsed.letterOpened,
    }
  } catch {
    return null
  }
}

export function loadProgress(store: Store | null = browserStore()): GiftHuntState {
  if (!store) return initialGiftHuntState
  return parseStoredProgress(store.getItem(GIFT_HUNT_STORAGE_KEY)) ?? initialGiftHuntState
}

export function saveProgress(state: GiftHuntState, store: Store | null = browserStore()): void {
  if (!store) return
  const payload: GiftHuntState = {
    started: state.started,
    completedGiftIds: state.completedGiftIds,
    attemptsByPinId: state.attemptsByPinId,
    revealedHintIds: state.revealedHintIds,
    letterOpened: state.letterOpened,
  }
  store.setItem(GIFT_HUNT_STORAGE_KEY, JSON.stringify(payload))
}

export function clearProgress(store: Store | null = browserStore()): void {
  store?.removeItem(GIFT_HUNT_STORAGE_KEY)
}
