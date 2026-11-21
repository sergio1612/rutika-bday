import type { GiftDefinition } from '../data/types'
import { evaluatePin, statusFor } from '../utils/giftRules'
import { initialGiftHuntState, type GiftHuntState } from './giftInitialState'

export type GiftHuntAction =
  | { type: 'start' }
  | { type: 'verify-pin'; giftId: string; pin: string; now: number; gifts: GiftDefinition[] }
  | { type: 'complete-without-pin'; giftId: string; now: number; gifts: GiftDefinition[] }
  | { type: 'reveal-hint'; hintId: string }
  | { type: 'open-letter' }
  | { type: 'reset' }

function completeGift(state: GiftHuntState, giftId: string): GiftHuntState {
  if (state.completedGiftIds.includes(giftId)) return state
  return { ...state, completedGiftIds: [...state.completedGiftIds, giftId] }
}

export function giftReducer(state: GiftHuntState, action: GiftHuntAction): GiftHuntState {
  switch (action.type) {
    case 'start':
      return state.started ? state : { ...state, started: true }
    case 'verify-pin': {
      const outcome = evaluatePin(state, action.gifts, action.giftId, action.pin, action.now)
      const gift = action.gifts.find((item) => item.giftId === action.giftId)
      if (!gift?.pinConfig) return state
      if (outcome === 'success') return completeGift(state, gift.giftId)
      if (outcome !== 'incorrect') return state
      const pinId = gift.pinConfig.pinId
      return {
        ...state,
        attemptsByPinId: {
          ...state.attemptsByPinId,
          [pinId]: (state.attemptsByPinId[pinId] ?? 0) + 1,
        },
      }
    }
    case 'complete-without-pin': {
      const gift = action.gifts.find((item) => item.giftId === action.giftId)
      if (!gift?.enabled || gift.requiresPin) return state
      const status = statusFor(gift, action.gifts, new Set(state.completedGiftIds), action.now)
      if (status !== 'available') return state
      return completeGift(state, gift.giftId)
    }
    case 'reveal-hint':
      if (state.revealedHintIds.includes(action.hintId)) return state
      return { ...state, revealedHintIds: [...state.revealedHintIds, action.hintId] }
    case 'open-letter':
      return state.letterOpened ? state : { ...state, letterOpened: true }
    case 'reset':
      return initialGiftHuntState
    default:
      return state
  }
}
