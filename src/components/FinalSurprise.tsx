import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { finale } from '../data/letter'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { SectionHeading } from './SectionHeading'

const SPARKS = Array.from({ length: 14 }, (_, index) => ({
  id: `s${index}`,
  x: Math.cos((index / 14) * Math.PI * 2) * (70 + (index % 3) * 18),
  y: Math.sin((index / 14) * Math.PI * 2) * (54 + (index % 4) * 12),
}))

function GiftBox({ open }: { open: boolean }) {
  return (
    <div className="relative mx-auto h-56 w-56">
      {open ? (
        <motion.div
          className="absolute left-1/2 top-16 h-20 w-32 -translate-x-1/2 rounded-full bg-gold-bright/50 blur-2xl"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          aria-hidden="true"
        />
      ) : null}
      <motion.div
        className="absolute left-1/2 top-10 z-20 h-12 w-36 rounded-t-md bg-[#6d3a44] shadow-md"
        style={{ originX: 0.5, originY: 1 }}
        initial={false}
        animate={open ? { x: '-50%', y: -52, rotate: -18 } : { x: '-50%', y: 0, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 170, damping: 16 }}
      >
        <span className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2 bg-gold-bright" />
      </motion.div>
      <div className="absolute bottom-6 left-1/2 h-28 w-36 -translate-x-1/2 overflow-hidden rounded-md bg-rose-deep shadow-xl">
        <span className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2 bg-gold-bright" />
        <span className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 bg-gold-bright" />
        {open ? <span className="absolute inset-x-3 top-2 h-10 rounded-full bg-gold-bright/60 blur-md" /> : null}
      </div>
      {open
        ? SPARKS.map((spark, index) => (
            <motion.span
              key={spark.id}
              className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-gold-bright"
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{ x: spark.x, y: spark.y, opacity: [0, 1, 0] }}
              transition={{ duration: 1.3, delay: index * 0.02 }}
            />
          ))
        : null}
    </div>
  )
}

export function FinalSurprise({ onReplay }: { onReplay: () => void }) {
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(false)
  const messageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) messageRef.current?.focus()
  }, [open])

  return (
    <section
      id="finale"
      className="relative scroll-mt-20 overflow-hidden px-5 py-28 text-cream md:py-36"
      style={{
        background:
          'radial-gradient(800px 420px at 50% 0%, rgba(143,78,86,0.55), transparent 60%), #140e10',
        paddingBottom: 'calc(7rem + env(safe-area-inset-bottom))',
      }}
    >
      <SectionHeading eyebrow="The last page" title="And one last thing..." light />

      <div className="mx-auto max-w-xl text-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={open}
          aria-label={open ? 'Your gift is open' : 'Open your gift'}
          className="mx-auto block disabled:cursor-default"
        >
          <GiftBox open={open} />
          {open ? null : (
            <span className="mt-2 block text-[0.68rem] uppercase tracking-[0.28em] text-gold-bright">
              Open it
            </span>
          )}
        </button>

        {open ? (
          <motion.div
            ref={messageRef}
            tabIndex={-1}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : 0.35 }}
            className="mx-auto mt-4 max-w-lg outline-none"
          >
            {finale.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-4 font-serif text-2xl leading-relaxed text-cream/95 md:text-3xl">
                {paragraph}
              </p>
            ))}
            <p className="mt-8 font-serif text-xl text-gold-bright">{finale.closing}</p>
            <p className="mt-1 font-script text-5xl text-gold-bright">{finale.signature}</p>
            <button
              type="button"
              onClick={onReplay}
              className="mt-12 inline-flex rounded-full bg-cream px-8 py-3.5 text-[0.72rem] uppercase tracking-[0.26em] text-ink transition hover:bg-gold-bright"
            >
              Replay Our Little World
            </button>
          </motion.div>
        ) : null}
      </div>
    </section>
  )
}
