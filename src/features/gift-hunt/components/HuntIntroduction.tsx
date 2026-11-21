import { Gift } from 'lucide-react'
import type { GiftHuntIntro } from '../data/types'
import { Ornament } from '../../../components/Ornament'

export function HuntIntroduction({ intro, onBegin }: { intro: GiftHuntIntro; onBegin: () => void }) {
  return (
    <section className="mx-auto max-w-xl px-5 py-16 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blush/70 text-rose-deep shadow-sm">
        <Gift className="h-10 w-10" aria-hidden="true" />
      </div>
      <h1 className="mt-8 font-serif text-5xl italic leading-tight text-ink md:text-6xl">{intro.title}</h1>
      <Ornament />
      <p className="mx-auto mt-6 max-w-md text-base font-light leading-relaxed text-ink-soft md:text-lg">
        {intro.subtitle}
      </p>
      <ol className="mx-auto mt-8 max-w-sm space-y-2 text-left text-sm font-light text-ink-soft">
        <li>1. Read the clue when its time arrives.</li>
        <li>2. Find the little gift, and the code kept with it.</li>
        <li>3. The next surprise waits for its own hour, even if you are early.</li>
      </ol>
      <button
        type="button"
        onClick={onBegin}
        className="mt-10 inline-flex rounded-full border border-gold/50 px-8 py-3.5 text-[0.72rem] uppercase tracking-[0.26em] text-ink transition hover:bg-wine hover:text-cream"
      >
        {intro.cta}
      </button>
    </section>
  )
}
