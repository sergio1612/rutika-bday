export type GiftHint = {
  hintId: string
  text: string
}

export type GiftClue = {
  clueId: string
  title: string
  description: string
  hints: GiftHint[]
}

export type PinConfig = {
  pinId: string
  value: string
  maxAttempts: number
}

export type CompletionMessage = {
  messageId: string
  text: string
}

/** The note tied to this gift. It points toward the next place and is not shown before the gift is found. */
export type PhysicalCard = {
  cardId: string
  verse: string
  nextGiftId: string | null
}

export type GiftDefinition = {
  giftId: string
  eventId: string
  order: number
  enabled: boolean
  /** Sequential gifts wait for the previous one. Bonus gifts never block the path. */
  role: 'sequential' | 'bonus'
  /** When false, this gift does not hold back the final letter. */
  required: boolean
  requiresPin: boolean
  /** Set this to wait on a specific gift. Null follows the previous sequential gift. */
  dependsOnGiftId: string | null
  name: string
  description: string
  unlockAt: string
  pinConfig: PinConfig | null
  clues: GiftClue[]
  /** Where you will hide it. She never sees this field. The clue is what she reads. */
  location: string
  physicalCard: PhysicalCard | null
  completionMessage: CompletionMessage
  image: string | null
}

export type GiftHuntIntro = {
  title: string
  subtitle: string
  waiting: string
  cta: string
}

export type GiftConfig = {
  birthdayDate: string
  timezone: 'Asia/Kolkata'
  intro: GiftHuntIntro
  gifts: GiftDefinition[]
}

export type LetterSection = {
  letterSectionId: string
  text: string
}

export type HuntLetter = {
  heading: string
  preamble: string
  sections: LetterSection[]
  closing: string
  signature: string
}

export type GiftStatus = 'locked' | 'available' | 'completed'

export type LockReason = 'time' | 'previous' | null

export type PinOutcome = 'success' | 'incorrect' | 'locked-out' | 'unavailable' | 'empty'
