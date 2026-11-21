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
    return {
      started: parsed.started,
      completedGiftIds: [...new Set(parsed.completedGiftIds)],
      attemptsByPinId: parsed.attemptsByPinId,
      revealedHintIds: [...new Set(parsed.revealedHintIds)],
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
