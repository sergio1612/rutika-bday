import type { GiftConfig, GiftDefinition } from './types'

/**
 * This is the only file you edit to manage the hunt.
 *
 * Add a gift: copy a block, give it new ids, and set `order`.
 * Remove a gift: delete its block. Progress for that id is ignored.
 * Reorder: change `order`. Keep the same `giftId` so her progress stays.
 * Hide a gift: set `enabled` to false.
 * Change when it opens: edit `unlockAt`. Times are India time, +05:30.
 * Change the code she finds on the gift: edit `pinConfig.value`.
 * Add another clue: push another object into `clues`, with its own clueId.
 * `location` is only for you. It is not shown on her screen.
 * Ids must stay unique and stable. Do not rename an id after she has started.
 */
const note = 'Write what you want her to read once she has found this one.'

function gift(entry: GiftDefinition): GiftDefinition {
  return entry
}

export const giftConfig: GiftConfig = {
  birthdayDate: '2026-11-24',
  timezone: 'Asia/Kolkata',
  intro: {
    title: 'A Little Treasure Hunt',
    subtitle:
      'Seven little surprises, hidden around your world. Each one has a clue, a little adventure, and a piece of my love.',
    cta: "Let's Begin",
  },
  gifts: [
    gift({
      giftId: 'gift-butterfly-clip-001',
      eventId: 'event-butterfly-clip-001',
      order: 1,
      enabled: true,
      role: 'sequential',
      required: true,
      requiresPin: true,
      dependsOnGiftId: null,
      name: 'Butterfly-shaped hair claw clip',
      description: 'A little surprise for you',
      unlockAt: '2026-11-24T09:00:00+05:30',
      pinConfig: {
        pinId: 'pin-butterfly-clip-001',
        value: 'CHANGE_ME',
        maxAttempts: 5,
      },
      clues: [
        {
          clueId: 'clue-butterfly-clip-001',
          title: 'A little hint',
          description: 'Your personalized clue goes here.',
          hints: [
            {
              hintId: 'hint-butterfly-clip-001',
              text: 'An optional extra nudge goes here.',
            },
          ],
        },
      ],
      location: 'CHANGE_ME',
      completionMessage: {
        messageId: 'message-butterfly-clip-001',
        text: note,
      },
      image: null,
    }),
    gift({
      giftId: 'gift-eye-mask-001',
      eventId: 'event-eye-mask-001',
      order: 2,
      enabled: true,
      role: 'sequential',
      required: true,
      requiresPin: true,
      dependsOnGiftId: null,
      name: 'Cute eye mask',
      description: 'A little surprise for you',
      unlockAt: '2026-11-24T11:00:00+05:30',
      pinConfig: {
        pinId: 'pin-eye-mask-001',
        value: 'CHANGE_ME',
        maxAttempts: 5,
      },
      clues: [
        {
          clueId: 'clue-eye-mask-001',
          title: 'A little hint',
          description: 'Your personalized clue goes here.',
          hints: [
            {
              hintId: 'hint-eye-mask-001',
              text: 'An optional extra nudge goes here.',
            },
          ],
        },
      ],
      location: 'CHANGE_ME',
      completionMessage: {
        messageId: 'message-eye-mask-001',
        text: note,
      },
      image: null,
    }),
    gift({
      giftId: 'gift-round-container-001',
      eventId: 'event-round-container-001',
      order: 3,
      enabled: true,
      role: 'sequential',
      required: true,
      requiresPin: true,
      dependsOnGiftId: null,
      name: 'Small cute round container',
      description: 'A little surprise for you',
      unlockAt: '2026-11-24T13:00:00+05:30',
      pinConfig: {
        pinId: 'pin-round-container-001',
        value: 'CHANGE_ME',
        maxAttempts: 5,
      },
      clues: [
        {
          clueId: 'clue-round-container-001',
          title: 'A little hint',
          description: 'Your personalized clue goes here.',
          hints: [
            {
              hintId: 'hint-round-container-001',
              text: 'An optional extra nudge goes here.',
            },
          ],
        },
      ],
      location: 'CHANGE_ME',
      completionMessage: {
        messageId: 'message-round-container-001',
        text: note,
      },
      image: null,
    }),
    gift({
      giftId: 'gift-photo-frames-001',
      eventId: 'event-photo-frames-001',
      order: 4,
      enabled: true,
      role: 'sequential',
      required: true,
      requiresPin: true,
      dependsOnGiftId: null,
      name: 'Two personalized photo frames',
      description: 'A little surprise for you',
      unlockAt: '2026-11-24T15:00:00+05:30',
      pinConfig: {
        pinId: 'pin-photo-frames-001',
        value: 'CHANGE_ME',
        maxAttempts: 5,
      },
      clues: [
        {
          clueId: 'clue-photo-frames-001',
          title: 'A little hint',
          description: 'Your personalized clue goes here.',
          hints: [
            {
              hintId: 'hint-photo-frames-001',
              text: 'An optional extra nudge goes here.',
            },
          ],
        },
      ],
      location: 'CHANGE_ME',
      completionMessage: {
        messageId: 'message-photo-frames-001',
        text: note,
      },
      image: null,
    }),
    gift({
      giftId: 'gift-ring-container-001',
      eventId: 'event-ring-container-001',
      order: 5,
      enabled: true,
      role: 'sequential',
      required: true,
      requiresPin: true,
      dependsOnGiftId: null,
      name: 'Tiny metal ring container',
      description: 'A little surprise for you',
      unlockAt: '2026-11-24T17:00:00+05:30',
      pinConfig: {
        pinId: 'pin-ring-container-001',
        value: 'CHANGE_ME',
        maxAttempts: 5,
      },
      clues: [
        {
          clueId: 'clue-ring-container-001',
          title: 'A little hint',
          description: 'Your personalized clue goes here.',
          hints: [
            {
              hintId: 'hint-ring-container-001',
              text: 'An optional extra nudge goes here.',
            },
          ],
        },
      ],
      location: 'CHANGE_ME',
      completionMessage: {
        messageId: 'message-ring-container-001',
        text: note,
      },
      image: null,
    }),
    gift({
      giftId: 'gift-panda-lamp-001',
      eventId: 'event-panda-lamp-001',
      order: 6,
      enabled: true,
      role: 'sequential',
      required: true,
      requiresPin: true,
      dependsOnGiftId: null,
      name: 'Panda silicone lamp',
      description: 'A little surprise for you',
      unlockAt: '2026-11-24T19:00:00+05:30',
      pinConfig: {
        pinId: 'pin-panda-lamp-001',
        value: 'CHANGE_ME',
        maxAttempts: 5,
      },
      clues: [
        {
          clueId: 'clue-panda-lamp-001',
          title: 'A little hint',
          description: 'Your personalized clue goes here.',
          hints: [
            {
              hintId: 'hint-panda-lamp-001',
              text: 'An optional extra nudge goes here.',
            },
          ],
        },
      ],
      location: 'CHANGE_ME',
      completionMessage: {
        messageId: 'message-panda-lamp-001',
        text: note,
      },
      image: null,
    }),
    gift({
      giftId: 'gift-earrings-001',
      eventId: 'event-earrings-001',
      order: 7,
      enabled: true,
      role: 'sequential',
      required: true,
      requiresPin: true,
      dependsOnGiftId: null,
      name: 'Collection of 12 earrings',
      description: 'A little surprise for you',
      unlockAt: '2026-11-24T21:00:00+05:30',
      pinConfig: {
        pinId: 'pin-earrings-001',
        value: 'CHANGE_ME',
        maxAttempts: 5,
      },
      clues: [
        {
          clueId: 'clue-earrings-001',
          title: 'A little hint',
          description: 'Your personalized clue goes here.',
          hints: [
            {
              hintId: 'hint-earrings-001',
              text: 'An optional extra nudge goes here.',
            },
          ],
        },
      ],
      location: 'CHANGE_ME',
      completionMessage: {
        messageId: 'message-earrings-001',
        text: note,
      },
      image: null,
    }),
  ],
}
