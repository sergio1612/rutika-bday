import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { BirthdayPhoto } from '../data/birthdayPhotos'

export function BirthdayLightbox({
  photo,
  position,
  total,
  failed,
  onClose,
  onPrev,
  onNext,
  onFail,
}: {
  photo: BirthdayPhoto
  position: number
  total: number
  failed: boolean
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  onFail: (photoId: string) => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const swiped = useRef(false)

  useEffect(() => {
    const previous = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onPrev()
      if (event.key === 'ArrowRight') onNext()
      if (event.key !== 'Tab' || !dialogRef.current) return
      const nodes = [...dialogRef.current.querySelectorAll<HTMLElement>('button')]
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [onClose, onNext, onPrev])

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={photo.label}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-night/88 px-4 py-16 text-cream backdrop-blur-md"
      onClick={() => {
        if (swiped.current) {
          swiped.current = false
          return
        }
        onClose()
      }}
      onTouchStart={(event) => {
        startX.current = event.changedTouches[0]?.clientX ?? 0
      }}
      onTouchEnd={(event) => {
        const end = event.changedTouches[0]?.clientX ?? startX.current
        const delta = end - startX.current
        if (Math.abs(delta) < 48) return
        swiped.current = true
        if (delta > 0) onPrev()
        else onNext()
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onClose()
        }}
        aria-label="Close photograph"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-cream/30"
      >
        <X className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Previous birthday"
        onClick={(event) => {
          event.stopPropagation()
          onPrev()
        }}
        className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream/30 md:left-8"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <figure className="w-full max-w-3xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex max-h-[70svh] min-h-[42svh] items-center justify-center overflow-hidden rounded-2xl bg-paper">
          {failed ? (
            <p className="px-8 text-center font-script text-5xl text-rose-deep">{photo.label}</p>
          ) : (
            <img
              src={photo.image}
              alt={photo.alt}
              decoding="async"
              onError={() => onFail(photo.photoId)}
              className="max-h-[70svh] w-full object-contain"
            />
          )}
        </div>
        <figcaption className="mt-4 text-center">
          <p className="font-script text-4xl text-gold-bright">{String(photo.birthdayNumber).padStart(2, '0')}</p>
          <p className="mt-1 font-serif text-2xl">{photo.label}</p>
          {photo.caption ? <p className="mt-2 font-light text-cream/80">{photo.caption}</p> : null}
          <p className="mt-2 text-[0.68rem] uppercase tracking-[0.24em] text-gold-bright">
            {position} of {total}
          </p>
        </figcaption>
      </figure>
      <button
        type="button"
        aria-label="Next birthday"
        onClick={(event) => {
          event.stopPropagation()
          onNext()
        }}
        className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream/30 md:right-8"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
