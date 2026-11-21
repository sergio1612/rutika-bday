import type { HuntLetter } from './types'

/** Shown only after every enabled, required gift is complete. Edit freely. */
export const huntLetter: HuntLetter = {
  heading: 'One Last Thing, Rutu',
  preamble:
    'Some gifts can be wrapped, some memories can be framed, but what I feel for you could never fit inside a box.',
  sections: [
    {
      letterSectionId: 'letter-section-feelings-001',
      text: 'Some gifts can be wrapped, some memories can be framed, but what I feel for you could never fit inside a box.',
    },
    {
      letterSectionId: 'letter-section-more-001',
      text: 'Write the rest of this letter here. Add another section in this list whenever you want another page of it.',
    },
  ],
  closing: 'Forever yours,',
  signature: 'Your Manav',
}
