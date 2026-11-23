import { motion } from 'framer-motion'
import { birthdayLabel, getBirthdayPhase } from '../data/site'
import { Confetti } from './Confetti'
import { Ornament } from './Ornament'
import { Petals } from './Petals'

export function BirthdayHero() {
  const phase = getBirthdayPhase()
  const label = birthdayLabel()

  return (
    <section
      id="birthday"
      className="relative flex min-h-svh scroll-mt-20 items-center justify-center overflow-hidden px-5 py-28 text-center"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/60 blur-3xl" />
      <Petals />
      <Confetti />

      <div className="relative z-10 mx-auto max-w-3xl">
        <motion.p
          className="text-[0.72rem] uppercase tracking-[0.36em] text-gold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {label}
        </motion.p>
        <Ornament />
        <h1 className="mt-6">
          <motion.span
            className="block font-serif text-sm uppercase tracking-[0.42em] text-rose-deep md:text-base"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Happy Birthday
          </motion.span>
          <motion.span
            className="mt-4 block font-serif text-6xl italic leading-[0.95] text-ink sm:text-7xl md:text-8xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.22 }}
          >
            My Rutu
          </motion.span>
        </h1>
        <motion.p
          className="mx-auto mt-8 max-w-md text-base font-light leading-relaxed text-ink-soft md:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          To the girl who makes my world a little more beautiful every single day.
        </motion.p>

        {phase.phase === 'before' ? null : (
          <p className="mt-12 font-serif text-3xl italic text-rose-deep md:text-4xl">
            {phase.phase === 'today' ? 'Today is yours' : 'And every day after'}
          </p>
        )}
      </div>
    </section>
  )
}
