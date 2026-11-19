import { useState } from 'react'
import { motion } from 'framer-motion'
import { reasons, reasonsIntro } from '../data/reasons'
import { SectionHeading } from './SectionHeading'

export function LoveReasons() {
  const [opened, setOpened] = useState<Record<number, boolean>>({})
  const count = Object.values(opened).filter(Boolean).length

  const toggle = (id: number) => {
    setOpened((current) => ({ ...current, [id]: !current[id] }))
  }

  return (
    <section id="reasons" className="scroll-mt-20 px-5 py-24 md:px-8 md:py-32">
      <SectionHeading eyebrow="For you" title="24 Reasons Why I Love You" subtitle={reasonsIntro} />

      <p className="mb-8 text-center text-sm tracking-wide text-ink-soft" aria-live="polite">
        {count === reasons.length ? 'All twenty-four, opened for you.' : `${count} of ${reasons.length} opened`}
      </p>

      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
        {reasons.map((reason) => {
          const open = Boolean(opened[reason.id])
          return (
            <li key={reason.id}>
              <button
                type="button"
                onClick={() => toggle(reason.id)}
                aria-expanded={open}
                aria-label={`${open ? 'Close' : 'Open'} reason ${reason.id}: ${reason.label}`}
                className="h-48 w-full [perspective:900px]"
              >
                <motion.span
                  animate={{ rotateY: open ? 180 : 0 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="relative block h-full w-full [transform-style:preserve-3d]"
                >
                  <span
                    className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-paper px-4 text-center shadow-sm ring-1 ring-gold/25"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                  >
                    <span className="font-script text-4xl text-rose-deep">
                      {String(reason.id).padStart(2, '0')}
                    </span>
                    <span className="mt-2 font-serif text-xl leading-tight text-ink">{reason.label}</span>
                    <span className="mt-3 text-[0.62rem] uppercase tracking-[0.22em] text-gold">Open</span>
                  </span>
                  <span
                    className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-paper to-blush/50 px-4 text-center ring-1 ring-rose/30"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <span className="max-h-28 overflow-y-auto font-serif text-lg leading-snug text-ink">
                      {reason.note}
                    </span>
                    <span className="mt-3 text-[0.62rem] uppercase tracking-[0.22em] text-gold">Close</span>
                  </span>
                </motion.span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
