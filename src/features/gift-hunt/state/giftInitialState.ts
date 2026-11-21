export type GiftHuntState = {
  started: boolean
  completedGiftIds: string[]
  attemptsByPinId: Record<string, number>
  revealedHintIds: string[]
  letterOpened: boolean
}

export const initialGiftHuntState: GiftHuntState = {
  started: false,
  completedGiftIds: [],
  attemptsByPinId: {},
  revealedHintIds: [],
  letterOpened: false,
}
