import { useState } from 'react'
import { motion } from 'framer-motion'
import type { HuntLetter } from '../data/types'
import { Ornament } from '../../../components/Ornament'

export function FinalLetter({
  letter,
  opened,
  onOpen,
}: {
  letter: HuntLetter
  opened: boolean
  onOpen: () => void
}) {
  const [localOpen, setLocalOpen] = useState(opened)
  const show = opened || localOpen

  return (
    <section className="mx-auto mt-20 max-w-xl px-5 text-center" aria-label="Final letter">
      <p className="text-[0.72rem] uppercase tracking-[0.28em] text-gold-bright">For the end of the hunt</p>
      <h2 className="mt-4 font-serif text-4xl italic text-cream md:text-5xl">{letter.heading}</h2>
      <Ornament className="text-gold-bright" />
      <p className="mx-auto mt-6 max-w-md font-serif text-xl leading-relaxed text-cream/90">{letter.preamble}</p>
      {show ? (
        <article className="mt-8 bg-paper px-6 py-10 text-left shadow-xl ring-1 ring-gold-soft md:px-10" tabIndex={-1}>
          {letter.sections.map((section, index) => (
            <motion.p
              key={section.letterSectionId}
              className="mt-5 font-serif text-xl leading-relaxed text-ink first:mt-0"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
            >
              {section.text}
            </motion.p>
          ))}
          <p className="mt-8 font-serif text-lg text-ink">{letter.closing}</p>
          <p className="mt-1 font-script text-5xl text-rose-deep">{letter.signature}</p>
        </article>
      ) : (
        <button
          type="button"
          onClick={() => {
            setLocalOpen(true)
            onOpen()
          }}
          className="mx-auto mt-8 block w-full max-w-sm rounded-3xl bg-[#efe2d4] px-6 py-10 shadow-lg"
        >
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-wine font-serif text-2xl text-gold-bright">
            B
          </span>
          <span className="mt-4 block font-script text-4xl text-rose-deep">Open the letter</span>
        </button>
      )}
    </section>
  )
}
