import type { GiftConfig, GiftDefinition, PhysicalCard } from './types'

/**
 * This is the only file you edit to manage the hunt.
 *
 * Add a gift: copy a block, give it new ids, and set `order`.
 * Remove a gift: delete its block. Progress for that id is ignored.
 * Reorder: change `order`. Keep the same `giftId` so her progress stays.
 * Hide a gift: set `enabled` to false.
 * Change when the hunt opens: edit `HUNT_OPENS_AT`. The time is India time, +05:30.
 * Change the code she finds on the gift: edit `pinConfig.value`.
 * The first gift's `clues` are the website riddle. Later gifts are found from the physical note.
 * `location` is only for you. It is not shown on her screen.
 * Ids must stay unique and stable. Do not rename an id after she has started.
 * `completionMessage.text` is the line she reads after finding a gift. Leave it blank until you write it.
 */

/** Every clue opens together at 7:00 pm IST on 24 November. Order still waits on the previous gift. */
const HUNT_OPENS_AT = '2026-11-24T19:00:00+05:30'

const FIRST_RIDDLE = `A new day begins, a new journey awaits,

Your first little surprise is hiding where your daily ride waits.

Look beneath the seat, where little things stay,

Your birthday adventure starts there today!`

const CARD_VERSES = [
  `Tiny paws, playful days,

A little corner filled with toys and plays.

Your next surprise is hiding near,

Where little furry friends keep their treasures dear!`,
  `Three quiet companions, parked in a row,

The pale one is first, the place you should go.

No present is waiting inside that small door,

Only a note that will lead you once more.`,
  `Where aromas dance and ingredients stay,

Little kitchen secrets are tucked away.

Look beyond the everyday cooking scene,

Your next surprise hides where supplies are kept clean!`,
  `A peaceful corner, filled with grace,

Old memories resting in their place.

Where prayers meet pictures from days gone by,

Your next little surprise is waiting nearby!`,
  `After a long day, you rest right here,

A little table stands somewhere near.

Don't look above, don't look around,

Your next surprise is underneath, waiting to be found!`,
  `Someone who shares your home and your days,

Has a cupboard holding things in their place.

Your next surprise is not in yours,

Go find it behind another person's doors!`,
  `Little colours, little art,

A special corner close to your heart.

Where your nail creations find their place,

Your final gift is waiting in that space!`,
  `Eight little surprises, one beautiful day,

But there's one last thing I still want to say.

Your final surprise isn't hidden somewhere new,

It's waiting on the screen, made especially for you. ❤️`,
] as const

const VICTORIS_NOTE = `White kept its secret, short and true,

Now find the blue one, second in the crew.

Again, no gift, only another small line,

The blue door is next. Take your time.`

const SWIFT_NOTE = `Blue has spoken, one still remains,

The red one holds what this chase contains.

Open that last little door and see,

Your next small gift is waiting patiently.`

function huntNote(
  giftId: string,
  order: number,
  location: string,
  verse: string,
  nextGiftId: string,
): GiftDefinition {
  return {
    giftId,
    eventId: `event-${giftId}`,
    order,
    enabled: true,
    role: 'sequential',
    required: false,
    requiresPin: false,
    dependsOnGiftId: null,
    name: 'A note, not a gift',
    description: 'A clue is waiting here. There is no gift.',
    unlockAt: HUNT_OPENS_AT,
    pinConfig: null,
    clues: [],
    location,
    physicalCard: {
      cardId: `card-${giftId}`,
      verse,
      nextGiftId,
    },
    completionMessage: {
      messageId: `message-${giftId}`,
      text: '',
    },
    image: null,
  }
}

function huntGift(
  order: number,
  name: string,
  location: string,
  pin: string,
  nextGiftId: string | null,
): GiftDefinition {
  const id = String(order).padStart(2, '0')
  const verse = CARD_VERSES[order - 1]
  if (!verse) throw new Error(`Missing hunt copy for gift ${id}`)
  const physicalCard: PhysicalCard = {
    cardId: `card-${id}`,
    verse,
    nextGiftId,
  }
  return {
    giftId: `gift-${id}`,
    eventId: `event-${id}`,
    order,
    enabled: true,
    role: 'sequential',
    required: true,
    requiresPin: true,
    dependsOnGiftId: null,
    name,
    description: 'A little surprise for you',
    unlockAt: HUNT_OPENS_AT,
    pinConfig: {
      pinId: `pin-${id}`,
      value: pin,
      maxAttempts: 5,
    },
    clues:
      order === 1
        ? [
            {
              clueId: 'clue-01',
              title: 'Your First Little Adventure',
              description: FIRST_RIDDLE,
              hints: [],
            },
          ]
        : [],
    location,
    physicalCard,
    completionMessage: {
      messageId: `message-${id}`,
      text: '',
    },
    image: null,
  }
}

export const giftConfig: GiftConfig = {
  birthdayDate: '2026-11-24',
  timezone: 'Asia/Kolkata',
  intro: {
    title: 'A Little Treasure Hunt',
    subtitle:
      'Eight little surprises, eight hidden places, and countless reasons to smile.\n\nYour birthday adventure is about to begin.\n\nSome surprises are worth waiting for. ❤️',
    waiting: 'Your first little surprise is waiting for the perfect moment... ❤️',
    cta: "Let's Begin",
  },
  gifts: [
    huntGift(1, 'Butterfly-shaped hair claw clip', 'Activa scooter dicky', '9062', 'gift-02'),
    huntGift(2, 'Cute eye mask', 'Pet toys compartment/drawer', '5831', 'clue-victoris'),
    huntNote('clue-victoris', 2.3, 'White Victoris glove box', VICTORIS_NOTE, 'clue-swift'),
    huntNote('clue-swift', 2.6, 'Blue Swift Dzire glove box', SWIFT_NOTE, 'gift-03'),
    huntGift(3, 'Small cute round container', 'Red Brezza glove box', '7426', 'gift-04'),
    huntGift(4, 'Personalized photo frame', 'Kitchen storeroom', '1964', 'gift-05'),
    huntGift(5, 'Tiny metal ring container with a secret note', 'Mandir room – cupboard containing old photo albums', '8357', 'gift-06'),
    huntGift(6, 'Panda silicone lamp', 'Under the bedroom side table/tipoy', '4209', 'gift-07'),
    huntGift(7, 'Collection of 12 earrings', "Manthan's cupboard", '6713', 'gift-08'),
    huntGift(8, 'Bracelet', "Rutu's nail supplies cupboard", '2948', null),
  ],
}
