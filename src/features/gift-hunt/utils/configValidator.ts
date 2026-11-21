import type { GiftConfig } from '../data/types'
import type { HuntLetter } from '../data/types'
import { parseSchedule } from './dateUtils'

function duplicates(ids: string[]): string[] {
  const seen = new Set<string>()
  const repeated = new Set<string>()
  for (const id of ids) {
    if (seen.has(id)) repeated.add(id)
    seen.add(id)
  }
  return [...repeated]
}

export function validateGiftConfig(config: GiftConfig, letter: HuntLetter): string[] {
  const warnings: string[] = []
  const gifts = config.gifts
  const ids = [
    ...gifts.flatMap((gift) => [
      gift.giftId,
      gift.eventId,
      gift.pinConfig?.pinId,
      gift.completionMessage.messageId,
      ...gift.clues.flatMap((clue) => [clue.clueId, ...clue.hints.map((hint) => hint.hintId)]),
    ]),
    ...letter.sections.map((section) => section.letterSectionId),
  ].filter((id): id is string => Boolean(id))

  for (const id of duplicates(ids)) {
    warnings.push(`Duplicate id "${id}". Every gift, clue, hint, pin, event, message, and letter section needs its own id.`)
  }

  const blank = ids.filter((id) => !id.trim())
  if (blank.length > 0) warnings.push('A configured id is empty.')

  const knownGifts = new Set(gifts.map((gift) => gift.giftId))
  for (const gift of gifts) {
    if (!gift.giftId.trim()) warnings.push('A gift is missing giftId.')
    if (Number.isNaN(parseSchedule(gift.unlockAt))) {
      warnings.push(`"${gift.giftId}" has an unlock time that cannot be read: ${gift.unlockAt}`)
    }
    if (gift.requiresPin && !gift.pinConfig) {
      warnings.push(`"${gift.giftId}" asks for a PIN but has no pinConfig.`)
    }
    if (gift.pinConfig && gift.pinConfig.maxAttempts < 1) {
      warnings.push(`"${gift.pinConfig.pinId}" needs at least one attempt.`)
    }
    if (gift.clues.length === 0) warnings.push(`"${gift.giftId}" has no clues.`)
    if (gift.dependsOnGiftId && !knownGifts.has(gift.dependsOnGiftId)) {
      warnings.push(`"${gift.giftId}" depends on missing gift "${gift.dependsOnGiftId}".`)
    }
    if (gift.dependsOnGiftId === gift.giftId) {
      warnings.push(`"${gift.giftId}" cannot depend on itself.`)
    }
  }

  const enabledOrders = gifts.filter((gift) => gift.enabled).map((gift) => gift.order)
  for (const order of duplicates(enabledOrders.map(String))) {
    warnings.push(`Two enabled gifts share order ${order}. Give each enabled gift its own order.`)
  }

  return warnings
}

export function warnIfGiftConfigInvalid(config: GiftConfig, letter: HuntLetter): void {
  if (!import.meta.env.DEV) return
  for (const warning of validateGiftConfig(config, letter)) {
    console.warn(`[gift-hunt] ${warning}`)
  }
}
