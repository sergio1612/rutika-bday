/**
 * Our story. Edit the words here — descriptions stay limited to what we know.
 * Optional photo: put a file in public/images and set `image` to '/images/your-file.jpg'.
 */
export type Memory = {
  id: string
  date: string
  title: string
  description: string
  image: string | null
  imageAlt: string
}

export const memories: Memory[] = [
  {
    id: 'childhood',
    date: 'Childhood',
    title: 'An unexpected connection',
    description: 'Our unexpected connection goes back further than we realized.',
    image: null,
    imageAlt: '',
  },
  {
    id: 'tea-post',
    date: '12 October 2023',
    title: 'Tea Post',
    description: 'Our first special meeting at Tea Post, Pakwaan Cross Road.',
    image: null,
    imageAlt: '',
  },
  {
    id: 'proposal',
    date: '14 February 2024',
    title: 'The proposal',
    description: 'The day I proposed.',
    image: null,
    imageAlt: '',
  },
  {
    id: 'families',
    date: '31 August 2025',
    title: 'Our families',
    description: 'The day our families came together and accepted our relationship.',
    image: null,
    imageAlt: '',
  },
  {
    id: 'engagement',
    date: '14 February 2026',
    title: 'Our engagement',
    description: 'Our engagement day.',
    image: null,
    imageAlt: '',
  },
]
