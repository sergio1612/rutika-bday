import { useState } from 'react'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { reasons, reasonsIntro } from '../data/reasons'
import { SectionHeading } from './SectionHeading'

const faceStyle = {
  backfaceVisibility: 'hidden' as const,
  WebkitBackfaceVisibility: 'hidden' as const,
}

export function LoveReasons() {
  const [opened, setOpened] = useState<Record<string, boolean>>({})
  const count = reasons.filter((reason) => opened[reason.reasonId]).length

  const toggle = (reasonId: string) => {
    setOpened((current) => ({ ...current, [reasonId]: !current[reasonId] }))
  }

  return (
    <section id="reasons" className="scroll-mt-20 px-5 py-24 md:px-8 md:py-32">
      <SectionHeading eyebrow="For you" title="24 Reasons Why I Love You ♡" subtitle={reasonsIntro} />

      <p className="mb-8 text-center text-sm tracking-wide text-ink-soft" aria-live="polite">
        {count === reasons.length ? 'All twenty-four, opened for you.' : `${count} of ${reasons.length} opened`}
      </p>

      <ul className="mx-auto grid max-w-6xl grid-cols-2 items-start gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
        {reasons.map((reason) => {
          const open = Boolean(opened[reason.reasonId])
          const number = String(reason.number).padStart(2, '0')
          return (
            <li key={reason.reasonId}>
              <button
                type="button"
                onClick={() => toggle(reason.reasonId)}
                aria-expanded={open}
                aria-label={`${open ? 'Close' : 'Open'} reason ${number}: ${reason.title}`}
                className="group w-full [perspective:900px]"
              >
                <motion.span
                  animate={{ rotateY: open ? 180 : 0 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="relative block w-full [transform-style:preserve-3d]"
                >
                  <span
                    className={`${open ? 'invisible absolute inset-0' : 'relative'} flex min-h-48 flex-col items-center justify-center rounded-2xl px-4 py-5 text-center shadow-sm ring-1 transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md ${
                      reason.special
                        ? 'bg-gradient-to-br from-blush via-paper to-blush/70 ring-rose/40'
                        : 'bg-paper ring-gold/25'
                    }`}
                    style={faceStyle}
                  >
                    {reason.special ? (
                      <Heart className="mb-1 h-4 w-4 fill-rose text-rose" aria-hidden="true" />
                    ) : null}
                    <span className="text-2xl leading-none" aria-hidden="true">
                      {reason.emoji}
                    </span>
                    <span className="mt-2 font-script text-4xl text-rose-deep">{number}</span>
                    <span className="mt-2 font-serif text-lg leading-tight text-ink">{reason.title}</span>
                    <span className="mt-3 text-[0.62rem] uppercase tracking-[0.22em] text-gold">Open</span>
                  </span>
                  <span
                    className={`${open ? 'relative' : 'absolute inset-0'} flex flex-col items-center justify-center rounded-2xl px-4 py-5 text-center shadow-sm ring-1 ${
                      reason.special
                        ? 'bg-gradient-to-br from-blush via-paper to-rose/20 ring-rose/45'
                        : 'bg-gradient-to-br from-paper to-blush/50 ring-rose/30'
                    }`}
                    style={{ ...faceStyle, transform: 'rotateY(180deg)' }}
                  >
                    {reason.special ? (
                      <Heart className="mb-1 h-4 w-4 fill-rose text-rose" aria-hidden="true" />
                    ) : null}
                    <span className="text-2xl leading-none" aria-hidden="true">
                      {reason.emoji}
                    </span>
                    <span className="mt-2 font-serif text-lg leading-tight text-ink">{reason.title}</span>
                    <span className="mt-3 font-serif text-base leading-relaxed text-ink">{reason.description}</span>
                    <span className="mt-4 text-[0.62rem] uppercase tracking-[0.22em] text-gold">Close</span>
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
