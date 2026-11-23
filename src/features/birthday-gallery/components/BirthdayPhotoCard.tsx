import type { BirthdayPhoto } from '../data/birthdayPhotos'

const TILT = ['md:-rotate-1', '', 'md:rotate-1'] as const

export function BirthdayPhotoCard({
  photo,
  failed,
  onOpen,
  onFail,
}: {
  photo: BirthdayPhoto
  failed: boolean
  onOpen: (photoId: string) => void
  onFail: (photoId: string) => void
}) {
  const tilt = TILT[(photo.birthdayNumber - 1) % TILT.length]
  const number = String(photo.birthdayNumber).padStart(2, '0')

  return (
    <button
      type="button"
      onClick={() => onOpen(photo.photoId)}
      aria-label={`Open ${photo.label}`}
      className={`group block w-full text-left transition duration-300 hover:-translate-y-1 ${tilt}`}
    >
      <span className="block rounded-sm bg-paper p-2.5 pb-4 shadow-sm ring-1 ring-gold/20 transition duration-300 group-hover:shadow-md">
        <span className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-sm bg-cream-2">
          {failed ? (
            <Placeholder label={photo.label} />
          ) : (
            <img
              src={photo.image}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              onError={() => onFail(photo.photoId)}
              className="h-full w-full object-contain"
            />
          )}
        </span>
        <span className="mt-3 block px-1 text-center">
          <span className="font-script text-3xl text-rose-deep">{number}</span>
          <span className="mt-1 block font-serif text-lg leading-tight text-ink">{photo.label}</span>
          {photo.caption ? (
            <span className="mt-1 block text-sm font-light leading-relaxed text-ink-soft">{photo.caption}</span>
          ) : null}
        </span>
      </span>
    </button>
  )
}

function Placeholder({ label }: { label: string }) {
  return (
    <span className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-cream-2 via-paper to-blush/70 px-3 text-center">
      <span className="font-script text-3xl text-rose-deep/80">{label}</span>
      <span className="mt-2 text-[0.58rem] uppercase tracking-[0.22em] text-gold">A photograph for this year</span>
    </span>
  )
}
