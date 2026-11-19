/**
 * 24 reasons. Replace every `note` with your own words before Rutu reads this.
 * Labels are only prompts — rename any that are not true.
 * Do not leave the placeholder sentences in the site you give her.
 */
export type Reason = {
  id: number
  label: string
  note: string
}

export const reasonsIntro = 'Twenty-four notes, waiting to be opened.'

export const reasons: Reason[] = [
  {
    id: 1,
    label: 'Your smile',
    note: 'Write what her smile does to you.',
  },
  {
    id: 2,
    label: 'Your presence',
    note: 'Write how it feels when she is simply there.',
  },
  {
    id: 3,
    label: 'A little habit',
    note: 'Write a real habit of hers — only one you have actually noticed.',
  },
  {
    id: 4,
    label: 'Ordinary days',
    note: 'Write how she makes an ordinary day feel special.',
  },
  {
    id: 5,
    label: 'How you make me feel',
    note: 'Write the feeling she gives you, in your words.',
  },
  {
    id: 6,
    label: 'Your laugh',
    note: 'Write about her laugh.',
  },
  {
    id: 7,
    label: 'The way you care',
    note: 'Write something true about how she shows care.',
  },
  {
    id: 8,
    label: 'A shared memory',
    note: 'Write a memory that belongs to the two of you.',
  },
  {
    id: 9,
    label: 'Your voice',
    note: 'Write what her voice means to you.',
  },
  {
    id: 10,
    label: 'Quiet moments',
    note: 'Write about a quiet moment you want her to remember.',
  },
  {
    id: 11,
    label: 'Little things you do',
    note: 'Write one small thing she does that stays with you.',
  },
  {
    id: 12,
    label: 'Being beside you',
    note: 'Write what changes when she is next to you.',
  },
  {
    id: 13,
    label: 'Your dreams',
    note: 'Write about a dream of hers you want to stand beside.',
  },
  {
    id: 14,
    label: 'The way you look at me',
    note: 'Write what that look feels like.',
  },
  {
    id: 15,
    label: 'Tea Post',
    note: 'Write what you want to remember from 12 October 2023.',
  },
  {
    id: 16,
    label: 'The day I proposed',
    note: 'Write what 14 February 2024 still means to you.',
  },
  {
    id: 17,
    label: 'Our families',
    note: 'Write what 31 August 2025 meant, in your words.',
  },
  {
    id: 18,
    label: 'Our engagement',
    note: 'Write about 14 February 2026.',
  },
  {
    id: 19,
    label: 'Adventures',
    note: 'Write a day or a place you want to keep.',
  },
  {
    id: 20,
    label: 'How safe this feels',
    note: 'Write how she makes you feel, without inventing a scene.',
  },
  {
    id: 21,
    label: 'Conversations',
    note: 'Write about the talks you do not want to end.',
  },
  {
    id: 22,
    label: 'Home',
    note: 'Write what home has come to mean with her.',
  },
  {
    id: 23,
    label: 'The life ahead',
    note: 'Write the future you hope to build together.',
  },
  {
    id: 24,
    label: 'Simply you',
    note: 'Write the reason that is just her, being her.',
  },
]
