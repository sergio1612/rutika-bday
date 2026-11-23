import { useEffect, useState } from 'react'
import { birthdayConfig } from '../config/birthdayConfig'
import { useReducedMotion } from '../hooks/useReducedMotion'

const SECTIONS = [
  { id: 'birthday', label: 'Birthday' },
  { id: 'years', label: 'Years' },
  ...(birthdayConfig.showMoments ? [{ id: 'moments', label: 'Moments' }] : []),
  { id: 'reasons', label: 'Reasons' },
  { id: 'letter', label: 'Letter' },
  { id: 'gift', label: 'Gift ♡' },
]

export function SectionProgress({ onOpenGifts }: { onOpenGifts: () => void }) {
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(SECTIONS[0].id)

  useEffect(() => {
    const onScroll = () => {
      const root = document.documentElement
      const max = root.scrollHeight - root.clientHeight
      setProgress(max > 0 ? root.scrollTop / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const nodes = SECTIONS.map((section) => document.getElementById(section.id)).filter(
      (node): node is HTMLElement => node instanceof HTMLElement,
    )
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActive(visible.target.id)
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: [0, 0.25, 0.5] },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-0.5"
        role="progressbar"
        aria-label="How far you have read"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div
          className="h-full origin-left bg-gold"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <nav aria-label="Sections" className="fixed inset-x-0 top-3 z-40 flex justify-center px-3">
        <div className="nav-scroll flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full bg-paper/90 px-1 py-1 shadow-sm ring-1 ring-ink/10 backdrop-blur-md">
          {SECTIONS.map((section) => {
            const current = active === section.id
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => go(section.id)}
                aria-label={section.label}
                aria-current={current ? 'true' : undefined}
                className={`flex h-9 shrink-0 items-center justify-center rounded-full px-2 text-[0.58rem] uppercase tracking-[0.08em] transition sm:px-3 sm:text-[0.62rem] sm:tracking-[0.14em] ${current ? 'bg-wine text-cream' : 'text-ink-soft hover:text-ink'}`}
              >
                {section.label}
              </button>
            )
          })}
          <button
            type="button"
            onClick={onOpenGifts}
            className="flex h-9 shrink-0 items-center justify-center rounded-full px-2 text-[0.58rem] uppercase tracking-[0.08em] text-rose-deep transition hover:bg-blush/60 sm:px-3 sm:text-[0.62rem] sm:tracking-[0.14em]"
          >
            Gifts ♡
          </button>
        </div>
      </nav>
    </>
  )
}
