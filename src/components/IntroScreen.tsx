import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { FloatingHearts } from './FloatingHearts'

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + index * 0.16, duration: 0.8, ease: 'easeOut' as const },
  }),
}

export function IntroScreen({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden px-6 py-16 text-center text-cream">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(900px 520px at 50% 38%, rgba(143,78,86,0.45), transparent 62%), radial-gradient(700px 420px at 50% 80%, rgba(176,137,104,0.16), transparent 60%), #140e10',
        }}
      />
      <div className="glow-orb pointer-events-none absolute left-1/2 top-[38%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-deep/30 blur-3xl" />
      <FloatingHearts tone="dark" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(20,14,16,0.72)_100%)]" />

      <div className="relative z-10 mx-auto max-w-xl">
        <motion.p
          className="font-serif text-3xl italic leading-snug text-cream md:text-5xl"
          variants={fade}
          initial="hidden"
          animate="show"
          custom={0}
        >
          <span className="block">A little something,</span>
          <span className="block">made just for you...</span>
        </motion.p>
        <motion.h1
          className="mt-8 flex items-center justify-center gap-3 font-script text-6xl text-gold-bright md:text-7xl"
          variants={fade}
          initial="hidden"
          animate="show"
          custom={1}
        >
          Hey Mumma
          <Heart className="h-6 w-6 fill-rose text-rose md:h-7 md:w-7" aria-hidden="true" />
        </motion.h1>
        <motion.div variants={fade} initial="hidden" animate="show" custom={2}>
          <button
            type="button"
            onClick={onOpen}
            className="mt-12 inline-flex items-center rounded-full border border-gold-bright/70 px-8 py-3.5 text-[0.72rem] uppercase tracking-[0.28em] text-gold-bright transition hover:bg-cream hover:text-ink"
          >
            Open Your Surprise
          </button>
          <p className="mt-8 text-[0.68rem] uppercase tracking-[0.32em] text-cream/55">From Babuu</p>
        </motion.div>
      </div>
    </section>
  )
}
