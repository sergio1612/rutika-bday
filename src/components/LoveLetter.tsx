import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { letter } from '../data/letter'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { SectionHeading } from './SectionHeading'

function Envelope({ opening, onOpen }: { opening: boolean; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="mx-auto block w-full max-w-sm"
      aria-label="Open the letter from Babuu"
    >
      <span className="relative mx-auto block h-64 w-full">
        <span className="absolute inset-x-5 top-4 z-0 h-36 rounded-sm bg-paper shadow-md" />
        <motion.span
          className="absolute inset-x-0 top-6 z-20 h-32 origin-top bg-[#efe2d4] shadow-sm"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            transformOrigin: 'top center',
            backfaceVisibility: 'hidden',
          }}
          animate={{ rotateX: opening ? -168 : 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
        <span
          className="absolute inset-x-0 bottom-0 z-10 h-44 rounded-b-2xl bg-gradient-to-b from-[#e7d6c6] to-[#d9c3ae] shadow-xl"
          style={{ clipPath: 'polygon(0 18%, 50% 58%, 100% 18%, 100% 100%, 0 100%)' }}
        />
        <motion.span
          className="absolute left-1/2 top-[46%] z-30 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-wine font-serif text-2xl text-gold-bright shadow-lg ring-2 ring-gold-bright/70"
          animate={{ scale: opening ? 0.6 : 1, opacity: opening ? 0 : 1 }}
          aria-hidden="true"
        >
          B
        </motion.span>
      </span>
      <span className="mt-2 block text-center font-script text-4xl text-rose-deep">For Mumma</span>
      <span className="mt-2 block text-center text-[0.68rem] uppercase tracking-[0.28em] text-gold">
        Open the letter
      </span>
    </button>
  )
}

export function LoveLetter() {
  const reduced = useReducedMotion()
  const letterRef = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState<'closed' | 'opening' | 'open'>('closed')

  useEffect(() => {
    if (phase !== 'opening') return
    const id = window.setTimeout(() => setPhase('open'), reduced ? 0 : 720)
    return () => window.clearTimeout(id)
  }, [phase, reduced])

  useEffect(() => {
    if (phase === 'open') letterRef.current?.focus()
  }, [phase])

  return (
    <section id="letter" className="scroll-mt-20 px-5 py-24 md:px-8 md:py-32">
      <SectionHeading eyebrow="A letter from Babuu" title="Something I want you to know..." />

      <div className="mx-auto max-w-xl [perspective:1000px]">
        <AnimatePresence mode="wait">
          {phase !== 'open' ? (
            <motion.div
              key="envelope"
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35 }}
            >
              <Envelope opening={phase === 'opening'} onOpen={() => setPhase('opening')} />
            </motion.div>
          ) : (
            <motion.article
              key="letter"
              ref={letterRef}
              tabIndex={-1}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="bg-paper px-6 py-10 shadow-[0_24px_70px_rgba(74,44,50,0.1)] ring-1 ring-gold-soft outline-none md:px-12 md:py-14"
              aria-label="Letter from Babuu"
            >
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-gold">{letter.date}</p>
              <p className="mt-6 font-serif text-2xl text-ink">{letter.salutation}</p>
              <div className="mt-6 space-y-5">
                {letter.paragraphs.map((paragraph, index) => (
                  <motion.p
                    key={paragraph}
                    className="font-serif text-xl leading-relaxed text-ink/90 md:text-[1.35rem]"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + index * 0.12, duration: 0.5 }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
              <p className="mt-8 font-serif text-xl text-ink">{letter.closing}</p>
              <p className="mt-2 font-script text-5xl text-rose-deep">{letter.signature}</p>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
