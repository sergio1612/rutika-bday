import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { gallery, galleryIntro, type GalleryItem } from '../data/gallery'
import { Portal } from './Portal'
import { SectionHeading } from './SectionHeading'

const ASPECT = {
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  square: 'aspect-square',
} as const

function Frame({ item, failed }: { item: GalleryItem; failed: boolean }) {
  if (item.src && !failed) {
    return (
      <img
        src={item.src}
        alt={item.alt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    )
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-cream-2 via-paper to-blush/70 px-4 text-center">
      <span className="font-script text-4xl text-rose-deep/80">{item.caption}</span>
      <span className="mt-2 text-[0.62rem] uppercase tracking-[0.28em] text-gold">A frame for us</span>
    </div>
  )
}

function Lightbox({
  index,
  failed,
  onClose,
  onPrev,
  onNext,
  onFail,
}: {
  index: number
  failed: Record<string, boolean>
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  onFail: (id: string) => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const swiped = useRef(false)
  const item = gallery[index]

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
      aria-label={item.caption}
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
        onClick={onClose}
        aria-label="Close photograph"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-cream/30"
      >
        <X className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Previous photograph"
        onClick={(event) => {
          event.stopPropagation()
          onPrev()
        }}
        className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream/30 md:left-8"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <figure
        className="w-full max-w-4xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative mx-auto overflow-hidden rounded-2xl bg-paper">
          {item.src && !failed[item.id] ? (
            <img
              src={item.src}
              alt={item.alt}
              className="max-h-[74svh] w-full object-contain"
              decoding="async"
              onError={() => onFail(item.id)}
            />
          ) : (
            <div className="flex min-h-[46svh] items-center justify-center bg-gradient-to-br from-cream-2 via-paper to-blush/70 px-8">
              <div className="text-center">
                <p className="font-script text-6xl text-rose-deep">{item.caption}</p>
                <p className="mt-3 text-[0.68rem] uppercase tracking-[0.28em] text-gold">A frame for us</p>
              </div>
            </div>
          )}
        </div>
        <figcaption className="mt-4 text-center">
          <p className="font-serif text-2xl">{item.caption}</p>
          <p className="mt-1 text-[0.68rem] uppercase tracking-[0.24em] text-gold-bright">
            {index + 1} / {gallery.length}
          </p>
        </figcaption>
      </figure>
      <button
        type="button"
        aria-label="Next photograph"
        onClick={(event) => {
          event.stopPropagation()
          onNext()
        }}
        className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream/30 md:right-8"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}

export function PhotoGallery() {
  const [active, setActive] = useState<number | null>(null)
  const [failed, setFailed] = useState<Record<string, boolean>>({})

  const markFailed = useCallback((id: string) => {
    setFailed((current) => ({ ...current, [id]: true }))
  }, [])

  const close = useCallback(() => setActive(null), [])
  const showPrevious = useCallback(
    () =>
      setActive((current) =>
        current == null ? current : (current - 1 + gallery.length) % gallery.length,
      ),
    [],
  )
  const showNext = useCallback(
    () => setActive((current) => (current == null ? current : (current + 1) % gallery.length)),
    [],
  )

  return (
    <section id="moments" className="scroll-mt-20 px-5 py-24 md:px-8 md:py-32">
      <SectionHeading eyebrow="A gallery of us" title="Little moments, infinite memories." subtitle={galleryIntro} />

      <div className="mx-auto max-w-6xl columns-1 gap-4 sm:columns-2 lg:columns-3">
        {gallery.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Open photograph: ${item.caption}`}
            className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl text-left shadow-sm ring-1 ring-ink/5 transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className={`relative block overflow-hidden ${ASPECT[item.aspect]}`}>
              {item.src && !failed[item.id] ? (
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  onError={() => markFailed(item.id)}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 md:group-hover:scale-[1.04]"
                />
              ) : (
                <Frame item={item} failed />
              )}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/70 to-transparent p-4 opacity-100 md:opacity-0 md:transition md:group-hover:opacity-100">
                <span className="font-serif text-2xl text-cream">{item.caption}</span>
              </span>
            </span>
          </button>
        ))}
      </div>

      {active != null ? (
        <Portal>
          <Lightbox
            index={active}
            failed={failed}
            onFail={markFailed}
            onClose={close}
            onPrev={showPrevious}
            onNext={showNext}
          />
        </Portal>
      ) : null}
    </section>
  )
}
