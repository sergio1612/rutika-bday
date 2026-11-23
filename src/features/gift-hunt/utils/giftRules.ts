import type { GiftDefinition, GiftStatus, LockReason, PinOutcome } from '../data/types'
import type { GiftHuntState } from '../state/giftInitialState'
import { parseSchedule } from './dateUtils'
import { isCompletePin } from './pinInput'

export function enabledGifts(gifts: GiftDefinition[]): GiftDefinition[] {
  return gifts.filter((gift) => gift.enabled).sort((a, b) => a.order - b.order || a.giftId.localeCompare(b.giftId))
}

export function sequentialGifts(gifts: GiftDefinition[]): GiftDefinition[] {
  return enabledGifts(gifts).filter((gift) => gift.role !== 'bonus')
}

export function requiredGifts(gifts: GiftDefinition[]): GiftDefinition[] {
  return enabledGifts(gifts).filter((gift) => gift.required)
}

export function dependencyMet(gift: GiftDefinition, gifts: GiftDefinition[], completed: ReadonlySet<string>): boolean {
  if (gift.dependsOnGiftId) return completed.has(gift.dependsOnGiftId)
  if (gift.role === 'bonus') return true
  const sequence = sequentialGifts(gifts)
  const index = sequence.findIndex((item) => item.giftId === gift.giftId)
  if (index <= 0) return true
  const previous = sequence[index - 1]
  return previous ? completed.has(previous.giftId) : true
}

export function lockReasonFor(
  gift: GiftDefinition,
  gifts: GiftDefinition[],
  completed: ReadonlySet<string>,
  nowMs: number,
): LockReason {
  if (completed.has(gift.giftId)) return null
  const ready = dependencyMet(gift, gifts, completed)
  const open = nowMs >= parseSchedule(gift.unlockAt)
  if (!ready) return 'previous'
  if (!open) return 'time'
  return null
}

export function statusFor(
  gift: GiftDefinition,
  gifts: GiftDefinition[],
  completed: ReadonlySet<string>,
  nowMs: number,
): GiftStatus {
  if (completed.has(gift.giftId)) return 'completed'
  if (lockReasonFor(gift, gifts, completed, nowMs) === null) return 'available'
  return 'locked'
}

export function finaleUnlocked(gifts: GiftDefinition[], completed: ReadonlySet<string>): boolean {
  const required = requiredGifts(gifts)
  if (required.length === 0) return false
  return required.every((gift) => completed.has(gift.giftId))
}

export function evaluatePin(
  state: GiftHuntState,
  gifts: GiftDefinition[],
  giftId: string,
  pin: string,
  nowMs: number,
): PinOutcome {
  if (!isCompletePin(pin)) return 'empty'
  const gift = gifts.find((item) => item.giftId === giftId)
  if (!gift?.enabled || !gift.requiresPin || !gift.pinConfig) return 'unavailable'
  const completed = new Set(state.completedGiftIds)
  if (statusFor(gift, gifts, completed, nowMs) !== 'available') return 'unavailable'
  const used = state.attemptsByPinId[gift.pinConfig.pinId] ?? 0
  if (used >= gift.pinConfig.maxAttempts) return 'locked-out'
  if (pin === gift.pinConfig.value) return 'success'
  return 'incorrect'
}
