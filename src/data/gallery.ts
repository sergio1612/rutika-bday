/**
 * Photographs of us.
 *
 * 1. Save the real picture in `public/images/` (jpg or webp is ideal).
 * 2. Set `src` to the public path, for example: '/images/tea-post.jpg'
 * 3. Write a true `alt` description and a `caption`.
 *
 * Leave `src` as null until the photograph is ready.
 * Frames without a picture stay as quiet placeholders — nothing here is a generated photo of us.
 */
export type Aspect = 'portrait' | 'landscape' | 'square'

export type GalleryItem = {
  id: string
  src: string | null
  alt: string
  caption: string
  aspect: Aspect
}

export const galleryIntro = 'The frames we keep coming back to.'

export const gallery: GalleryItem[] = [
  {
    id: '01',
    src: null,
    alt: 'A photograph of us, still to be added',
    caption: 'Us',
    aspect: 'portrait',
  },
  {
    id: '02',
    src: null,
    alt: 'A candid photograph, still to be added',
    caption: 'A candid',
    aspect: 'landscape',
  },
  {
    id: '03',
    src: null,
    alt: 'A favourite photograph, still to be added',
    caption: 'A favourite',
    aspect: 'portrait',
  },
  {
    id: '04',
    src: null,
    alt: 'An engagement photograph, still to be added',
    caption: 'Engagement',
    aspect: 'square',
  },
  {
    id: '05',
    src: null,
    alt: 'An outing photograph, still to be added',
    caption: 'An outing',
    aspect: 'landscape',
  },
  {
    id: '06',
    src: null,
    alt: 'A photograph of the two of us, still to be added',
    caption: 'Together',
    aspect: 'portrait',
  },
  {
    id: '07',
    src: null,
    alt: 'A celebration photograph, still to be added',
    caption: 'A celebration',
    aspect: 'landscape',
  },
  {
    id: '08',
    src: null,
    alt: 'Another photograph, still to be added',
    caption: 'Another moment',
    aspect: 'portrait',
  },
  {
    id: '09',
    src: null,
    alt: 'One more photograph, still to be added',
    caption: 'One more',
    aspect: 'square',
  },
]
